"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import GameStage from "@/components/GameStage";
import { gameMap } from "@/lib/games";
import type { GameEventPayload } from "@/types/Game";

type Props = {
  params: { game: string };
};

const ArcadeGamePage = ({ params }: Props) => {
  const slug = params.game.toLowerCase();
  const selectedGame = gameMap[slug];
  const fallbackTitle = slug.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const [attempt, setAttempt] = useState(0);
  const [note, setNote] = useState<string | null>(null);

  const handleResult = useCallback((payload?: GameEventPayload, defaultNote?: string) => {
    setNote(payload?.note ?? defaultNote ?? null);
    setTimeout(() => setAttempt((prev) => prev + 1), 600);
  }, []);

  const handlers = useMemo(
    () => ({
      onSuccess: (payload?: GameEventPayload) => handleResult(payload, "Composed"),
      onFail: (payload?: GameEventPayload) => handleResult(payload, "Try again"),
      onComplete: (payload?: GameEventPayload) => handleResult(payload, "Complete")
    }),
    [handleResult]
  );

  const stageBody = useMemo(() => {
    if (!selectedGame) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-charcoal/70">This mode is being composed.</p>
          <p className="text-xs uppercase tracking-[0.35em] text-warmGrey">Returns soon</p>
        </div>
      );
    }

    const GameComponent = selectedGame.component;
    return (
      <div className="flex h-full flex-col justify-center">
        <GameComponent key={`${selectedGame.id}-${attempt}`} {...handlers} />
      </div>
    );
  }, [selectedGame, attempt, handlers]);

  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b border-white/60 px-6 py-6 text-xs uppercase tracking-[0.35em] text-charcoal/70">
          <Link href="/" className="hover:text-charcoal">
            Atelier
          </Link>
          <Link href="/arcade" className="font-serif text-base tracking-[0.3em] text-charcoal">
            Practice
          </Link>
          <Link href="/run" className="hover:text-charcoal">
            Daily Run
          </Link>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12">
          <p className="text-center text-xs uppercase tracking-[0.4em] text-warmGrey/80">
            {selectedGame ? selectedGame.name : fallbackTitle}
          </p>
          <GameStage label={selectedGame ? "Arcade Practice" : undefined}>{stageBody}</GameStage>
          {selectedGame && note && <p className="text-xs text-charcoal/60">{note}</p>}
        </div>
      </div>
    </main>
  );
};

export default ArcadeGamePage;
