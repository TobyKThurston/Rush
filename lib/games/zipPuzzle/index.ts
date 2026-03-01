import type { ApexGame } from "@/types/Game";
import ZipPuzzleGame from "./ZipPuzzleGame";

export const zipPuzzleGame: ApexGame = {
  id: "zipPuzzle",
  name: "Zip Puzzle",
  description: "Glide a single elegant line through the grid, touching anchors in precise order.",
  component: ZipPuzzleGame,
  defaultTimeLimit: 30,
  difficultyWeight: 3
};
