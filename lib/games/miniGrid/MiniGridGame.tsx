"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { GameProps } from "@/types/Game";
import { miniGridPuzzles, type MiniGridPuzzle } from "./data";

const baseScore = 100;

const MiniGridGame = ({ onSuccess, onFail }: GameProps) => {
  const puzzle = useMemo<MiniGridPuzzle>(() => miniGridPuzzles[0], []);
  const [values, setValues] = useState(() =>
    puzzle.grid.map((row) => row.map((cell) => (cell ? "" : null)))
  );
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [activeCellIndex, setActiveCellIndex] = useState(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);

  const activeWord = puzzle.words[activeWordIndex];
  const [activeRow, activeCol] = activeWord.positions[activeCellIndex];

  const selectWord = useCallback(
    (wordIndex: number, cellIndex = 0) => {
      setActiveWordIndex(wordIndex);
      setActiveCellIndex(cellIndex);
    },
    []
  );

  const moveWithinWord = useCallback(
    (delta: -1 | 1) => {
      setActiveCellIndex((prev) => {
        const next = Math.min(Math.max(prev + delta, 0), activeWord.positions.length - 1);
        return next;
      });
    },
    [activeWord.positions.length]
  );

  const setLetterAt = useCallback(
    (row: number, col: number, letter: string) => {
      setValues((prev) =>
        prev.map((r, rIndex) =>
          r.map((cell, cIndex) => {
            if (rIndex === row && cIndex === col) {
              return letter;
            }
            return cell;
          })
        )
      );
      setMessage(null);
    },
    []
  );

  const checkCompletion = useCallback(
    (state: (string | null)[][]) => {
      const hasEmpty = state.some((row) => row.some((cell) => cell === ""));
      if (hasEmpty) return;
      const matches = state.every((row, rIdx) =>
        row.every((cell, cIdx) => {
          if (cell === null) return true;
          return cell?.toUpperCase() === puzzle.grid[rIdx][cIdx];
        })
      );
      if (matches) {
        if (!resolved) {
          setResolved(true);
          const adjustment = hintUsed ? baseScore - 1 : baseScore;
          onSuccess({ scoreDelta: adjustment, note: "Mini grid composed" });
        }
      } else {
        setMessage("Letters misaligned.");
        onFail({ note: "Mini grid unsettled", retry: true, timePenalty: 5 });
      }
    },
    [puzzle.grid, onSuccess, onFail, hintUsed, resolved]
  );

  useEffect(() => {
    checkCompletion(values);
  }, [values, checkCompletion]);

  const handleLetter = useCallback(
    (letter: string) => {
      if (resolved) return;
      const char = letter.toUpperCase();
      if (!/[A-Z]/.test(char)) return;
      const [row, col] = activeWord.positions[activeCellIndex];
      setLetterAt(row, col, char);
      if (activeCellIndex < activeWord.positions.length - 1) {
        moveWithinWord(1);
      }
    },
    [activeWord.positions, activeCellIndex, moveWithinWord, setLetterAt, resolved]
  );

  const handleBackspace = useCallback(() => {
    if (resolved) return;
    const [row, col] = activeWord.positions[activeCellIndex];
    if (values[row][col]) {
      setLetterAt(row, col, "");
      return;
    }
    if (activeCellIndex > 0) {
      moveWithinWord(-1);
      const [prevRow, prevCol] = activeWord.positions[activeCellIndex - 1];
      setLetterAt(prevRow, prevCol, "");
    }
  }, [activeCellIndex, activeWord.positions, moveWithinWord, setLetterAt, values, resolved]);

  const handleArrow = useCallback(
    (direction: "left" | "right" | "up" | "down") => {
      const [row, col] = activeWord.positions[activeCellIndex];
      let nextRow = row;
      let nextCol = col;
      const delta = direction === "left" ? [0, -1] : direction === "right" ? [0, 1] : direction === "up" ? [-1, 0] : [1, 0];
      while (true) {
        nextRow += delta[0];
        nextCol += delta[1];
        if (nextRow < 0 || nextCol < 0 || nextRow >= values.length || nextCol >= values[0].length) return;
        if (puzzle.grid[nextRow][nextCol]) {
          const preferredDirection = delta[0] !== 0 ? "down" : "across";
          const targetIndex = puzzle.words.findIndex((word) =>
            word.direction === preferredDirection && word.positions.some(([r, c]) => r === nextRow && c === nextCol)
          );
          const fallbackIndex = puzzle.words.findIndex((word) =>
            word.positions.some(([r, c]) => r === nextRow && c === nextCol)
          );
          const wordIndex = targetIndex !== -1 ? targetIndex : fallbackIndex;
          if (wordIndex !== -1) {
            const word = puzzle.words[wordIndex];
            const cellIndex = word.positions.findIndex(([r, c]) => r === nextRow && c === nextCol);
            selectWord(wordIndex, cellIndex);
          }
          return;
        }
      }
    },
    [activeWord.positions, activeCellIndex, puzzle.words, puzzle.grid, selectWord, values]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
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
    },
    [handleBackspace, handleArrow, handleLetter]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleCellClick = (row: number, col: number) => {
    if (!puzzle.grid[row][col]) return;
    const wordIndex = puzzle.words.findIndex((word) =>
      word.positions.some(([r, c]) => r === row && c === col && word.direction === activeWord.direction)
    );
    const fallback = puzzle.words.findIndex((word) => word.positions.some(([r, c]) => r === row && c === col));
    const targetIndex = wordIndex !== -1 ? wordIndex : fallback;
    if (targetIndex !== -1) {
      const cellIndex = puzzle.words[targetIndex].positions.findIndex(([r, c]) => r === row && c === col);
      selectWord(targetIndex, cellIndex);
    }
  };

  const handleHint = () => {
    if (hintUsed || resolved) return;
    const targetIndex = puzzle.words.findIndex((word, index) =>
      word.positions.some(([row, col]) => (values[row][col] ?? "") === "") && index >= 0
    );
    const wordIndex = targetIndex === -1 ? 0 : targetIndex;
    const word = puzzle.words[wordIndex];
    setValues((prev) =>
      prev.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          const match = word.positions.some(([r, c]) => r === rIdx && c === cIdx);
          if (match) {
            return puzzle.grid[rIdx][cIdx] ?? "";
          }
          return cell;
        })
      )
    );
    setHintUsed(true);
    selectWord(wordIndex, word.positions.length - 1);
    setMessage("Lift granted.");
  };

  return (
    <div className="flex h-full flex-col gap-6 text-charcoal">
      <div className="grid grid-cols-2 gap-6 text-xs uppercase tracking-[0.3em] text-warmGrey">
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
      <div className="flex flex-1 items-center justify-center">
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${puzzle.grid[0].length}, minmax(0, 1fr))` }}
        >
          {puzzle.grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isEditable = !!cell;
              const isActiveWordCell = activeWord.positions.some(([r, c]) => r === rowIndex && c === colIndex);
              const isActiveCell = rowIndex === activeRow && colIndex === activeCol;
              const displayValue = values[rowIndex][colIndex] ?? "";
              if (!isEditable) {
                return <div key={`${rowIndex}-${colIndex}`} className="h-12 w-12 rounded-[12px] bg-transparent" />;
              }
              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`flex h-12 w-12 items-center justify-center rounded-[12px] border border-white/60 bg-white/80 font-serif text-xl text-charcoal shadow-subtle transition-all duration-200 ${
                    isActiveCell ? "ring-2 ring-[#C6A77D]" : isActiveWordCell ? "bg-[#F8F3ED]" : ""
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
      <ul className="space-y-2 text-charcoal/80">
        {words
          .map((word, index) => ({ ...word, index }))
          .filter((word) => word.direction === direction)
          .map((word) => (
            <li key={word.index}>
              <button
                onClick={() => onSelect(word.index)}
                className={`text-left font-serif text-sm transition-colors duration-150 ${
                  word.index === activeWordIndex ? "text-charcoal" : "text-charcoal/60"
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
