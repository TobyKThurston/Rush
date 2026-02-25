"use client";

import { useEffect, useMemo, useState } from "react";
import SegmentDigit from "./DigitSegments";

type TimeParts = {
  hours: number;
  minutes: number;
};

const getTimeUntilMidnight = (): TimeParts => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = Math.max(0, midnight.getTime() - now.getTime());
  const totalMinutes = Math.floor(diff / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
};

const CountdownTimer = () => {
  const [time, setTime] = useState<TimeParts>(getTimeUntilMidnight());
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeUntilMidnight());
    }, 60000);
    const colonInterval = setInterval(() => {
      setToggle((prev) => !prev);
    }, 2000);
    return () => {
      clearInterval(interval);
      clearInterval(colonInterval);
    };
  }, []);

  const digits = useMemo(() => {
    const format = (value: number) => value.toString().padStart(2, "0").split("").map(Number);
    return [...format(time.hours), ...format(time.minutes)];
  }, [time]);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs uppercase tracking-[0.4em] text-warmGrey">Resets in</p>
      <div className="flex items-center gap-6">
        <SegmentDigit value={digits[0]} />
        <SegmentDigit value={digits[1]} />
        <Colon active={toggle} />
        <SegmentDigit value={digits[2]} />
        <SegmentDigit value={digits[3]} />
      </div>
    </div>
  );
};

const Colon = ({ active }: { active: boolean }) => (
  <div className={`flex flex-col items-center gap-2 transition-opacity duration-200 ${active ? "opacity-80" : "opacity-50"}`}>
    <span className="h-[6px] w-[2px] rounded-full bg-rosegold" />
    <span className="h-[6px] w-[2px] rounded-full bg-rosegold" />
  </div>
);

export default CountdownTimer;
