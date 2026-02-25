"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const previews = [
  {
    prompt: "Which does not belong?",
    options: ["Apple", "Banana", "Chair", "Orange"],
    correct: 2
  },
  {
    prompt: "Complete the sequence",
    options: ["3", "6", "9", "?"],
    correct: 3,
    hint: "3 → 6 → 9"
  },
  {
    prompt: "Find the pair",
    options: ["Moon → Night", "Sun → ?", "Stars → Sky", "Cloud → Rain"],
    correct: 1
  }
];

const HomePreview = () => {
  const [index, setIndex] = useState(0);
  const [resolvedIndex, setResolvedIndex] = useState<number | null>(null);

  const current = useMemo(() => previews[index % previews.length], [index]);

  const handleSelect = (choice: number) => {
    if (resolvedIndex !== null) return;
    setResolvedIndex(choice);
    const isCorrect = choice === current.correct;
    if (isCorrect) {
      setTimeout(() => {
        setResolvedIndex(null);
        setIndex((prev) => (prev + 1) % previews.length);
      }, 600);
    } else {
      setTimeout(() => setResolvedIndex(null), 400);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-charcoal">
      <div className="max-w-[540px] text-center">
        <p className="text-xs uppercase tracking-[0.45em] text-warmGrey/80">A DAILY PRACTICE</p>
        <Title />
        <div className="mx-auto mt-8 w-full max-w-[420px] rounded-[30px] border border-white/60 bg-white/80 p-8 shadow-subtle">
          <p className="text-xs uppercase tracking-[0.35em] text-warmGrey">Preview</p>
          <p className="mt-3 font-serif text-lg text-charcoal">{current.prompt}</p>
          <div className="mt-6 space-y-3">
            {current.options.map((option, idx) => {
              const isCorrect = idx === current.correct;
              const isChosen = resolvedIndex === idx;
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(idx)}
                  className={`w-full rounded-[14px] border border-white/70 bg-white/70 px-4 py-3 text-center font-serif text-lg text-charcoal transition-all duration-200 ease-gentle $ {
                    isChosen && isCorrect ? "shadow-[0_10px_30px_rgba(198,167,125,0.25)]" : ""
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
        <Link
          href="/run"
          className="mt-10 inline-flex items-center justify-center rounded-full border border-charcoal/10 bg-charcoal px-10 py-3 text-sm font-medium uppercase tracking-[0.25em] text-ivory transition-colors duration-200 hover:bg-charcoal/90"
        >
          Play Today&apos;s Run
        </Link>
        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-warmGrey/80">New sequence every sunrise.</p>
      </div>
    </div>
  );
};

const Title = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <h1
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`mt-4 font-serif text-5xl tracking-[0.24em] text-charcoal transition-[letter-spacing] duration-200 ${
        hovered ? "tracking-[0.28em]" : ""
      }`}
    >
      THE RUSH
    </h1>
  );
};

export default HomePreview;
