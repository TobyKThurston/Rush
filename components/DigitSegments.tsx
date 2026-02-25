import { useMemo } from "react";

type SegmentDigitProps = {
  value: number;
};

const segments: Record<number, [boolean, boolean, boolean, boolean, boolean, boolean, boolean]> = {
  0: [true, true, true, true, true, true, false],
  1: [false, true, true, false, false, false, false],
  2: [true, true, false, true, true, false, true],
  3: [true, true, true, true, false, false, true],
  4: [false, true, true, false, false, true, true],
  5: [true, false, true, true, false, true, true],
  6: [true, false, true, true, true, true, true],
  7: [true, true, true, false, false, false, false],
  8: [true, true, true, true, true, true, true],
  9: [true, true, true, true, false, true, true]
};

const SegmentDigit = ({ value }: SegmentDigitProps) => {
  const activeSegments = useMemo(() => segments[value] ?? segments[0], [value]);

  return (
    <div className="relative h-14 w-9">
      <Segment variant="top" active={activeSegments[0]} />
      <Segment variant="top-right" active={activeSegments[1]} />
      <Segment variant="bottom-right" active={activeSegments[2]} />
      <Segment variant="bottom" active={activeSegments[3]} />
      <Segment variant="bottom-left" active={activeSegments[4]} />
      <Segment variant="top-left" active={activeSegments[5]} />
      <Segment variant="middle" active={activeSegments[6]} />
    </div>
  );
};

const Segment = ({ variant, active }: { variant: string; active: boolean }) => {
  const base = "absolute rounded-full transition-colors duration-150";
  const activeClass = active ? "bg-[#C6A77D]/80" : "bg-transparent";
  switch (variant) {
    case "top":
      return <span className={`${base} ${activeClass} left-2 right-2 top-0 h-[2px]`} />;
    case "top-right":
      return <span className={`${base} ${activeClass} right-0 top-2 h-5 w-[2px]`} />;
    case "bottom-right":
      return <span className={`${base} ${activeClass} bottom-2 right-0 h-5 w-[2px]`} />;
    case "bottom":
      return <span className={`${base} ${activeClass} left-2 right-2 bottom-0 h-[2px]`} />;
    case "bottom-left":
      return <span className={`${base} ${activeClass} bottom-2 left-0 h-5 w-[2px]`} />;
    case "top-left":
      return <span className={`${base} ${activeClass} left-0 top-2 h-5 w-[2px]`} />;
    case "middle":
      return <span className={`${base} ${activeClass} left-2 right-2 top-1/2 h-[2px] -translate-y-1/2`} />;
    default:
      return null;
  }
};

export default SegmentDigit;
