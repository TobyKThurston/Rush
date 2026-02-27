"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { GameProps } from "@/types/Game";

type PulseResult = "Perfect" | "Great" | "Good" | "Miss";
type PulseStyle = "Sine" | "Triangle" | "Drift";

const scoreByResult: Record<PulseResult, { delta: number; note: string; success: boolean }> = {
  Perfect: { delta: 140, note: "Pulse aligned", success: true },
  Great: { delta: 120, note: "Harmonic timing", success: true },
  Good: { delta: 100, note: "Steady breath", success: true },
  Miss: { delta: 0, note: "Outside the calm", success: false }
};

const triangleWave = (phase: number) => {
  const normalized = ((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const scaled = normalized / Math.PI;
  if (scaled <= 1) return scaled;
  return 2 - scaled;
};

const TimingGame = ({ onSuccess, onFail, status }: GameProps) => {
  const [progress, setProgress] = useState(50);
  const [result, setResult] = useState<PulseResult | null>(null);
  const [awardedScore, setAwardedScore] = useState<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const resolved = useRef(false);

  const isArcade = !status;
  const style = useMemo<PulseStyle>(() => {
    const styles: PulseStyle[] = ["Sine", "Triangle", "Drift"];
    return styles[Math.floor(Math.random() * styles.length)];
  }, []);

  const speed = useMemo(() => (isArcade ? 0.05 + Math.random() * 0.05 : 0.12 + Math.random() * 0.1), [isArcade]);
  const zone = useMemo(() => {
    const width = 8 + Math.random() * 10;
    const center = 20 + Math.random() * 60;
    const start = Math.max(4, center - width / 2);
    const end = Math.min(96, start + width);
    return { start, end };
  }, []);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (startRef.current === null) {
        startRef.current = timestamp;
      }
      const elapsed = timestamp - startRef.current;
      const phase = (elapsed / 1000) * speed * Math.PI * 2;

      let position = 50;
      if (style === "Sine") {
        position = 50 + 50 * Math.sin(phase);
      } else if (style === "Triangle") {
        position = triangleWave(phase) * 100;
      } else {
        position = 50 + 38 * Math.sin(phase) + 12 * Math.sin(phase * 2.4);
      }

      setProgress(Math.max(0, Math.min(100, position)));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed, style]);

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
      <p className="text-center text-[10px] uppercase tracking-[0.35em] text-charcoal/55">Rhythm Style: {style}</p>
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
          {awardedScore !== null && <span className="ml-2 text-sm text-charcoal/60">(+{awardedScore})</span>}
        </div>
      )}
    </div>
  );
};

export default TimingGame;
