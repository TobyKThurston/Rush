"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GameProps } from "@/types/Game";

type PulseResult = "Perfect" | "Great" | "Good" | "Miss";

const scoreByResult: Record<PulseResult, { delta: number; note: string; success: boolean }> = {
  Perfect: { delta: 140, note: "Pulse aligned", success: true },
  Great: { delta: 120, note: "Harmonic timing", success: true },
  Good: { delta: 100, note: "Steady breath", success: true },
  Miss: { delta: 0, note: "Outside the calm", success: false }
};

const TimingGame = ({ onSuccess, onFail, status }: GameProps) => {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(50);
  const [result, setResult] = useState<PulseResult | null>(null);
  const [awardedScore, setAwardedScore] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const resolved = useRef(false);
  const isArcade = !status;
  const speed = useMemo(() => (isArcade ? 0.04 + Math.random() * 0.04 : 0.12 + Math.random() * 0.1), [isArcade]);
  const zone = useMemo(() => {
    const width = 10 + Math.random() * 6;
    const start = 50 - width / 2;
    return { start, end: start + width };
  }, []);

  useEffect(() => {
    const animate = (timestamp: number) => {
      setPhase((prev) => {
        const nextPhase = prev + (speed * Math.PI * 2) / 60;
        const normalizedPhase = nextPhase % (Math.PI * 2);
        const position = 50 + 50 * Math.sin(normalizedPhase);
        setProgress(position);
        return normalizedPhase;
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed]);

  const handleTap = () => {
    if (resolved.current) return;
    resolved.current = true;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const center = (zone.start + zone.end) / 2;
    const spread = zone.end - zone.start;
    const distance = Math.abs(progress - center);
    let evaluation: PulseResult = "Miss";
    if (distance <= spread * 0.15) {
      evaluation = "Perfect";
    } else if (distance <= spread * 0.3) {
      evaluation = "Great";
    } else if (distance <= spread / 2) {
      evaluation = "Good";
    }
    const outcome = scoreByResult[evaluation];
    setResult(evaluation);
    setAwardedScore(outcome.delta);
    if (outcome.success) {
      onSuccess({ scoreDelta: outcome.delta, note: outcome.note });
    } else {
      onFail({ note: outcome.note, timePenalty: 5 });
    }
  };

  const indicatorPosition = `${progress}%`;

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-charcoal/70">Tap once as the pulse drifts softly through the calm band.</p>
      <button
        type="button"
        onClick={handleTap}
        className="relative h-28 w-full rounded-[30px] border border-white/70 bg-ivory/75"
      >
        <div className="absolute inset-x-8 top-1/2 h-[2px] -translate-y-1/2 bg-gradient-to-r from-transparent via-warmGrey/50 to-transparent" />
        <div
          className="absolute inset-y-6 rounded-[18px] bg-rosegold/10"
          style={{ left: `${zone.start}%`, width: `${zone.end - zone.start}%` }}
        >
          <div className="absolute inset-1 rounded-[16px] border border-rosegold/50" />
        </div>
        <div
          className="absolute inset-y-4 w-[2px] rounded-full bg-rosegold"
          style={{
            left: indicatorPosition,
            transform: "translateX(-50%)",
            boxShadow: result ? "0 0 18px rgba(198, 167, 125, 0.45)" : "0 0 28px rgba(198,167,125,0.3)"
          }}
        />
        <div className="absolute inset-0 rounded-[30px] border border-white/60" />
      </button>
      {result && (
        <div className="text-center font-serif text-lg text-rosegold transition-opacity duration-300">
          {result}
          {awardedScore !== null && (
            <span className="ml-2 text-sm text-charcoal/60">(+{awardedScore})</span>
          )}
        </div>
      )}
    </div>
  );
};

export default TimingGame;
