"use client";

import { useMemo, useState } from "react";
import type { GameProps } from "@/types/Game";

type LanguageRound = {
  family: string;
  phrase: string;
  answer: string;
  options: string[];
};

const TOTAL_ROUNDS = 3;
const POINTS_PER_ROUND = 40;

const ROUND_BANK: LanguageRound[] = [
  {
    family: "Romance",
    phrase: "Bonjour, comment allez-vous ?",
    answer: "French",
    options: ["French", "Spanish", "Italian", "Portuguese"]
  },
  {
    family: "Romance",
    phrase: "¿Dónde está la estación de tren?",
    answer: "Spanish",
    options: ["Portuguese", "Spanish", "French", "Italian"]
  },
  {
    family: "Germanic",
    phrase: "Guten Morgen, wie geht es dir?",
    answer: "German",
    options: ["Dutch", "German", "Swedish", "Danish"]
  },
  {
    family: "Romance",
    phrase: "Ciao, possiamo iniziare adesso?",
    answer: "Italian",
    options: ["Italian", "Romanian", "Spanish", "Portuguese"]
  },
  {
    family: "Romance",
    phrase: "Obrigada pela ajuda de hoje.",
    answer: "Portuguese",
    options: ["Spanish", "Portuguese", "Italian", "French"]
  },
  {
    family: "Germanic",
    phrase: "Wat is jouw favoriete boek?",
    answer: "Dutch",
    options: ["German", "Danish", "Dutch", "Swedish"]
  },
  {
    family: "Slavic",
    phrase: "Dzień dobry, jak się masz?",
    answer: "Polish",
    options: ["Polish", "Czech", "Ukrainian", "Croatian"]
  },
  {
    family: "Slavic",
    phrase: "Добрый вечер, где находится музей?",
    answer: "Russian",
    options: ["Russian", "Ukrainian", "Bulgarian", "Serbian"]
  },
  {
    family: "Nordic",
    phrase: "God morgen, hva heter du?",
    answer: "Norwegian",
    options: ["Norwegian", "Swedish", "Danish", "Dutch"]
  },
  {
    family: "Nordic",
    phrase: "God eftermiddag, vil du have kaffe?",
    answer: "Danish",
    options: ["Danish", "Swedish", "Norwegian", "German"]
  },
  {
    family: "Uralic",
    phrase: "Hyvaa paivaa, missa kirjasto on?",
    answer: "Finnish",
    options: ["Finnish", "Hungarian", "Estonian", "Latvian"]
  },
  {
    family: "Semitic",
    phrase: "Marhaban, kayfa haluk alyawm?",
    answer: "Arabic",
    options: ["Arabic", "Hebrew", "Turkish", "Persian"]
  },
  {
    family: "Indo-Aryan",
    phrase: "Namaste, aap kaise hain?",
    answer: "Hindi",
    options: ["Hindi", "Bengali", "Urdu", "Punjabi"]
  },
  {
    family: "Indo-Aryan",
    phrase: "Assalamu alaikum, apni kemon achen?",
    answer: "Bengali",
    options: ["Bengali", "Hindi", "Urdu", "Gujarati"]
  },
  {
    family: "Turkic",
    phrase: "Merhaba, bugun nasilsin?",
    answer: "Turkish",
    options: ["Turkish", "Azerbaijani", "Arabic", "Persian"]
  },
  {
    family: "East Asian",
    phrase: "Ni hao, jintian zenmeyang?",
    answer: "Mandarin Chinese",
    options: ["Mandarin Chinese", "Japanese", "Korean", "Vietnamese"]
  },
  {
    family: "East Asian",
    phrase: "Annyeonghaseyo, oneul iljeongi mwoyeyo?",
    answer: "Korean",
    options: ["Korean", "Japanese", "Mandarin Chinese", "Thai"]
  },
  {
    family: "Japonic",
    phrase: "Ohayo gozaimasu, kyo wa naniji desu ka?",
    answer: "Japanese",
    options: ["Japanese", "Korean", "Mandarin Chinese", "Mongolian"]
  },
  {
    family: "Austronesian",
    phrase: "Magandang umaga, saan tayo pupunta?",
    answer: "Tagalog",
    options: ["Tagalog", "Malay", "Indonesian", "Vietnamese"]
  },
  {
    family: "Bantu",
    phrase: "Habari za asubuhi, unaendeleaje?",
    answer: "Swahili",
    options: ["Swahili", "Zulu", "Yoruba", "Amharic"]
  },
  {
    family: "Celtic",
    phrase: "Dia dhuit, conas ata tu?",
    answer: "Irish",
    options: ["Irish", "Welsh", "Scottish Gaelic", "English"]
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
      <div className="mb-3 sm:mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-warmGrey">
          Guess Language - Round {roundIndex + 1} of {TOTAL_ROUNDS}
        </p>
        <p className="mt-1 sm:mt-2 text-[10px] uppercase tracking-[0.32em] text-charcoal/55">{currentRound.family}</p>
        <p className="mt-2 sm:mt-4 px-2 sm:px-4 font-serif text-lg sm:text-2xl text-charcoal">{currentRound.phrase}</p>
      </div>

      <div className="mx-auto grid w-full max-w-xl gap-2 sm:gap-4">
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
              className={`rounded-[16px] border px-3 sm:px-4 py-2.5 sm:py-5 font-serif text-base sm:text-xl text-charcoal transition-all duration-200 ease-gentle ${
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
