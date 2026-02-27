import type { RushGame } from "@/types/Game";
import { eliminateGame } from "./eliminate";
import { guessLanguageGame } from "./guessLanguage";
import { miniGridGame } from "./miniGrid";
import { sequenceGame } from "./sequence";
import { timingGame } from "./timing";
import { wordle4Game } from "./wordle4";
import { zipPuzzleGame } from "./zipPuzzle";

export const allGames: RushGame[] = [eliminateGame, guessLanguageGame, miniGridGame, sequenceGame, timingGame, wordle4Game, zipPuzzleGame];
export const dailyGames: RushGame[] = [eliminateGame, guessLanguageGame, sequenceGame, timingGame, zipPuzzleGame];

export const gameMap: Record<string, RushGame> = Object.fromEntries(
  allGames.map((game) => [game.id.toLowerCase(), game])
) as Record<string, RushGame>;
