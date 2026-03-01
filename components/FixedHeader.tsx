import Link from "next/link";

const HEADER_H = 64;

type HeaderProps = {
  timeElapsed: number;
  phase: string;
  currentIndex: number;
  totalStages: number;
  penaltyCount?: number;
};

const FixedHeader = ({ timeElapsed, phase, currentIndex, totalStages, penaltyCount = 0 }: HeaderProps) => {
  const formattedTime = formatTime(timeElapsed);
  return (
    <header
      className="fixed left-0 right-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center border-b border-white/70 bg-ivory/85 px-4 text-xs uppercase tracking-[0.3em] text-warmGrey/90 backdrop-blur"
      style={{
        height: `calc(${HEADER_H}px + env(safe-area-inset-top, 0px))`,
        paddingTop: "env(safe-area-inset-top, 0px)"
      }}
    >
      {/* Left: nav links */}
      <div className="flex items-center gap-2 sm:gap-4 text-[11px]">
        <Link href="/" className="tracking-[0.2em] sm:tracking-[0.35em] text-charcoal/70 hover:text-charcoal">
          <span className="sm:hidden">←</span>
          <span className="hidden sm:inline">← Atelier</span>
        </Link>
        <Link href="/arcade" className="hidden sm:inline tracking-[0.2em] sm:tracking-[0.35em] text-charcoal/60 hover:text-charcoal">
          Arcade
        </Link>
      </div>

      {/* Center: title + progress dots */}
      <div className="flex flex-col items-center gap-1 sm:gap-1.5">
        <span className="font-serif text-lg sm:text-2xl tracking-[0.25em] sm:tracking-[0.4em] text-charcoal">THE RUSH</span>
        <div className="flex items-center gap-2 sm:gap-2.5">
          {Array.from({ length: totalStages }).map((_, idx) => {
            const isComplete = idx < currentIndex;
            const isCurrent = phase === "playing" && idx === currentIndex;
            let fill = "bg-warmGrey/30";
            if (phase === "finished") fill = "bg-rosegold";
            else if (isComplete) fill = "bg-charcoal/50";
            else if (isCurrent) fill = "bg-rosegold";
            return <span key={idx} className={`h-1.5 w-1.5 sm:h-2.5 sm:w-2.5 rounded-full ${fill}`} />;
          })}
        </div>
      </div>

      {/* Right: timer */}
      <div className="flex flex-col items-end">
        <span className="hidden sm:block text-[11px] uppercase tracking-[0.3em] text-warmGrey/70">Time</span>
        <span
          key={penaltyCount}
          className={`text-base sm:text-xl font-medium tracking-normal text-charcoal${penaltyCount > 0 ? " animate-penaltyFlash" : ""}`}
        >
          {formattedTime}
        </span>
      </div>
    </header>
  );
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default FixedHeader;
export { HEADER_H };
