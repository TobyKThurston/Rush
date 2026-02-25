import type { RushGame } from "@/types/Game";
import MiniGridGame from "./MiniGridGame";

export const miniGridGame: RushGame = {
  id: "miniGrid",
  name: "Mini Grid",
  description: "Fill the composed micro-grid with precise intent.",
  component: MiniGridGame,
  defaultTimeLimit: 25,
  difficultyWeight: 2
};
