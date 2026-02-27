import type { RushGame } from "@/types/Game";
import { eliminateGame } from "./eliminate";
import { miniGridGame } from "./miniGrid";
import { timingGame } from "./timing";
import { zipPuzzleGame } from "./zipPuzzle";

export const allGames: RushGame[] = [eliminateGame, miniGridGame, timingGame, zipPuzzleGame];

export const gameMap: Record<string, RushGame> = Object.fromEntries(
  allGames.map((game) => [game.id.toLowerCase(), game])
) as Record<string, RushGame>;
