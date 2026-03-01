import { generateEliminatePuzzle, type EliminateDifficulty, type EliminatePuzzle } from "./generateEliminatePuzzle";

export const TOTAL_ELIMINATE_ROUNDS = 3;

export const createEliminateSession = (
  rounds: number = TOTAL_ELIMINATE_ROUNDS,
  difficulty: EliminateDifficulty = 2,
  rng?: () => number
): EliminatePuzzle[] =>
  Array.from({ length: rounds }, () => generateEliminatePuzzle(difficulty, rng));

export const calculateRoundScore = (wrongAttempts: number) => 50 + (wrongAttempts === 0 ? 25 : 0);
