"use client";

import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameEventPayload, RushGame } from "@/types/Game";
import SunriseCountdown from "./SunriseCountdown";

const DEFAULT_TIME_PENALTY = 5;
const DEBUG_RUSH = process.env.NEXT_PUBLIC_RUSH_DEBUG === "1";
const STORAGE_KEY = "rush:dailyRun";
const DAILY_META_KEY = "rush:dailyMeta";

const getDailyResetTime = (now: Date) => {
  const reset = new Date(now);
  reset.setHours(23, 59, 0, 0);
  return reset;
};

const getDailyWindowKey = (now: Date = new Date()) => {
  const reset = getDailyResetTime(now);
  const windowDate = new Date(reset);
  if (now < reset) {
    windowDate.setDate(windowDate.getDate() - 1);
  }
  const year = windowDate.getFullYear();
  const month = `${windowDate.getMonth() + 1}`.padStart(2, "0");
  const day = `${windowDate.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

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
  penaltyCount: number;
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
  const [dailyLocked, setDailyLocked] = useState(false);
  const [penaltyCount, setPenaltyCount] = useState(0);
  const pendingAdvance = useRef<{ stageIndex: number } | null>(null);
  const advanceGuard = useRef(false);
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Tracks the current game instance so stale callbacks from unmounted
  // game components (pending setTimeouts) can be detected and ignored.
  const gameInstanceRef = useRef(gameInstance);
  gameInstanceRef.current = gameInstance;

  const persistProgress = useCallback(
    (payload: {
      phase: "idle" | "playing" | "finished";
      sequenceIds: string[];
      currentIndex: number;
      score: number;
      timeElapsed: number;
      notes: string[];
    }) => {
      try {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // Ignore persistence errors.
      }
    },
    []
  );

  const clearProgress = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore persistence errors.
    }
  }, []);

  const refreshDailyLock = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(DAILY_META_KEY);
      if (!raw) {
        setDailyLocked(false);
        return;
      }
      const parsed = JSON.parse(raw) as { lastCompletedWindowKey?: string };
      setDailyLocked(parsed.lastCompletedWindowKey === getDailyWindowKey());
    } catch {
      setDailyLocked(false);
    }
  }, []);

  const lockTodayRun = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(
        DAILY_META_KEY,
        JSON.stringify({ lastCompletedWindowKey: getDailyWindowKey() })
      );
      setDailyLocked(true);
    } catch {
      // Ignore persistence errors.
    }
  }, []);

  useEffect(() => {
    refreshDailyLock();
    const timer = setInterval(refreshDailyLock, 30000);
    return () => clearInterval(timer);
  }, [refreshDailyLock]);

  useEffect(() => {
    if (phase !== "idle") return;
    try {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        phase?: "idle" | "playing" | "finished";
        sequenceIds?: string[];
        currentIndex?: number;
        score?: number;
        timeElapsed?: number;
        notes?: string[];
      };
      if (parsed.phase !== "playing" || !parsed.sequenceIds?.length) return;
      const gameLookup = new Map(games.map((game) => [game.id, game]));
      const restoredSequence = parsed.sequenceIds
        .map((id) => gameLookup.get(id))
        .filter((game): game is RushGame => Boolean(game));

      // If any saved game is no longer available (e.g. removed from dailyGames),
      // the saved run is stale — discard it rather than restoring a broken sequence.
      if (restoredSequence.length !== parsed.sequenceIds.length || restoredSequence.length === 0) {
        clearProgress();
        return;
      }

      setSequence(restoredSequence);
      setPhase("playing");
      setCurrentIndex(Math.min(parsed.currentIndex ?? 0, restoredSequence.length - 1));
      setScore(parsed.score ?? 0);
      setTimeElapsed(parsed.timeElapsed ?? 0);
      setNotes(parsed.notes ?? []);
      setGameInstance((prev) => prev + 1);
      setIsTransitioning(false);
      setShareNote(null);
      setRunFailed(false);

      if (DEBUG_RUSH) {
        console.log("[Rush][restore]", {
          currentIndex: parsed.currentIndex ?? 0,
          totalStages: restoredSequence.length,
          timeElapsed: parsed.timeElapsed ?? 0
        });
      }
    } catch {
      // Ignore restore errors.
    }
  }, [phase, games, clearProgress]);

  const startRun = useCallback(() => {
    // Clear any saved progress so a fresh run always starts clean.
    clearProgress();

    const selection: RushGame[] = [];
    const shuffled = [...games];
    for (let i = 0; i < (stageCount || 1); i += 1) {
      if (i % shuffled.length === 0) {
        shuffled.sort(() => Math.random() - 0.5);
      }
      selection.push(shuffled[i % shuffled.length]);
    }

    pendingAdvance.current = null;
    advanceGuard.current = false;
    if (completionTimer.current) {
      clearTimeout(completionTimer.current);
      completionTimer.current = null;
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
    setPenaltyCount(0);
    setSuccessOverlay(null);

    persistProgress({
      phase: "playing",
      sequenceIds: selection.map((game) => game.id),
      currentIndex: 0,
      score: 0,
      timeElapsed: 0,
      notes: []
    });
  }, [games, stageCount, persistProgress, clearProgress]);

  useEffect(() => {
    if (phase !== "playing") return;

    setTimeElapsed(0);
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  const currentGame = phase === "playing" ? sequence[currentIndex] ?? null : null;

  const advanceToNextGame = useCallback(
    (stageIndexValue: number, source: "success" | "complete") => {
      if (advanceGuard.current) return;
      if (completionTimer.current) {
        clearTimeout(completionTimer.current);
        completionTimer.current = null;
      }
      advanceGuard.current = true;
      setIsTransitioning(true);
      const isFinalStage = stageIndexValue >= (stageCount || 1) - 1;
      const nextIndex = stageIndexValue + 1;

      if (DEBUG_RUSH) {
        console.log("[Rush][advance]", {
          source,
          currentIndex: stageIndexValue,
          totalStages: stageCount || 1,
          nextIndex,
          isFinalStage
        });
      }

      completionTimer.current = setTimeout(() => {
        setIsTransitioning(false);
        if (isFinalStage) {
          setPhase("finished");
          clearProgress();
          return;
        }
        setCurrentIndex(nextIndex);
        setGameInstance((prev) => prev + 1);
        advanceGuard.current = false;
        persistProgress({
          phase: "playing",
          sequenceIds: sequence.map((game) => game.id),
          currentIndex: nextIndex,
          score,
          timeElapsed,
          notes
        });
      }, 220);
    },
    [clearProgress, notes, persistProgress, score, sequence, stageCount, timeElapsed]
  );

  const resolveStage = useCallback(
    (result: "success" | "fail" | "complete", payload?: GameEventPayload) => {
      if (phase !== "playing" || !currentGame) return;

      const scoreDelta = payload?.scoreDelta;
      if (typeof scoreDelta === "number") {
        setScore((prev) => prev + scoreDelta);
      }

      if (payload?.note) {
        setNotes((prev) => [...prev, `${currentGame.name}: ${payload.note}`]);
      }

      if (result === "fail") {
        const penalty = payload?.timePenalty ?? DEFAULT_TIME_PENALTY;
        setTimeElapsed((prev) => prev + penalty);
        setPenaltyCount((prev) => prev + 1);
        if (payload?.retry) {
          return;
        }
        setRunFailed(true);
        setPhase("finished");
        clearProgress();
        return;
      }

      if (result === "success") {
        if (pendingAdvance.current) return;
        pendingAdvance.current = { stageIndex: currentIndex };
        const isFinalStage = currentIndex >= (stageCount || 1) - 1;
        setSuccessOverlay({ finalStage: isFinalStage });
        return;
      }

      advanceToNextGame(currentIndex, "complete");
    },
    [phase, currentGame, currentIndex, stageCount, advanceToNextGame, clearProgress]
  );

  // Wrap handlers with a game-instance capture so stale callbacks from
  // unmounted game components (pending setTimeouts) are silently dropped.
  const handlers = useMemo(() => {
    const capturedInstance = gameInstance;
    return {
      onSuccess: (payload?: GameEventPayload) => {
        if (capturedInstance !== gameInstanceRef.current) return;
        resolveStage("success", payload);
      },
      onFail: (payload?: GameEventPayload) => {
        if (capturedInstance !== gameInstanceRef.current) return;
        resolveStage("fail", payload);
      },
      onComplete: (payload?: GameEventPayload) => {
        if (capturedInstance !== gameInstanceRef.current) return;
        resolveStage("complete", payload);
      },
    };
  }, [resolveStage, gameInstance]);

  const acknowledgeSuccess = useCallback(() => {
    if (!pendingAdvance.current) return;
    const { stageIndex } = pendingAdvance.current;
    pendingAdvance.current = null;
    setSuccessOverlay(null);
    advanceToNextGame(stageIndex, "success");
  }, [advanceToNextGame]);

  const formattedTime = formatTime(timeElapsed);

  useEffect(() => {
    if (phase !== "playing") return;
    persistProgress({
      phase,
      sequenceIds: sequence.map((game) => game.id),
      currentIndex,
      score,
      timeElapsed,
      notes
    });
  }, [phase, sequence, currentIndex, score, timeElapsed, notes, persistProgress]);

  useEffect(() => {
    return () => {
      if (completionTimer.current) {
        clearTimeout(completionTimer.current);
        completionTimer.current = null;
      }
    };
  }, []);

  let stageNode: ReactNode = null;

  if (phase === "idle") {
    stageNode = (
      <div className="flex h-full flex-col items-center justify-center gap-8 text-center">
        <p className="text-base text-charcoal/70 max-w-[280px] leading-relaxed">
          Today&apos;s run features composed decisions. Preserve calm, react with precision.
        </p>
        <button
          onClick={startRun}
          className="rounded-full border border-charcoal/10 bg-charcoal px-12 py-4 text-sm uppercase tracking-[0.35em] text-ivory hover:bg-charcoal/90"
        >
          Begin Run
        </button>
      </div>
    );
  } else if (phase === "finished") {
    stageNode = (
      <div className="flex h-full flex-col items-center justify-center gap-8 text-center">
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs uppercase tracking-[0.35em] text-warmGrey">Final Time</p>
          <p className="font-serif text-8xl text-charcoal">{formattedTime}</p>
          <p className="text-sm text-charcoal/60">
            {runFailed ? "Run interrupted." : "Daily run complete."}
          </p>
        </div>
        {!runFailed && (
          <button
            onClick={async () => {
              const payload = `Completed THE RUSH in ${formattedTime}.`;
              try {
                if (navigator.share) {
                  await navigator.share({ title: "The Rush", text: payload });
                  setShareNote("Shared.");
                  return;
                }
                await navigator.clipboard.writeText(payload);
                setShareNote("Copied.");
              } catch {
                setShareNote("Unavailable.");
              }
            }}
            className="rounded-full border border-rosegold/50 bg-white/70 px-10 py-4 text-sm uppercase tracking-[0.3em] text-charcoal transition hover:shadow-subtle"
          >
            Share
          </button>
        )}
        {shareNote && <p className="text-xs text-charcoal/50">{shareNote}</p>}
        <button
          onClick={startRun}
          className="rounded-full border border-charcoal/20 bg-white/70 px-10 py-4 text-sm uppercase tracking-[0.3em] text-charcoal transition hover:bg-white"
        >
          Play Again
        </button>
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
        acknowledgeSuccess,
        penaltyCount
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
