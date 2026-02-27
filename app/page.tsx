import Link from "next/link";
import SunriseCountdown from "@/components/SunriseCountdown";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ivory px-6 py-10 text-charcoal md:px-10 md:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(198,167,125,0.2),transparent_55%),radial-gradient(circle_at_85%_80%,rgba(28,28,28,0.07),transparent_45%)]" />
        <div className="lux-grid absolute inset-0 opacity-[0.55]" />
        <div className="lux-orb absolute -left-24 top-10 h-64 w-64 rounded-full bg-rosegold/20 blur-3xl" />
        <div className="lux-orb absolute -right-24 bottom-12 h-80 w-80 rounded-full bg-charcoal/10 blur-3xl" style={{ animationDelay: "1.6s" }} />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl flex-col items-center justify-center gap-8 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-warmGrey">Edition 01</p>
        <p className="text-xs uppercase tracking-[0.4em] text-warmGrey">A daily practice in speed and focus</p>
        <h1 className="text-balance font-serif text-5xl leading-[0.95] tracking-[0.12em] sm:text-6xl md:text-7xl">THE RUSH</h1>
        <p className="max-w-xl text-sm leading-relaxed text-charcoal/75 sm:text-base">
          One sharp sequence each morning. Minimal surface, high pressure core. Built to feel composed until the clock
          starts.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/run"
            className="inline-flex items-center justify-center rounded-full border border-charcoal bg-charcoal px-10 py-3 text-xs font-medium uppercase tracking-[0.28em] text-ivory transition-all duration-300 hover:-translate-y-[1px] hover:bg-charcoal/92"
          >
            Play Today&apos;s Run
          </Link>
          <Link
            href="/arcade"
            className="inline-flex items-center justify-center rounded-full border border-charcoal/20 bg-white/70 px-8 py-3 text-xs font-medium uppercase tracking-[0.25em] text-charcoal transition-all duration-300 hover:border-charcoal/40 hover:bg-white"
          >
            Explore Arcade
          </Link>
        </div>

        <aside className="lux-panel w-full max-w-2xl rounded-[28px] border border-white/70 p-6 sm:p-7">
          <p className="text-[10px] uppercase tracking-[0.38em] text-warmGrey">Next refresh</p>
          <div className="mt-4 rounded-2xl border border-charcoal/10 bg-white/60 px-4 py-4">
            <SunriseCountdown />
          </div>
          <p className="mt-5 text-center text-[10px] uppercase tracking-[0.24em] text-warmGrey/90">Next sequence awaits.</p>
        </aside>
      </div>
    </main>
  );
}
