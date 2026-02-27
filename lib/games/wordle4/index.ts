import type { RushGame } from "@/types/Game";
import Wordle4Game from "./Wordle4Game";

export const wordle4Game: RushGame = {
  id: "wordle4",
  name: "Wordle 4",
  description: "Find the hidden 4-letter word in six guesses.",
  component: Wordle4Game,
  defaultTimeLimit: 35,
  difficultyWeight: 2.2
};
