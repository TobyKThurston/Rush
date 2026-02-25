import Link from "next/link";
import SunriseCountdown from "@/components/SunriseCountdown";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="h-[70vw] w-[70vw] max-h-[600px] max-w-[600px] rounded-full border-2 border-[#C6A77D]/15" />
      </div>
      <div className="flex flex-col items-center gap-6 text-charcoal">
        <p className="text-xs uppercase tracking-[0.45em] text-warmGrey/80">A DAILY PRACTICE</p>
        <h1 className="font-serif text-5xl tracking-[0.3em] text-charcoal">THE RUSH</h1>
        <Link
          href="/run"
          className="mt-4 inline-flex items-center justify-center rounded-full border border-charcoal/20 bg-charcoal px-14 py-3 text-sm font-medium uppercase tracking-[0.3em] text-ivory transition-colors duration-200 hover:bg-charcoal/90"
        >
          Play Today&apos;s Run
        </Link>
        <div className="mt-8">
          <SunriseCountdown />
        </div>
        <p className="mt-10 text-xs uppercase tracking-[0.3em] text-warmGrey/70">Next sequence awaits.</p>
      </div>
    </main>
  );
}
