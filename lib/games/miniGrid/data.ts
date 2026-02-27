export type MiniGridPuzzle = {
  title: string;
  grid: (string | null)[][];
  words: { direction: "across" | "down"; clue: string; positions: Array<[number, number]> }[];
};

type WordEntry = { answer: string; clue: string };

type Placement = {
  word: string;
  clue: string;
  direction: "across" | "down";
  row: number;
  col: number;
};

const WORD_BANKS: Array<{ title: string; entries: WordEntry[] }> = [
  {
    title: "Nature",
    entries: [
      { answer: "CAT", clue: "Small pet" },
      { answer: "DOG", clue: "Loyal pet" },
      { answer: "SUN", clue: "Daylight star" },
      { answer: "MOON", clue: "Night light" },
      { answer: "TREE", clue: "Tall plant" },
      { answer: "LEAF", clue: "Green blade" }
    ]
  },
  {
    title: "City Life",
    entries: [
      { answer: "TRAIN", clue: "Rail commuter" },
      { answer: "ROAD", clue: "Paved route" },
      { answer: "CAFE", clue: "Espresso spot" },
      { answer: "TOWER", clue: "Skyline feature" },
      { answer: "TAXI", clue: "Metered ride" },
      { answer: "PARK", clue: "Urban greenspace" }
    ]
  },
  {
    title: "Tech",
    entries: [
      { answer: "CODE", clue: "What developers write" },
      { answer: "CACHE", clue: "Fast temporary storage" },
      { answer: "STACK", clue: "LIFO structure" },
      { answer: "QUERY", clue: "Database request" },
      { answer: "PIXEL", clue: "Smallest screen unit" },
      { answer: "CLOUD", clue: "Remote compute model" }
    ]
  },
  {
    title: "Food",
    entries: [
      { answer: "BASIL", clue: "Green kitchen herb" },
      { answer: "PASTA", clue: "Italian staple" },
      { answer: "MANGO", clue: "Tropical fruit" },
      { answer: "BREAD", clue: "Baked loaf" },
      { answer: "OLIVE", clue: "Mediterranean fruit" },
      { answer: "HONEY", clue: "Bee-made sweetener" }
    ]
  }
];

const toKey = (row: number, col: number) => `${row},${col}`;

const sanitizeWords = (words: WordEntry[]) =>
  words
    .map(({ answer, clue }) => ({
      word: answer.replace(/[^a-zA-Z]/g, "").toUpperCase(),
      clue
    }))
    .filter(({ word }) => word.length >= 2);

const isOccupied = (grid: Map<string, string>, row: number, col: number) =>
  grid.has(toKey(row, col));

const canPlace = (
  grid: Map<string, string>,
  word: string,
  row: number,
  col: number,
  direction: "across" | "down"
) => {
  // Enforce crossword spacing: only true intersections are allowed.
  const beforeRow = direction === "across" ? row : row - 1;
  const beforeCol = direction === "across" ? col - 1 : col;
  const afterRow = direction === "across" ? row : row + word.length;
  const afterCol = direction === "across" ? col + word.length : col;
  if (isOccupied(grid, beforeRow, beforeCol)) return false;
  if (isOccupied(grid, afterRow, afterCol)) return false;

  for (let i = 0; i < word.length; i += 1) {
    const r = direction === "across" ? row : row + i;
    const c = direction === "across" ? col + i : col;
    const key = toKey(r, c);
    const existing = grid.get(key);
    if (existing && existing !== word[i]) return false;

    if (!existing) {
      if (direction === "across") {
        if (isOccupied(grid, r - 1, c) || isOccupied(grid, r + 1, c)) return false;
      } else {
        if (isOccupied(grid, r, c - 1) || isOccupied(grid, r, c + 1)) return false;
      }
    }
  }
  return true;
};

const placeWord = (
  grid: Map<string, string>,
  word: string,
  row: number,
  col: number,
  direction: "across" | "down"
) => {
  for (let i = 0; i < word.length; i += 1) {
    const r = direction === "across" ? row : row + i;
    const c = direction === "across" ? col + i : col;
    grid.set(toKey(r, c), word[i]);
  }
};

const buildMiniGridPuzzle = (title: string, entries: WordEntry[]): MiniGridPuzzle => {
  const cleaned = sanitizeWords(entries).sort((a, b) => b.word.length - a.word.length);
  if (cleaned.length === 0) {
    return { title, grid: [["A"]], words: [] };
  }

  const grid = new Map<string, string>();
  const placements: Placement[] = [];
  const usedAcrossRows = new Set<number>();
  const usedDownCols = new Set<number>();

  const first = cleaned[0];
  placeWord(grid, first.word, 0, 0, "across");
  placements.push({ word: first.word, clue: first.clue, direction: "across", row: 0, col: 0 });
  usedAcrossRows.add(0);

  for (let i = 1; i < cleaned.length; i += 1) {
    const { word, clue } = cleaned[i];
    let best: Placement | null = null;
    let bestIntersections = -1;
    const preferredDirection: "across" | "down" = i % 2 === 1 ? "down" : "across";

    const tryDirection = (direction: "across" | "down") => {
      for (let letterIndex = 0; letterIndex < word.length; letterIndex += 1) {
        const letter = word[letterIndex];
        for (const [key, existing] of Array.from(grid.entries())) {
          if (existing !== letter) continue;
          const [rStr, cStr] = key.split(",");
          const r = Number(rStr);
          const c = Number(cStr);

          if (direction === "across") {
            const acrossRow = r;
            const acrossCol = c - letterIndex;
            if (usedAcrossRows.has(acrossRow)) continue;
            if (canPlace(grid, word, acrossRow, acrossCol, "across")) {
              const intersections = word.split("").reduce((count, ch, idx) => {
                const k = toKey(acrossRow, acrossCol + idx);
                return count + (grid.get(k) === ch ? 1 : 0);
              }, 0);
              if (intersections > bestIntersections) {
                bestIntersections = intersections;
                best = { word, clue, direction: "across", row: acrossRow, col: acrossCol };
              }
            }
          } else {
            const downRow = r - letterIndex;
            const downCol = c;
            if (usedDownCols.has(downCol)) continue;
            if (canPlace(grid, word, downRow, downCol, "down")) {
              const intersections = word.split("").reduce((count, ch, idx) => {
                const k = toKey(downRow + idx, downCol);
                return count + (grid.get(k) === ch ? 1 : 0);
              }, 0);
              if (intersections > bestIntersections) {
                bestIntersections = intersections;
                best = { word, clue, direction: "down", row: downRow, col: downCol };
              }
            }
          }
        }
      }
    };

    tryDirection(preferredDirection);
    if (!best) {
      tryDirection(preferredDirection === "across" ? "down" : "across");
    }

    if (!best) {
      let maxRow = 0;
      let maxCol = 0;
      for (const key of Array.from(grid.keys())) {
        const [rStr, cStr] = key.split(",");
        maxRow = Math.max(maxRow, Number(rStr));
        maxCol = Math.max(maxCol, Number(cStr));
      }
      const fallbackDirection = preferredDirection;
      if (fallbackDirection === "across") {
        let row = maxRow + 2;
        while (usedAcrossRows.has(row)) row += 1;
        best = { word, clue, direction: "across", row, col: 0 };
      } else {
        let col = maxCol + 2;
        while (usedDownCols.has(col)) col += 1;
        best = { word, clue, direction: "down", row: 0, col };
      }
    }

    placeWord(grid, best.word, best.row, best.col, best.direction);
    placements.push(best);
    if (best.direction === "across") {
      usedAcrossRows.add(best.row);
    } else {
      usedDownCols.add(best.col);
    }
  }

  let minRow = 0;
  let minCol = 0;
  let maxRow = 0;
  let maxCol = 0;
  for (const key of Array.from(grid.keys())) {
    const [rStr, cStr] = key.split(",");
    const r = Number(rStr);
    const c = Number(cStr);
    minRow = Math.min(minRow, r);
    minCol = Math.min(minCol, c);
    maxRow = Math.max(maxRow, r);
    maxCol = Math.max(maxCol, c);
  }

  const height = maxRow - minRow + 1;
  const width = maxCol - minCol + 1;
  const gridArray: (string | null)[][] = Array.from({ length: height }, () => Array.from({ length: width }, () => null));

  for (const [key, letter] of Array.from(grid.entries())) {
    const [rStr, cStr] = key.split(",");
    const r = Number(rStr) - minRow;
    const c = Number(cStr) - minCol;
    gridArray[r][c] = letter;
  }

  const words = placements.map((placement) => {
    const positions: Array<[number, number]> = [];
    for (let idx = 0; idx < placement.word.length; idx += 1) {
      const r = placement.direction === "across" ? placement.row : placement.row + idx;
      const c = placement.direction === "across" ? placement.col + idx : placement.col;
      positions.push([r - minRow, c - minCol]);
    }
    return {
      direction: placement.direction,
      clue: placement.clue,
      positions
    };
  });

  return { title, grid: gridArray, words };
};

export const miniGridPuzzles: MiniGridPuzzle[] = WORD_BANKS.map((bank) =>
  buildMiniGridPuzzle(bank.title, bank.entries)
);
