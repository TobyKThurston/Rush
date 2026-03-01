import Link from "next/link";

const HEADER_H = 84;

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
      className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-white/70 bg-ivory/85 px-4 sm:px-6 text-xs uppercase tracking-[0.3em] text-warmGrey/90 backdrop-blur"
      style={{
        height: `calc(${HEADER_H}px + env(safe-area-inset-top, 0px))`,
        paddingTop: "env(safe-area-inset-top, 0px)"
      }}
    >
      <div className="flex items-center gap-2 sm:gap-4 text-[11px]">
        <Link href="/" className="tracking-[0.25em] sm:tracking-[0.35em] text-charcoal/70 hover:text-charcoal">
          ← Atelier
        </Link>
        <Link href="/arcade" className="tracking-[0.25em] sm:tracking-[0.35em] text-charcoal/60 hover:text-charcoal">
          Arcade
        </Link>
      </div>
      <div
        className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
        style={{ top: "calc(50% + env(safe-area-inset-top, 0px) / 2)" }}
      >
        <span className="font-serif text-xl sm:text-2xl tracking-[0.4em] text-charcoal">THE RUSH</span>
        <div className="flex items-center gap-2.5">
          {Array.from({ length: totalStages }).map((_, idx) => {
            const isComplete = idx < currentIndex;
            const isCurrent = phase === "playing" && idx === currentIndex;
            let fill = "bg-warmGrey/30";
            if (phase === "finished") fill = "bg-rosegold";
            else if (isComplete) fill = "bg-charcoal/50";
            else if (isCurrent) fill = "bg-rosegold";
            return <span key={idx} className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full ${fill}`} />;
          })}
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-warmGrey/70">Time</span>
        <span key={penaltyCount} className={`text-base sm:text-xl font-medium tracking-normal text-charcoal${penaltyCount > 0 ? " animate-penaltyFlash" : ""}`}>{formattedTime}</span>
      </div>
    </header>
  );
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default FixedHeader;
export { HEADER_H };
