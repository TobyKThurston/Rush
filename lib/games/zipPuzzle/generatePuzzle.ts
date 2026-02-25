import type { ZipAnchor, ZipPuzzleData, ZipPuzzlePoint } from "./ZipPuzzleLogic";
import { zipPuzzleTemplates, type ZipPuzzleTemplate } from "./templates";

export type ZipPuzzleDifficulty = "calm" | "balanced" | "bold";

const rotatePoint = (point: ZipPuzzlePoint, size: number, rotation: number): ZipPuzzlePoint => {
  switch (rotation % 4) {
    case 1:
      return { row: point.col, col: size - 1 - point.row };
    case 2:
      return { row: size - 1 - point.row, col: size - 1 - point.col };
    case 3:
      return { row: size - 1 - point.col, col: point.row };
    default:
      return point;
  }
};

const mirrorPoint = (point: ZipPuzzlePoint, size: number, mirror: boolean): ZipPuzzlePoint => {
  if (!mirror) return point;
  return { row: point.row, col: size - 1 - point.col };
};

const transformPoint = (point: ZipPuzzlePoint, size: number, rotation: number, mirror: boolean): ZipPuzzlePoint => {
  const rotated = rotatePoint(point, size, rotation);
  return mirrorPoint(rotated, size, mirror);
};

const selectTemplates = (_difficulty: ZipPuzzleDifficulty): ZipPuzzleTemplate[] => {
  return zipPuzzleTemplates.filter((template) => template.size === 5);
};

const buildAnchors = (path: ZipPuzzlePoint[], steps: number[]): ZipAnchor[] =>
  steps.map((position, index) => {
    const clampedIndex = Math.min(path.length - 1, position);
    const point = path[clampedIndex];
    return { row: point.row, col: point.col, value: index + 1 };
  });

export const generateZipPuzzle = (options?: { difficulty?: ZipPuzzleDifficulty }): ZipPuzzleData => {
  const difficulty = options?.difficulty ?? "balanced";
  const pool = selectTemplates(difficulty);
  const template = pool[Math.floor(Math.random() * pool.length)];
  const rotation = Math.floor(Math.random() * 4);
  const mirror = Math.random() > 0.5;
  const transformedPath = template.path.map((point) => transformPoint(point, template.size, rotation, mirror));
  const anchors = buildAnchors(transformedPath, template.anchorSteps);
  return {
    size: template.size,
    anchors,
    path: transformedPath
  };
};
