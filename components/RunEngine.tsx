"use client";

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameEventPayload, RushGame } from "@/types/Game";

const DEFAULT_TIME_PENALTY = 5;

type RunEngineState = {
  phase: "idle" | "playing" | "finished";
  currentGame: RushGame | null;
  currentIndex: number;
  totalStages: number;
  score: number;
  timeElapsed: number;
  notes: string[];
  start: () => void;
  stageNode: ReactNode;
  successOverlay: { finalStage: boolean } | null;
  acknowledgeSuccess: () => void;
};

type RunEngineProps = {
  games: RushGame[];
  totalTime?: number;
  sequenceLength?: number;
  children: (state: RunEngineState) => ReactNode;
};

const RunEngine = ({ games, totalTime = 20, sequenceLength = 5, children }: RunEngineProps) => {
  const stageCount = sequenceLength ?? games.length;
  const [phase, setPhase] = useState<"idle" | "playing" | "finished">("idle");
  const [sequence, setSequence] = useState<RushGame[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [notes, setNotes] = useState<string[]>([]);
  const [gameInstance, setGameInstance] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shareNote, setShareNote] = useState<string | null>(null);
  const [successOverlay, setSuccessOverlay] = useState<{ finalStage: boolean } | null>(null);
  const [runFailed, setRunFailed] = useState(false);
  const pendingAdvance = useRef<{ stageIndex: number } | null>(null);

  const startRun = useCallback(() => {
    const selection: RushGame[] = [];
    const shuffled = [...games];
    for (let i = 0; i < (stageCount || 1); i += 1) {
      if (i % shuffled.length === 0) {
        shuffled.sort(() => Math.random() - 0.5);
      }
      selection.push(shuffled[i % shuffled.length]);
    }

    setSequence(selection);
    setPhase("playing");
    setCurrentIndex(0);
    setScore(0);
    setTimeElapsed(0);
    setNotes([]);
    setGameInstance((prev) => prev + 1);
    setIsTransitioning(false);
    setShareNote(null);
    setRunFailed(false);
  }, [games, stageCount]);

  useEffect(() => {
    if (phase !== "playing") return;

    setTimeElapsed(0);
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  const currentGame = phase === "playing" ? sequence[currentIndex] ?? null : null;

  const finalizeStage = useCallback(
    (stageIndexValue: number, forceFinish = false) => {
      if (forceFinish) {
        setPhase("finished");
        return;
      }
      setIsTransitioning(true);
      setTimeout(() => {
        setIsTransitioning(false);
        const isFinalStage = stageIndexValue >= (stageCount || 1) - 1;
        if (isFinalStage) {
          setPhase("finished");
        } else {
          setCurrentIndex(stageIndexValue + 1);
          setGameInstance((prev) => prev + 1);
        }
      }, 220);
    },
    [stageCount]
  );

  const resolveStage = useCallback(
    (result: "success" | "fail" | "complete", payload?: GameEventPayload) => {
      if (phase !== "playing" || !currentGame) return;

      if (payload?.scoreDelta) {
        setScore((prev) => prev + payload.scoreDelta);
      }

      if (payload?.note) {
        setNotes((prev) => [...prev, `${currentGame.name}: ${payload.note}`]);
      }

      if (result === "fail") {
        const penalty = payload?.timePenalty ?? DEFAULT_TIME_PENALTY;
        setTimeElapsed((prev) => prev + penalty);
        if (payload?.retry) {
          return;
        }
        setRunFailed(true);
        finalizeStage(currentIndex, true);
        return;
      }

      if (result === "success") {
        pendingAdvance.current = { stageIndex: currentIndex };
        const isFinalStage = currentIndex >= (stageCount || 1) - 1;
        setSuccessOverlay({ finalStage: isFinalStage });
        return;
      }

      finalizeStage(currentIndex);
    },
    [phase, currentGame, currentIndex, stageCount, finalizeStage]
  );

  const handlers = useMemo(
    () => ({
      onSuccess: (payload?: GameEventPayload) => resolveStage("success", payload),
      onFail: (payload?: GameEventPayload) => resolveStage("fail", payload),
      onComplete: (payload?: GameEventPayload) => resolveStage("complete", payload)
    }),
    [resolveStage]
  );

  const acknowledgeSuccess = useCallback(() => {
    if (!pendingAdvance.current) return;
    const { stageIndex } = pendingAdvance.current;
    pendingAdvance.current = null;
    setSuccessOverlay(null);
    finalizeStage(stageIndex);
  }, [finalizeStage]);

  const formattedTime = formatTime(timeElapsed);

  let stageNode: ReactNode = null;

  if (phase === "idle") {
    stageNode = (
      <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
        <p className="text-sm text-charcoal/70">
          Today&apos;s run features composed decisions. Preserve calm, react with precision.
        </p>
        <button
          onClick={startRun}
          className="rounded-full border border-charcoal/10 bg-charcoal px-10 py-3 text-xs uppercase tracking-[0.35em] text-ivory hover:bg-charcoal/90"
        >
          Begin Run
        </button>
      </div>
    );
  } else if (phase === "finished") {
    stageNode = (
      <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-warmGrey">Final Time</p>
          <p className="font-serif text-5xl text-charcoal">{formattedTime}</p>
        </div>
        <p className="text-sm text-charcoal/70">
          {runFailed ? "Run interrupted. Begin anew." : "Daily run complete."}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {!runFailed && (
            <button
              onClick={async () => {
                const payload = `Completed THE RUSH in ${formattedTime}.`;
                try {
                  if (navigator.share) {
                    await navigator.share({ title: "The Rush", text: payload });
                    setShareNote("Shared with grace.");
                    return;
                  }
                  await navigator.clipboard.writeText(payload);
                  setShareNote("Copied to clipboard.");
                } catch (error) {
                  setShareNote("Sharing unavailable.");
                }
              }}
              className="rounded-full border border-rosegold/50 bg-white/70 px-8 py-3 text-xs uppercase tracking-[0.3em] text-charcoal transition hover:shadow-subtle"
            >
              Share Result
            </button>
          )}
          <button
            onClick={startRun}
            className="rounded-full border border-charcoal/20 bg-white/70 px-8 py-3 text-xs uppercase tracking-[0.3em] text-charcoal transition hover:bg-white"
          >
            Restart Run
          </button>
        </div>
        {shareNote && !runFailed && <p className="text-xs text-charcoal/50">{shareNote}</p>}
        {notes.length > 0 && (
          <ul className="space-y-1 text-xs text-charcoal/60">
            {notes.map((entry, idx) => (
              <li key={`${entry}-${idx}`}>{entry}</li>
            ))}
          </ul>
        )}
      </div>
    );
  } else if (phase === "playing" && currentGame) {
    const GameComponent = currentGame.component;
    stageNode = (
      <div className={`h-full w-full transition-opacity duration-200 ease-gentle ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        <GameComponent
          key={`${currentGame.id}-${gameInstance}`}
          {...handlers}
          status={{ timeElapsed, timeLeft: Math.max(0, totalTime - timeElapsed) }}
        />
      </div>
    );
  }

  return (
    <>{
      children({
        phase,
        currentGame,
        currentIndex,
        totalStages: stageCount || 1,
        score,
        timeElapsed,
        notes,
        start: startRun,
        stageNode,
        successOverlay,
        acknowledgeSuccess
      })
    }</>
  );
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default RunEngine;
