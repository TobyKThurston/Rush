"use client";

import { useMemo, useState } from "react";
import type { GameProps } from "@/types/Game";

type DifficultyLabel = "Easy" | "Medium" | "Decently Hard";

type SequenceRound = {
  difficulty: DifficultyLabel;
  sequence: number[];
  missingIndex: number;
  answer: number;
  options: number[];
  points: number;
};

const ROUND_POOL: SequenceRound[] = [
  {
    difficulty: "Easy",
    sequence: [2, 4, 6, 8, 10],
    missingIndex: 3,
    answer: 8,
    options: [7, 8, 9],
    points: 35
  },
  {
    difficulty: "Easy",
    sequence: [5, 10, 15, 20, 25],
    missingIndex: 2,
    answer: 15,
    options: [12, 15, 18],
    points: 35
  },
  {
    difficulty: "Easy",
    sequence: [1996, 2000, 2004, 2008, 2012],
    missingIndex: 1,
    answer: 2000,
    options: [1999, 2000, 2002],
    points: 35
  },
  {
    difficulty: "Easy",
    sequence: [1994, 1998, 2002, 2006, 2010],
    missingIndex: 4,
    answer: 2010,
    options: [2008, 2009, 2010],
    points: 35
  },
  {
    difficulty: "Easy",
    sequence: [1, 3, 5, 7, 9],
    missingIndex: 0,
    answer: 1,
    options: [1, 2, 4],
    points: 35
  },
  {
    difficulty: "Medium",
    sequence: [3, 6, 10, 15, 21],
    missingIndex: 4,
    answer: 21,
    options: [20, 21, 24],
    points: 45
  },
  {
    difficulty: "Medium",
    sequence: [2, 4, 8, 16, 32],
    missingIndex: 2,
    answer: 8,
    options: [6, 8, 12],
    points: 45
  },
  {
    difficulty: "Medium",
    sequence: [1, 4, 9, 16, 25],
    missingIndex: 3,
    answer: 16,
    options: [14, 16, 20],
    points: 45
  },
  {
    difficulty: "Medium",
    sequence: [2, 3, 5, 7, 11],
    missingIndex: 1,
    answer: 3,
    options: [3, 4, 6],
    points: 45
  },
  {
    difficulty: "Medium",
    sequence: [1994, 1998, 2002, 2006, 2010],
    missingIndex: 3,
    answer: 2006,
    options: [2004, 2006, 2008],
    points: 45
  },
  {
    difficulty: "Decently Hard",
    sequence: [7, 11, 18, 29, 47],
    missingIndex: 2,
    answer: 18,
    options: [17, 18, 21],
    points: 60
  },
  {
    difficulty: "Decently Hard",
    sequence: [1, 1, 2, 3, 5],
    missingIndex: 4,
    answer: 5,
    options: [4, 5, 6],
    points: 60
  },
  {
    difficulty: "Decently Hard",
    sequence: [1, 3, 6, 10, 15],
    missingIndex: 3,
    answer: 10,
    options: [9, 10, 12],
    points: 60
  },
  {
    difficulty: "Decently Hard",
    sequence: [1, 8, 27, 64, 125],
    missingIndex: 2,
    answer: 27,
    options: [24, 27, 32],
    points: 60
  },
  {
    difficulty: "Decently Hard",
    sequence: [3, 5, 8, 12, 17],
    missingIndex: 3,
    answer: 12,
    options: [11, 12, 13],
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
  const rounds = useMemo(() => shuffle([...ROUND_POOL]).slice(0, 3).map((round) => ({ ...round, options: shuffle(round.options) })), []);
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
      <div className="mb-3 sm:mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-warmGrey">
          Sequence - Round {roundIndex + 1} of {rounds.length}
        </p>
        <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs uppercase tracking-[0.28em] text-charcoal/65">{currentRound.difficulty}</p>
        <div className="mt-3 sm:mt-5 flex flex-wrap justify-center gap-4 sm:gap-6 font-serif text-xl sm:text-3xl text-charcoal">
          {currentRound.sequence.map((value, index) => (
            <span key={`${currentRound.sequence.join("-")}-${index}`} className="min-w-[2ch] text-center">
              {index === currentRound.missingIndex ? "?" : value.toString()}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-xl gap-2 sm:gap-4">
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
              className={`rounded-[16px] border px-4 py-3 sm:py-5 font-serif text-lg sm:text-2xl text-charcoal transition-all duration-200 ease-gentle ${tone}`}
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
