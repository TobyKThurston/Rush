// mulberry32 — fast, deterministic seeded PRNG
export const seededRng = (seed: number): (() => number) => {
  let s = seed;
  return () => {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Fisher-Yates shuffle with custom rng
export const seededShuffle = <T>(array: T[], rng: () => number): T[] => {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

// Mirrors RunEngine's getDailyWindowKey logic → e.g. "2026-03-01" → 20260301
export const getDailySeed = (): number => {
  const now = new Date();
  const reset = new Date(now);
  reset.setHours(23, 59, 0, 0);
  const windowDate = new Date(reset);
  if (now < reset) {
    windowDate.setDate(windowDate.getDate() - 1);
  }
  const year = windowDate.getFullYear();
  const month = windowDate.getMonth() + 1;
  const day = windowDate.getDate();
  return year * 10000 + month * 100 + day;
};
