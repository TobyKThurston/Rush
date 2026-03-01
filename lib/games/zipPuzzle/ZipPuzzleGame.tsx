"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent
} from "react";
import type { GameProps } from "@/types/Game";
import { generateZipPuzzle, type ZipPuzzleDifficulty } from "./generatePuzzle";
import { useZipPuzzleEngine, type ZipPuzzlePoint } from "./ZipPuzzleLogic";

const keyOf = (point: ZipPuzzlePoint) => `${point.row}-${point.col}`;
const DIFFICULTIES: ZipPuzzleDifficulty[] = ["calm", "balanced", "bold"];

const ZipPuzzleGame = ({ onSuccess, status }: GameProps) => {
  const difficulty = useMemo(() => DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)], []);
  const puzzle = useMemo(() => generateZipPuzzle({ difficulty }), [difficulty]);
  const { size, anchors, snapshot, visit, undo } = useZipPuzzleEngine(puzzle);
  const anchorMap = useMemo(() => new Map(anchors.map((anchor) => [keyOf(anchor), anchor])), [anchors]);
  const pointerRef = useRef<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const announcedRef = useRef(false);
  const [shakeKey, setShakeKey] = useState<string | null>(null);
  const shakeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeKey = snapshot.path.length ? keyOf(snapshot.path[snapshot.path.length - 1]) : null;
  const polylinePoints = snapshot.path
    .map((point) => `${((point.col + 0.5) / size) * 100},${((point.row + 0.5) / size) * 100}`)
    .join(" ");

  useEffect(() => {
    if (snapshot.status === "won" && !announcedRef.current) {
      announcedRef.current = true;
      const base = size * 10;
      const timeBonus = (status?.timeLeft ?? 0) * 2;
      const accuracyBonus = snapshot.hasBacktracked ? 0 : 20;
      onSuccess({ scoreDelta: base + timeBonus + accuracyBonus, note: "Zip complete" });
    }
  }, [snapshot.status, snapshot.hasBacktracked, onSuccess, size, status?.timeLeft]);

  const triggerShake = (key: string) => {
    setShakeKey(key);
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    shakeTimeoutRef.current = setTimeout(() => {
      setShakeKey((current) => (current === key ? null : current));
    }, 220);
  };

  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
    };
  }, []);

  const positionToCell = (event: PointerEvent, element: HTMLDivElement) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
    const cellWidth = rect.width / size;
    const cellHeight = rect.height / size;
    const col = Math.min(size - 1, Math.max(0, Math.floor(x / cellWidth)));
    const row = Math.min(size - 1, Math.max(0, Math.floor(y / cellHeight)));
    return { row, col };
  };

  const processPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const cell = positionToCell(event.nativeEvent, gridRef.current);
    if (!cell) return;
    const result = visit(cell);
    if (result?.invalidKey) {
      triggerShake(result.invalidKey);
    }
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    gridRef.current?.setPointerCapture(event.pointerId);
    pointerRef.current = event.pointerId;
    processPointer(event);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerRef.current !== event.pointerId) return;
    event.preventDefault();
    processPointer(event);
  };

  const releasePointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerRef.current === event.pointerId) {
      pointerRef.current = null;
      if (gridRef.current?.hasPointerCapture(event.pointerId)) {
        gridRef.current.releasePointerCapture(event.pointerId);
      }
    }
  };

  const gridDimension = Math.min(570, size * 88);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-warmGrey">Zip Puzzle</p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-charcoal/55">
          {difficulty} mode • {size}x{size}
        </p>
        <p className="mt-2 text-sm text-charcoal/70">Glide through every anchor with a single composed line.</p>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={undo}
          className="rounded-full border border-white/60 bg-white/30 px-4 py-1 text-[10px] uppercase tracking-[0.3em] text-charcoal/70 transition-colors hover:border-rosegold/60 hover:text-charcoal"
        >
          Undo
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div
          className="relative aspect-square w-full max-h-full select-none"
          style={{ maxWidth: `${gridDimension}px` }}
        >
          <div className="absolute inset-0 rounded-[28px] bg-ivory/80 p-4 shadow-inner">
            <div
              ref={gridRef}
              className="relative h-full w-full touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={releasePointer}
              onPointerLeave={releasePointer}
              onPointerCancel={releasePointer}
            >
              {snapshot.path.length >= 2 && (
                <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline
                    points={polylinePoints}
                    fill="none"
                    stroke={snapshot.status === "won" ? "#C6A77D" : "rgba(198,167,125,0.6)"}
                    strokeWidth={2.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ filter: snapshot.status === "won" ? "drop-shadow(0 0 6px rgba(198,167,125,0.6))" : "" }}
                  />
                </svg>
              )}
              <div
                className="relative grid h-full w-full"
                style={{
                  gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${size}, minmax(0, 1fr))`
                }}
              >
                {Array.from({ length: size }).flatMap((_, row) =>
                  Array.from({ length: size }).map((__, col) => {
                    const key = `${row}-${col}`;
                    const anchor = anchorMap.get(key);
                    const isActive = key === activeKey;
                    const tone = anchor
                      ? isActive
                        ? "bg-rosegold/30"
                        : "bg-white/70"
                      : isActive
                      ? "bg-rosegold/15"
                      : "bg-white/60";
                    return (
                      <div
                        key={key}
                        className={`m-[1px] flex items-center justify-center rounded-[16px] border border-white/60 text-charcoal shadow-sm transition-all duration-200 ease-gentle ${
                          tone
                        } ${isActive ? "shadow-[0_8px_20px_rgba(198,167,125,0.35)]" : ""} ${shakeKey === key ? "animate-zipShake" : ""}`}
                      >
                        {anchor && (
                          <span className="font-serif text-xl text-rosegold">{anchor.value}</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              {snapshot.status === "won" && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[24px] bg-gradient-to-br from-white/30 to-rosegold/20 text-center text-sm font-medium text-charcoal/80">
                  Sequence complete
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZipPuzzleGame;
