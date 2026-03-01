"use client";

import { useEffect, useMemo, useState } from "react";
import type { GameProps } from "@/types/Game";
import { calculateRoundScore, createEliminateSession, TOTAL_ELIMINATE_ROUNDS } from "./EliminateLogic";

const fadeDuration = 180;

const EliminateGame = ({ onSuccess, onFail }: GameProps) => {
  const puzzles = useMemo(() => {
    const difficulty = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;
    return createEliminateSession(TOTAL_ELIMINATE_ROUNDS, difficulty);
  }, []);
  const [roundIndex, setRoundIndex] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [interaction, setInteraction] = useState<{ index: number; type: "correct" | "wrong" } | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [roundResolved, setRoundResolved] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const puzzle = puzzles[roundIndex];

  useEffect(() => {
    if (!transitioning) {
      setInteraction(null);
      setFeedback(null);
    }
  }, [roundIndex, transitioning]);

  const handleAdvance = (nextTotal: number) => {
    setTimeout(() => {
      setTransitioning(true);
      setTimeout(() => {
        if (roundIndex >= TOTAL_ELIMINATE_ROUNDS - 1) {
          onSuccess({ scoreDelta: nextTotal, note: "Patterns eliminated" });
          return;
        }
        setRoundIndex((prev) => prev + 1);
        setWrongAttempts(0);
        setRoundResolved(false);
        setInteraction(null);
        setTransitioning(false);
      }, fadeDuration);
    }, 320);
  };

  const handleSelect = (index: number) => {
    if (!puzzle || roundResolved || transitioning) return;
    const isCorrect = index === puzzle.correctIndex;
    if (isCorrect) {
      setRoundResolved(true);
      setInteraction({ index, type: "correct" });
      const roundPoints = calculateRoundScore(wrongAttempts);
      const nextTotal = totalScore + roundPoints;
      setTotalScore(nextTotal);
      setFeedback("Beautiful deduction.");
      handleAdvance(nextTotal);
    } else {
      setInteraction({ index, type: "wrong" });
      setWrongAttempts((prev) => prev + 1);
      setFeedback("That choice still fits the set.");
      onFail({ note: "The intruder remains", retry: true, timePenalty: 5 });
      setTimeout(() => {
        setInteraction((prev) => (prev && prev.index === index && prev.type === "wrong" ? null : prev));
      }, 400);
    }
  };

  if (!puzzle) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-charcoal/60">Preparing puzzle…</div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 sm:mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-warmGrey">Eliminate — Round {roundIndex + 1} of {TOTAL_ELIMINATE_ROUNDS}</p>
        <p className="mt-1 sm:mt-2 text-[10px] uppercase tracking-[0.3em] text-charcoal/55">
          {puzzle.mode}: {puzzle.explanation}
        </p>
        <h3 className="mt-2 sm:mt-3 font-serif text-base sm:text-xl text-charcoal">Select the item that does not belong.</h3>
      </div>
      <div
        className={`flex-1 transition-opacity duration-200 ease-gentle ${transitioning ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <div className="grid h-full grid-cols-3 gap-2 sm:gap-5 content-center">
          {puzzle.items.map((item, index) => {
            const isActive = interaction?.index === index;
            const isWrong = isActive && interaction?.type === "wrong";
            const isCorrectTile = roundResolved && index === puzzle.correctIndex;
            const baseTone = isCorrectTile
              ? "border-rosegold/60 bg-rosegold/10"
              : isWrong
              ? "border-rosegold/40 bg-rosegold/5"
              : "border-white/70 bg-white/70";
            const accentShadow = isCorrectTile ? "shadow-[0_12px_30px_rgba(198,167,125,0.25)] scale-[1.01]" : "";
            const shakeClass = isWrong ? "animate-zipShake" : "";
            return (
              <button
                key={`${item}-${index}`}
                type="button"
                onClick={() => handleSelect(index)}
                className={`flex min-h-[60px] sm:min-h-[100px] flex-col justify-center rounded-[16px] border px-2 py-3 sm:px-4 sm:py-6 text-center transition-all duration-200 ease-gentle ${
                  baseTone
                } ${accentShadow} ${shakeClass}`}
              >
                <span className="font-serif text-sm sm:text-xl text-charcoal">{item}</span>
              </button>
            );
          })}
        </div>
        {feedback && <p className="mt-3 sm:mt-6 text-center text-xs sm:text-sm text-charcoal/60">{feedback}</p>}
      </div>
    </div>
  );
};

export default EliminateGame;
