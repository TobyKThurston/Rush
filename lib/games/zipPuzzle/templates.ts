import type { ZipPuzzlePoint } from "./ZipPuzzleLogic";

export type ZipPuzzleTemplate = {
  id: string;
  size: number;
  path: ZipPuzzlePoint[];
  anchorSteps: number[];
};

const buildSnakePath = (size: number, orientation: "horizontal" | "vertical" = "horizontal"): ZipPuzzlePoint[] => {
  const path: ZipPuzzlePoint[] = [];
  if (orientation === "horizontal") {
    for (let row = 0; row < size; row += 1) {
      if (row % 2 === 0) {
        for (let col = 0; col < size; col += 1) {
          path.push({ row, col });
        }
      } else {
        for (let col = size - 1; col >= 0; col -= 1) {
          path.push({ row, col });
        }
      }
    }
  } else {
    for (let col = 0; col < size; col += 1) {
      if (col % 2 === 0) {
        for (let row = 0; row < size; row += 1) {
          path.push({ row, col });
        }
      } else {
        for (let row = size - 1; row >= 0; row -= 1) {
          path.push({ row, col });
        }
      }
    }
  }
  return path;
};

const buildSpiralPath = (size: number, clockwise = true): ZipPuzzlePoint[] => {
  const visited = Array.from({ length: size }, () => Array(size).fill(false));
  const path: ZipPuzzlePoint[] = [];
  let row = clockwise ? 0 : 0;
  let col = clockwise ? 0 : size - 1;
  let dirIndex = 0;
  const dirs = clockwise
    ? [
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: -1, col: 0 }
      ]
    : [
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: -1, col: 0 },
        { row: 0, col: 1 }
      ];

  for (let i = 0; i < size * size; i += 1) {
    path.push({ row, col });
    visited[row][col] = true;
    let nextRow = row + dirs[dirIndex].row;
    let nextCol = col + dirs[dirIndex].col;
    if (
      nextRow < 0 ||
      nextRow >= size ||
      nextCol < 0 ||
      nextCol >= size ||
      visited[nextRow][nextCol]
    ) {
      dirIndex = (dirIndex + 1) % dirs.length;
      nextRow = row + dirs[dirIndex].row;
      nextCol = col + dirs[dirIndex].col;
    }
    row = nextRow;
    col = nextCol;
  }
  return path;
};

const createAnchorSteps = (length: number, anchors = 7): number[] => {
  const steps: number[] = [];
  const gap = Math.max(1, Math.floor((length - 1) / (anchors - 1)));
  for (let i = 0; i < anchors; i += 1) {
    steps.push(Math.min(length - 1, i * gap));
  }
  if (!steps.includes(length - 1)) {
    steps.push(length - 1);
  }
  return Array.from(new Set(steps)).sort((a, b) => a - b);
};

const template = (id: string, size: number, path: ZipPuzzlePoint[], anchorCount: number): ZipPuzzleTemplate => ({
  id,
  size,
  path,
  anchorSteps: createAnchorSteps(path.length, anchorCount)
});

const makeTemplates = (size: number): ZipPuzzleTemplate[] => {
  const horizontalSnake = buildSnakePath(size, "horizontal");
  const verticalSnake = buildSnakePath(size, "vertical");
  const spiralCW = buildSpiralPath(size, true);
  const spiralCCW = buildSpiralPath(size, false);
  const reverseSnake = [...horizontalSnake].reverse();
  const reverseSpiral = [...spiralCW].reverse();
  const baseAnchorCount = Math.max(7, size);
  return [
    template(`snake-h-${size}`, size, horizontalSnake, Math.max(5, baseAnchorCount - 1)),
    template(`snake-v-${size}`, size, verticalSnake, Math.max(5, baseAnchorCount)),
    template(`snake-h-rev-${size}`, size, reverseSnake, Math.max(5, baseAnchorCount)),
    template(`spiral-cw-${size}`, size, spiralCW, Math.max(5, baseAnchorCount)),
    template(`spiral-ccw-${size}`, size, spiralCCW, Math.max(5, baseAnchorCount)),
    template(`spiral-out-${size}`, size, reverseSpiral, Math.max(5, baseAnchorCount))
  ];
};

export const zipPuzzleTemplates: ZipPuzzleTemplate[] = [...makeTemplates(4), ...makeTemplates(5), ...makeTemplates(6)];
