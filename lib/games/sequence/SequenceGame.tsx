"use client";

import { useMemo, useState } from "react";
import type { GameProps } from "@/types/Game";

type DifficultyLabel = "Easy" | "Medium" | "Decently Hard";
type SequenceMode = "Arithmetic" | "Triangular" | "Fibonacci" | "Powers" | "Alternating" | "Squares";

type SequenceRound = {
  mode: SequenceMode;
  difficulty: DifficultyLabel;
  sequence: number[];
  missingIndex: number;
  answer: number;
  options: number[];
  points: number;
};

const ROUNDS: SequenceRound[] = [
  {
    mode: "Arithmetic",
    difficulty: "Easy",
    sequence: [2, 4, 6, 8, 10],
    missingIndex: 3,
    answer: 8,
    options: [6, 7, 8, 9],
    points: 35
  },
  {
    mode: "Triangular",
    difficulty: "Medium",
    sequence: [3, 6, 10, 15, 21],
    missingIndex: 4,
    answer: 21,
    options: [20, 21, 22, 24],
    points: 45
  },
  {
    mode: "Alternating",
    difficulty: "Decently Hard",
    sequence: [7, 11, 18, 29, 47],
    missingIndex: 2,
    answer: 18,
    options: [16, 17, 18, 21],
    points: 60
  },
  {
    mode: "Fibonacci",
    difficulty: "Medium",
    sequence: [2, 3, 5, 8, 13],
    missingIndex: 3,
    answer: 8,
    options: [7, 8, 9, 10],
    points: 45
  },
  {
    mode: "Powers",
    difficulty: "Decently Hard",
    sequence: [2, 4, 8, 16, 32],
    missingIndex: 2,
    answer: 8,
    options: [6, 7, 8, 9],
    points: 60
  },
  {
    mode: "Squares",
    difficulty: "Decently Hard",
    sequence: [1, 4, 9, 16, 25],
    missingIndex: 3,
    answer: 16,
    options: [14, 15, 16, 18],
    points: 60
  }
];

const shuffle = <T,>(items: T[]) => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

const SequenceGame = ({ onSuccess, onFail }: GameProps) => {
  const rounds = useMemo(
    () => shuffle(ROUNDS).slice(0, 4).map((round) => ({ ...round, options: shuffle(round.options) })),
    []
  );
  const [roundIndex, setRoundIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const currentRound = rounds[roundIndex];

  const handleChoice = (option: number, index: number) => {
    if (!currentRound || locked) return;

    setSelected(index);
    const isCorrect = option === currentRound.answer;

    if (!isCorrect) {
      onFail({ retry: true, timePenalty: 4, note: "Wrong number" });
      setTimeout(() => setSelected(null), 280);
      return;
    }

    setLocked(true);
    const nextScore = totalScore + currentRound.points;
    setTotalScore(nextScore);

    setTimeout(() => {
      if (roundIndex >= rounds.length - 1) {
        onSuccess({ scoreDelta: nextScore, note: "Sequence completed" });
        return;
      }
      setRoundIndex((prev) => prev + 1);
      setSelected(null);
      setLocked(false);
    }, 340);
  };

  if (!currentRound) {
    return <div className="flex h-full items-center justify-center text-sm text-charcoal/60">Preparing sequence...</div>;
  }

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-warmGrey">
          Sequence - Round {roundIndex + 1} of {rounds.length}
        </p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-charcoal/55">{currentRound.mode}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.28em] text-charcoal/65">{currentRound.difficulty}</p>
        <p className="mt-3 font-serif text-2xl text-charcoal">
          {currentRound.sequence
            .map((value, index) => (index === currentRound.missingIndex ? "?" : value.toString()))
            .join("   ")}
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-md gap-3">
        {currentRound.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrectChoice = option === currentRound.answer;
          const tone = isSelected
            ? isCorrectChoice
              ? "border-rosegold/60 bg-rosegold/10"
              : "border-rosegold/45 bg-rosegold/5"
            : "border-white/70 bg-white/70";

          return (
            <button
              key={`${currentRound.sequence.join("-")}-${option}`}
              type="button"
              onClick={() => handleChoice(option, index)}
              className={`rounded-[16px] border px-4 py-4 font-serif text-xl text-charcoal transition-all duration-200 ease-gentle ${tone}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SequenceGame;
