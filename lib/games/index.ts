import type { RushGame } from "@/types/Game";
import { eliminateGame } from "./eliminate";
import { guessLanguageGame } from "./guessLanguage";
import { miniGridGame } from "./miniGrid";
import { timingGame } from "./timing";
import { zipPuzzleGame } from "./zipPuzzle";

export const allGames: RushGame[] = [eliminateGame, guessLanguageGame, miniGridGame, timingGame, zipPuzzleGame];
export const dailyGames: RushGame[] = [eliminateGame, guessLanguageGame, timingGame, zipPuzzleGame];

export const gameMap: Record<string, RushGame> = Object.fromEntries(
  allGames.map((game) => [game.id.toLowerCase(), game])
) as Record<string, RushGame>;
