"use client";

import { useEffect, useMemo, useState } from "react";

const targetSunrise = () => {
  const now = new Date();
  const sunrise = new Date();
  sunrise.setHours(6, 0, 0, 0);
  if (sunrise <= now) {
    sunrise.setDate(sunrise.getDate() + 1);
  }
  return sunrise;
};

const getTimeUntil = () => {
  const now = new Date();
  const sunrise = targetSunrise();
  const diff = Math.max(0, sunrise.getTime() - now.getTime());
  const totalMinutes = Math.floor(diff / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
};

const SunriseCountdown = () => {
  const [time, setTime] = useState(getTimeUntil());
  const [colonActive, setColonActive] = useState(false);

  useEffect(() => {
    const minuteTimer = setInterval(() => {
      setTime(getTimeUntil());
    }, 60000);
    const colonTimer = setInterval(() => {
      setColonActive((prev) => !prev);
    }, 4000);
    return () => {
      clearInterval(minuteTimer);
      clearInterval(colonTimer);
    };
  }, []);

  const display = useMemo(() => {
    const format = (value: number) => value.toString().padStart(2, "0");
    return [format(time.hours), format(time.minutes)];
  }, [time]);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs uppercase tracking-[0.3em] text-warmGrey/80">Resets at Sunrise</p>
      <p className="text-xs uppercase tracking-[0.3em] text-warmGrey/60">Next ritual in</p>
      <div className="flex items-center gap-4 font-serif text-4xl text-[#C6A77D]/80 tracking-[0.2em]">
        <Digit value={display[0]} />
        <Colon active={colonActive} />
        <Digit value={display[1]} />
      </div>
    </div>
  );
};

const Digit = ({ value }: { value: string }) => (
  <span className="transition-opacity duration-150" key={value}>
    {value}
  </span>
);

const Colon = ({ active }: { active: boolean }) => (
  <span className={`transition-opacity duration-300 ${active ? "opacity-80" : "opacity-50"}`}>:</span>
);

export default SunriseCountdown;
