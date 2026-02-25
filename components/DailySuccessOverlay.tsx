"use client";

import { useEffect } from "react";

type DailySuccessOverlayProps = {
  show: boolean;
  finalStage?: boolean;
  onComplete?: () => void;
};

const DailySuccessOverlay = ({ show, finalStage = false, onComplete }: DailySuccessOverlayProps) => {
  useEffect(() => {
    if (!show) return;
    const duration = finalStage ? 900 : 500;
    const timer = setTimeout(() => {
      onComplete?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [show, finalStage, onComplete]);

  if (!show) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-10 rounded-[32px] bg-rosegold/10 blur-3xl animate-overlayGlow" />
      <svg className="relative h-20 w-20" viewBox="0 0 72 72" fill="none">
        <path d="M18 36 L30 48 L54 24" className="stroke-check" />
      </svg>
    </div>
  );
};

export default DailySuccessOverlay;
