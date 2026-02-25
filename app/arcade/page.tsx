import Link from "next/link";
import { allGames } from "@/lib/games";

const curatedTiles = allGames.map((game) => ({ id: game.id, name: game.name }));

const ArcadePage = () => {
  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-16 px-6 py-12 sm:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/70 pb-6 text-xs uppercase tracking-[0.35em] text-charcoal/70">
          <Link href="/" className="hover:text-charcoal">
            Atelier
          </Link>
          <span className="font-serif text-base tracking-[0.3em] text-charcoal">Arcade</span>
          <Link href="/run" className="hover:text-charcoal">
            Daily Run
          </Link>
        </header>
        <div className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-warmGrey/80">Modes</p>
          <h1 className="font-serif text-4xl tracking-[0.2em]">Arcade</h1>
          <p className="mx-auto max-w-2xl text-sm text-charcoal/70">
            A curated gallery of micro-challenges. Step in to refine a single instinct and linger
            as long as needed.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {curatedTiles.map((game) => (
            <Link
              key={game.id}
              href={`/arcade/${game.id}`}
              className="group relative flex aspect-square items-center justify-center rounded-[26px] border border-white/70 bg-white/60 text-center transition-all duration-200 ease-gentle hover:-translate-y-1 hover:border-rosegold/60 hover:shadow-veil"
            >
              <span className="font-serif text-2xl tracking-[0.25em] text-charcoal group-hover:text-rosegold">
                {game.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ArcadePage;
