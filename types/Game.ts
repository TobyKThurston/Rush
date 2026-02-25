import type { FC } from "react";

export type GameEventPayload = {
  scoreDelta?: number;
  note?: string;
  retry?: boolean;
  timePenalty?: number;
};

export type GameStatusContext = {
  timeElapsed?: number;
  timeLeft?: number;
};

export interface GameProps {
  onSuccess: (payload?: GameEventPayload) => void;
  onFail: (payload?: GameEventPayload) => void;
  onComplete: (payload?: GameEventPayload) => void;
  status?: GameStatusContext;
}

export interface RushGame {
  id: string;
  name: string;
  description: string;
  component: FC<GameProps>;
  defaultTimeLimit: number;
  difficultyWeight: number;
}
