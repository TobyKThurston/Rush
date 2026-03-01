"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GameProps } from "@/types/Game";
import { miniGridPuzzles, type MiniGridPuzzle } from "./data";

const BASE_SCORE = 50;
const TIME_PENALTY = 5;
const DEBUG_MINI = process.env.NEXT_PUBLIC_RUSH_DEBUG === "1";

const MiniGridGame = ({ onSuccess, onFail }: GameProps) => {
  const puzzle = useMemo<MiniGridPuzzle>(
    () => miniGridPuzzles[Math.floor(Math.random() * miniGridPuzzles.length)],
    []
  );
  const [entries, setEntries] = useState<(string | null)[][]>(
    () => puzzle.grid.map((row) => row.map((cell) => (cell ? "" : null)))
  );
  const [locked, setLocked] = useState<boolean[][]>(
    () => puzzle.grid.map((row) => row.map((cell) => Boolean(cell && false)))
  );
  const [activeWordIndex, setActiveWordIndex] = useState(() => puzzle.words.findIndex((word) => word.direction === "across") || 0);
  const [activeCellIndex, setActiveCellIndex] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [penalizedSignature, setPenalizedSignature] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [boardLocked, setBoardLocked] = useState(false);
  const completionGuard = useRef(false);
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeWord = useMemo(() => puzzle.words[activeWordIndex], [puzzle.words, activeWordIndex]);
  const activePositions = activeWord.positions;
  const [activeRow, activeCol] = activePositions[Math.min(activeCellIndex, activePositions.length - 1)];

  const signature = entries
    .map((row) =>
      row
        .map((cell) => {
          if (cell === null) return "#";
          return cell === "" ? "_" : cell;
        })
        .join("")
    )
    .join("|");

  const selectWord = useCallback(
    (wordIndex: number, cellIndex = 0) => {
      const word = puzzle.words[wordIndex];
      const nextIndex = word.positions.findIndex(([row, col]) => (entries[row][col] ?? "") === "");
      setActiveWordIndex(wordIndex);
      setActiveCellIndex(nextIndex === -1 ? cellIndex : nextIndex);
    },
    [entries, puzzle.words]
  );

  const moveWithinWord = useCallback(
    (delta: -1 | 1) => {
      setActiveCellIndex((prev) => {
        const target = Math.min(Math.max(prev + delta, 0), activePositions.length - 1);
        return target;
      });
    },
    [activePositions.length]
  );

  const setLetterAt = useCallback(
    (row: number, col: number, letter: string) => {
      setEntries((prev) =>
        prev.map((r, rIdx) =>
          r.map((cell, cIdx) => {
            if (rIdx === row && cIdx === col) {
              return letter;
            }
            return cell;
          })
        )
      );
      const expected = puzzle.grid[row][col];
      const isCorrect = expected && letter && letter.toUpperCase() === expected;
      setLocked((prev) =>
        prev.map((r, rIdx) =>
          r.map((cell, cIdx) => {
            if (rIdx === row && cIdx === col) {
              return Boolean(isCorrect);
            }
            return cell;
          })
        )
      );
      if (!isCorrect) {
        setMessage(null);
      }
    },
    [puzzle.grid]
  );

  const handleLetter = useCallback((value: string) => {
    if (resolved || boardLocked) return;
    const char = value.toUpperCase();
    if (!/[A-Z]/.test(char)) return;
    const [row, col] = activePositions[Math.min(activeCellIndex, activePositions.length - 1)];
    if (locked[row][col]) return;
    setLetterAt(row, col, char);
    if (activeCellIndex < activePositions.length - 1) {
      moveWithinWord(1);
    }
  }, [resolved, boardLocked, activePositions, activeCellIndex, moveWithinWord, setLetterAt, locked]);

  const handleBackspace = useCallback(() => {
    if (resolved || boardLocked) return;
    const [row, col] = activePositions[Math.min(activeCellIndex, activePositions.length - 1)];
    if (locked[row][col]) return;
    if (entries[row][col]) {
      setLetterAt(row, col, "");
      return;
    }
    if (activeCellIndex > 0) {
      moveWithinWord(-1);
      const [prevRow, prevCol] = activePositions[Math.max(activeCellIndex - 1, 0)];
      if (!locked[prevRow][prevCol]) {
        setLetterAt(prevRow, prevCol, "");
      }
    }
  }, [resolved, boardLocked, activePositions, activeCellIndex, entries, moveWithinWord, setLetterAt, locked]);

  const handleArrow = useCallback((direction: "left" | "right" | "up" | "down") => {
    const [row, col] = activePositions[Math.min(activeCellIndex, activePositions.length - 1)];
    const deltas: Record<typeof direction, [number, number]> = {
      left: [0, -1],
      right: [0, 1],
      up: [-1, 0],
      down: [1, 0]
    };
    const [dRow, dCol] = deltas[direction];
    let nextRow = row;
    let nextCol = col;

    while (true) {
      nextRow += dRow;
      nextCol += dCol;
      if (nextRow < 0 || nextCol < 0 || nextRow >= puzzle.grid.length || nextCol >= puzzle.grid[0].length) return;
      if (puzzle.grid[nextRow][nextCol]) {
        const preferredDirection = dRow !== 0 ? "down" : "across";
        const targetIndex = puzzle.words.findIndex((word) =>
          word.direction === preferredDirection && word.positions.some(([r, c]) => r === nextRow && c === nextCol)
        );
        const fallbackIndex = puzzle.words.findIndex((word) => word.positions.some(([r, c]) => r === nextRow && c === nextCol));
        const wordIndex = targetIndex !== -1 ? targetIndex : fallbackIndex;
        if (wordIndex !== -1) {
          const cellIndex = puzzle.words[wordIndex].positions.findIndex(([r, c]) => r === nextRow && c === nextCol);
          selectWord(wordIndex, cellIndex);
        }
        return;
      }
    }
  }, [activePositions, activeCellIndex, puzzle.grid, puzzle.words, selectWord]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        event.preventDefault();
        handleBackspace();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handleArrow("left");
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleArrow("right");
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        handleArrow("up");
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        handleArrow("down");
        return;
      }
      if (event.key.length === 1 && /[a-zA-Z]/.test(event.key)) {
        event.preventDefault();
        handleLetter(event.key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleBackspace, handleArrow, handleLetter]);

  useEffect(() => {
    if (resolved) return;
    const hasEmpty = entries.some((row) => row.some((cell) => cell === ""));
    if (hasEmpty) {
      setPenalizedSignature(null);
      setMessage(null);
      return;
    }

    const matches = entries.every((row, rIdx) =>
      row.every((cell, cIdx) => {
        if (cell === null) return true;
        const expected = puzzle.grid[rIdx][cIdx];
        return cell?.toUpperCase() === expected;
      })
    );

    if (matches) {
      if (completionGuard.current) return;
      completionGuard.current = true;
      setResolved(true);
      setIsCompleted(true);
      setBoardLocked(true);
      const adjustment = hintUsed ? BASE_SCORE - 1 : BASE_SCORE;
      if (DEBUG_MINI) {
        console.log("[MiniGrid][complete]", {
          hintUsed,
          scoreDelta: adjustment
        });
      }
      if (completionTimer.current) {
        clearTimeout(completionTimer.current);
      }
      completionTimer.current = setTimeout(() => {
        onSuccess({ scoreDelta: adjustment, note: "Mini grid composed" });
      }, 900);
    } else if (signature !== penalizedSignature) {
      setPenalizedSignature(signature);
      setMessage("Letters misaligned.");
      onFail({ note: "Mini grid unsettled", retry: true, timePenalty: TIME_PENALTY });
    }
  }, [entries, hintUsed, onSuccess, onFail, puzzle.grid, resolved, signature, penalizedSignature]);

  useEffect(() => {
    if (!DEBUG_MINI) return;
    console.log("[MiniGrid][state]", { isCompleted, resolved, boardLocked });
  }, [isCompleted, resolved, boardLocked]);

  useEffect(() => {
    return () => {
      if (completionTimer.current) {
        clearTimeout(completionTimer.current);
        completionTimer.current = null;
      }
    };
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (resolved || boardLocked) return;
    if (!puzzle.grid[row][col]) return;
    const primaryIndex = puzzle.words.findIndex(
      (word) => word.direction === activeWord.direction && word.positions.some(([r, c]) => r === row && c === col)
    );
    const fallbackIndex = puzzle.words.findIndex((word) => word.positions.some(([r, c]) => r === row && c === col));
    const targetIndex = primaryIndex !== -1 ? primaryIndex : fallbackIndex;
    if (targetIndex !== -1) {
      const cellIndex = puzzle.words[targetIndex].positions.findIndex(([r, c]) => r === row && c === col);
      selectWord(targetIndex, cellIndex);
    }
  };

  const handleHint = () => {
    if (hintUsed || resolved || boardLocked) return;
    const targetIndex = puzzle.words.findIndex((word) =>
      word.positions.some(([row, col]) => (entries[row][col] ?? "") === "")
    );
    const wordIndex = targetIndex === -1 ? 0 : targetIndex;
    const word = puzzle.words[wordIndex];
    setEntries((prev) =>
      prev.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          const shouldFill = word.positions.some(([r, c]) => r === rIdx && c === cIdx);
          if (shouldFill) {
            return puzzle.grid[rIdx][cIdx] ?? "";
          }
          return cell;
        })
      )
    );
    setHintUsed(true);
    setMessage("Lift granted.");
    setPenalizedSignature(null);
    selectWord(wordIndex, word.positions.length - 1);
  };

  return (
    <div className="flex h-full flex-col gap-5 text-charcoal">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-warmGrey">Mini Grid</p>
        <p className="mt-2 text-xs uppercase tracking-[0.32em] text-charcoal/55">{puzzle.title} Crossword</p>
      </div>
      <div className="grid grid-cols-2 gap-4 overflow-y-auto text-xs uppercase tracking-[0.35em] text-warmGrey">
        <ClueList
          label="Across"
          words={puzzle.words}
          direction="across"
          activeWordIndex={activeWordIndex}
          onSelect={selectWord}
        />
        <ClueList
          label="Down"
          words={puzzle.words}
          direction="down"
          activeWordIndex={activeWordIndex}
          onSelect={selectWord}
        />
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div
          className="grid w-full min-w-0 gap-1.5"
          style={{ gridTemplateColumns: `repeat(${puzzle.grid[0].length}, minmax(0, 1fr))` }}
        >
          {puzzle.grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              if (!cell) {
                return <div key={`${rowIndex}-${colIndex}`} className="aspect-square rounded-[14px] bg-transparent" />;
              }
              const isWordCell = activeWord.positions.some(([r, c]) => r === rowIndex && c === colIndex);
              const isRowOrColActive =
                activeWord.direction === "across" ? rowIndex === activeRow : colIndex === activeCol;
              const isActiveCell = rowIndex === activeRow && colIndex === activeCol;
              const displayValue = entries[rowIndex][colIndex] ?? "";
              const isLocked = locked[rowIndex][colIndex];
              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`flex aspect-square min-h-0 min-w-0 items-center justify-center rounded-[14px] border border-white/60 bg-white/80 font-serif text-xl text-charcoal shadow-subtle transition-all duration-200 ease-gentle hover:-translate-y-0.5 ${
                    isActiveCell
                      ? "ring-2 ring-[#C6A77D]"
                      : isWordCell
                        ? "bg-[#F8F3ED]"
                        : isRowOrColActive
                          ? "bg-[#EADBC8]"
                          : ""
                  } ${
                    isLocked
                      ? "!border-[#B48C57] !bg-[#D8B680] text-charcoal ring-2 ring-[#B48C57]"
                      : ""
                  }`}
                >
                  {displayValue}
                </button>
              );
            })
          )}
        </div>
      </div>
      <div className="text-center text-xs text-warmGrey">
        {hintUsed ? (
          <span>Lift granted.</span>
        ) : (
          <button onClick={handleHint} className="text-[#C6A77D] transition-opacity hover:opacity-80">
            Need a lift?
          </button>
        )}
      </div>
      {message && <p className="text-center text-xs text-charcoal/70">{message}</p>}
    </div>
  );
};

const ClueList = ({
  label,
  direction,
  words,
  activeWordIndex,
  onSelect
}: {
  label: string;
  direction: "across" | "down";
  words: MiniGridPuzzle["words"];
  activeWordIndex: number;
  onSelect: (index: number) => void;
}) => {
  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-[0.5em] text-warmGrey/80">{label}</p>
      <ul className="space-y-2 text-charcoal">
        {words
          .map((word, index) => ({ ...word, index }))
          .filter((word) => word.direction === direction)
          .map((word) => (
            <li key={word.index}>
              <button
                onClick={() => onSelect(word.index)}
                className={`font-serif text-sm transition-colors duration-150 ${
                  word.index === activeWordIndex ? "text-charcoal" : "text-charcoal/50"
                }`}
              >
                {word.clue}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default MiniGridGame;
