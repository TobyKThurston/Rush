import type { RushGame } from "@/types/Game";
import SequenceGame from "./SequenceGame";

export const sequenceGame: RushGame = {
  id: "sequence",
  name: "Sequence",
  description: "Find the missing number in each sequence across three escalating rounds.",
  component: SequenceGame,
  defaultTimeLimit: 25,
  difficultyWeight: 1.9
};
