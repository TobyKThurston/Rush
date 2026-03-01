"use client";
import { useEffect, useState } from "react";

const CHAMPION_KEY = "apex:champion";

const getDailyResetTime = (now: Date) => {
  const reset = new Date(now);
  reset.setHours(23, 59, 0, 0);
  return reset;
};

const getDailyWindowKey = (now: Date = new Date()) => {
  const reset = getDailyResetTime(now);
  const windowDate = new Date(reset);
  if (now < reset) {
    windowDate.setDate(windowDate.getDate() - 1);
  }
  const year = windowDate.getFullYear();
  const month = `${windowDate.getMonth() + 1}`.padStart(2, "0");
  const day = `${windowDate.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function ApexChampion() {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAMPION_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.windowKey === getDailyWindowKey() && parsed.name) setName(parsed.name);
    } catch {}
  }, []);

  if (!name) return null;

  return (
    <p className="text-[10px] uppercase tracking-[0.38em] text-warmGrey">
      Current Apex: <span className="font-medium text-charcoal">{name}</span>
    </p>
  );
}
