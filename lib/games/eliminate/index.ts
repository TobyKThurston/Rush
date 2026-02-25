import type { RushGame } from "@/types/Game";
import EliminateGame from "./EliminateGame";

export const eliminateGame: RushGame = {
  id: "eliminate",
  name: "Eliminate",
  description: "Identify the lone element that breaks the quiet pattern.",
  component: EliminateGame,
  defaultTimeLimit: 25,
  difficultyWeight: 2
};
