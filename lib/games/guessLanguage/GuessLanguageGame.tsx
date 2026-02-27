"use client";

import { useMemo, useState } from "react";
import type { GameProps } from "@/types/Game";

type LanguageRound = {
  phrase: string;
  answer: string;
  options: string[];
};

const TOTAL_ROUNDS = 3;
const POINTS_PER_ROUND = 40;

const ROUND_BANK: LanguageRound[] = [
  {
    phrase: "Bonjour, comment allez-vous ?",
    answer: "French",
    options: ["French", "Spanish", "Italian"]
  },
  {
    phrase: "¿Dónde está la estación de tren?",
    answer: "Spanish",
    options: ["Portuguese", "Spanish", "French"]
  },
  {
    phrase: "Guten Morgen, wie geht es dir?",
    answer: "German",
    options: ["Dutch", "German", "Swedish"]
  },
  {
    phrase: "Ciao, possiamo iniziare adesso?",
    answer: "Italian",
    options: ["Italian", "Romanian", "Spanish"]
  },
  {
    phrase: "Obrigada pela ajuda de hoje.",
    answer: "Portuguese",
    options: ["Spanish", "Portuguese", "Italian"]
  },
  {
    phrase: "Wat is jouw favoriete boek?",
    answer: "Dutch",
    options: ["German", "Danish", "Dutch"]
  }
];

const shuffle = <T,>(items: T[]): T[] => {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
};

const GuessLanguageGame = ({ onSuccess, onFail }: GameProps) => {
  const rounds = useMemo(() => {
    return shuffle(ROUND_BANK)
      .slice(0, TOTAL_ROUNDS)
      .map((round) => ({ ...round, options: shuffle(round.options) }));
  }, []);
  const [roundIndex, setRoundIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [selected, setSelected] = useState<{ index: number; correct: boolean } | null>(null);
  const [locked, setLocked] = useState(false);

  const currentRound = rounds[roundIndex];

  const handleSelect = (option: string, index: number) => {
    if (!currentRound || locked) return;

    const isCorrect = option === currentRound.answer;
    setSelected({ index, correct: isCorrect });

    if (!isCorrect) {
      onFail({ retry: true, timePenalty: 4, note: "Wrong language guess" });
      setTimeout(() => setSelected(null), 280);
      return;
    }

    setLocked(true);
    const nextScore = totalScore + POINTS_PER_ROUND;
    setTotalScore(nextScore);

    setTimeout(() => {
      if (roundIndex >= TOTAL_ROUNDS - 1) {
        onSuccess({ scoreDelta: nextScore, note: "Languages identified" });
        return;
      }
      setRoundIndex((prev) => prev + 1);
      setSelected(null);
      setLocked(false);
    }, 340);
  };

  if (!currentRound) {
    return <div className="flex h-full items-center justify-center text-sm text-charcoal/60">Preparing round…</div>;
  }

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="mb-6 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-warmGrey">
          Guess Language - Round {roundIndex + 1} of {TOTAL_ROUNDS}
        </p>
        <p className="mt-3 px-4 font-serif text-xl text-charcoal">{currentRound.phrase}</p>
      </div>

      <div className="mx-auto grid w-full max-w-md gap-3">
        {currentRound.options.map((option, index) => {
          const isSelected = selected?.index === index;
          const isCorrectChoice = option === currentRound.answer;
          const tone = isSelected
            ? selected?.correct
              ? "border-rosegold/60 bg-rosegold/10"
              : "border-rosegold/45 bg-rosegold/5"
            : "border-white/70 bg-white/70";

          const revealCorrect = selected && !selected.correct && isCorrectChoice;

          return (
            <button
              key={`${currentRound.phrase}-${option}`}
              type="button"
              onClick={() => handleSelect(option, index)}
              className={`rounded-[16px] border px-4 py-4 font-serif text-lg text-charcoal transition-all duration-200 ease-gentle ${
                tone
              } ${revealCorrect ? "border-rosegold/60 shadow-[0_8px_24px_rgba(198,167,125,0.2)]" : ""}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GuessLanguageGame;
