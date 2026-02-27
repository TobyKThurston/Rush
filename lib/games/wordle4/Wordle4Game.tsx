"use client";

import { useMemo, useState } from "react";
import type { GameProps } from "@/types/Game";

type LetterState = "correct" | "present" | "absent";

type WordBank = {
  theme: string;
  targets: string[];
  extras: string[];
};

const WORD_LENGTH = 4;
const MAX_ATTEMPTS = 5;
const KEYBOARD_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

const WORD_BANKS: WordBank[] = [
  {
    theme: "Nature",
    targets: ["WAVE", "SAGE", "MOON", "WIND", "MOSS", "TREE", "LAKE", "RAIN", "FROG", "ROCK"],
    extras: ["LEAF", "BARK", "DUNE", "SOIL", "POND", "MIST", "BIRD", "VINE"]
  },
  {
    theme: "Home",
    targets: ["LAMP", "SOFA", "DOOR", "SINK", "RUGS", "OVEN", "BELL", "BOOK", "MUGS", "TILE"],
    extras: ["WALL", "ROOF", "BATH", "DESK", "CUPS", "PANS", "BOWL", "TOWL"]
  },
  {
    theme: "Action",
    targets: ["JUMP", "PLAN", "MOVE", "DRAW", "READ", "PLAY", "MAKE", "SEND", "BUILD", "CODE"],
    extras: ["TYPE", "EDIT", "TEST", "PUSH", "SHIP", "TASK", "WORK", "RACE"]
  },
  {
    theme: "Travel",
    targets: ["ROAD", "RAIL", "PORT", "SHIP", "TRIP", "CAMP", "MAPS", "TOUR", "CITY", "COZY"],
    extras: ["BIKE", "TAXI", "LANE", "GATE", "PASS", "STOP", "RIDE", "FUEL"]
  }
];

const evaluateGuess = (guess: string, target: string): LetterState[] => {
  const result: LetterState[] = Array.from({ length: WORD_LENGTH }, () => "absent");
  const remaining = target.split("");
  const letters = guess.split("");

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (letters[i] === target[i]) {
      result[i] = "correct";
      remaining[i] = "";
      letters[i] = "";
    }
  }

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (!letters[i]) continue;
    const matchIndex = remaining.indexOf(letters[i]);
    if (matchIndex !== -1) {
      result[i] = "present";
      remaining[matchIndex] = "";
    }
  }

  return result;
};

const cellTone = (state?: LetterState): string => {
  if (state === "correct") return "border-[#6A9F6E] bg-[#DDEEDC] text-charcoal";
  if (state === "present") return "border-[#C9A94C] bg-[#F6EDCE] text-charcoal";
  if (state === "absent") return "border-white/60 bg-[#E9E6DE] text-charcoal/70";
  return "border-white/70 bg-white/70 text-charcoal";
};

const scoreForAttempt = (attempt: number) => Math.max(60, 140 - attempt * 12);

const Wordle4Game = ({ onSuccess, onFail }: GameProps) => {
  const pack = useMemo(() => WORD_BANKS[Math.floor(Math.random() * WORD_BANKS.length)], []);
  const target = useMemo(() => pack.targets[Math.floor(Math.random() * pack.targets.length)], [pack]);
  const validWords = useMemo(() => new Set([...pack.targets, ...pack.extras]), [pack]);

  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [message, setMessage] = useState("Guess the 4-letter word.");
  const [resolved, setResolved] = useState(false);

  const evaluations = useMemo(() => guesses.map((guess) => evaluateGuess(guess, target)), [guesses, target]);
  const attemptIndex = guesses.length;

  const submitGuess = () => {
    if (resolved) return;
    if (current.length !== WORD_LENGTH) {
      setMessage(`Enter ${WORD_LENGTH} letters.`);
      return;
    }
    if (!validWords.has(current)) {
      setMessage("Word not in this theme list.");
      return;
    }

    const nextGuesses = [...guesses, current];
    setGuesses(nextGuesses);
    setCurrent("");

    if (current === target) {
      setResolved(true);
      onSuccess({
        scoreDelta: scoreForAttempt(attemptIndex),
        note: `Solved in ${attemptIndex + 1}/${MAX_ATTEMPTS}`
      });
      return;
    }

    onFail({ retry: true, timePenalty: 2, note: "Incorrect guess" });

    if (nextGuesses.length >= MAX_ATTEMPTS) {
      setResolved(true);
      onFail({ note: `Word was ${target}` });
      return;
    }

    setMessage("Try another word.");
  };

  const typeLetter = (letter: string) => {
    if (resolved || current.length >= WORD_LENGTH) return;
    setCurrent((prev) => `${prev}${letter}`);
  };

  const backspace = () => {
    if (resolved || current.length === 0) return;
    setCurrent((prev) => prev.slice(0, -1));
  };

  const keyPress = (key: string) => {
    if (key === "ENTER") {
      submitGuess();
      return;
    }
    if (key === "BACK") {
      backspace();
      return;
    }
    typeLetter(key);
  };

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="mb-2 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-warmGrey">Wordle 4</p>
        <p className="mt-1 text-xs text-charcoal/70">{message}</p>
      </div>

      <div className="mx-auto grid w-full max-w-[270px] gap-1">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, row) => {
          const guess = guesses[row] ?? "";
          const isCurrent = row === guesses.length && !resolved;
          const display = isCurrent ? current : guess;
          const evaluation = evaluations[row];

          return (
            <div key={`row-${row}`} className="grid grid-cols-4 gap-1">
              {Array.from({ length: WORD_LENGTH }).map((__, col) => {
                const letter = display[col] ?? "";
                const state = guess ? evaluation?.[col] : undefined;
                return (
                  <div
                    key={`cell-${row}-${col}`}
                    className={`flex aspect-square items-center justify-center rounded-[8px] border font-serif text-base ${cellTone(state)}`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-2.5 w-full max-w-[300px] space-y-1">
        {KEYBOARD_ROWS.map((row) => (
          <div key={row} className="flex justify-center gap-1">
            {row.split("").map((letter) => (
              <button
                key={letter}
                type="button"
                onClick={() => keyPress(letter)}
                className="rounded-[8px] border border-white/70 bg-white/65 px-1.5 py-1 text-[9px] font-semibold text-charcoal transition-colors hover:border-rosegold/60"
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
        <div className="flex justify-center gap-1">
          <button
            type="button"
            onClick={() => keyPress("ENTER")}
            className="rounded-[8px] border border-[#6A9F6E]/60 bg-[#DDEEDC] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-charcoal hover:border-[#6A9F6E]"
          >
            Enter
          </button>
          <button
            type="button"
            onClick={() => keyPress("BACK")}
            className="rounded-[8px] border border-white/70 bg-white/70 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-charcoal hover:border-rosegold/60"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wordle4Game;
