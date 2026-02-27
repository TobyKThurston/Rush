import type { RushGame } from "@/types/Game";
import GuessLanguageGame from "./GuessLanguageGame";

export const guessLanguageGame: RushGame = {
  id: "guessLanguage",
  name: "Guess Language",
  description: "Read a phrase and identify its language from three choices.",
  component: GuessLanguageGame,
  defaultTimeLimit: 25,
  difficultyWeight: 1.8
};
