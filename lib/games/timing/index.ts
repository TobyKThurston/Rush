import type { RushGame } from "@/types/Game";
import TimingGame from "./TimingGame";

export const timingGame: RushGame = {
  id: "timing",
  name: "Timing",
  description: "Center your focus and tap as the rose-gold pulse enters the calm zone.",
  component: TimingGame,
  defaultTimeLimit: 20,
  difficultyWeight: 1.1
};
