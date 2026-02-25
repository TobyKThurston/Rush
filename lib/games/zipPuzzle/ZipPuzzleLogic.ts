import { useCallback, useMemo, useRef, useState } from "react";

export type ZipPuzzlePoint = { row: number; col: number };
export type ZipAnchor = ZipPuzzlePoint & { value: number };

export type ZipPuzzleData = {
  size: number;
  anchors: ZipAnchor[];
  path: ZipPuzzlePoint[];
};

export type ZipSnapshot = {
  path: ZipPuzzlePoint[];
  status: "idle" | "active" | "won";
  hasBacktracked: boolean;
};

type VisitResult = { changed: boolean; invalidKey?: string };

const keyOf = (point: ZipPuzzlePoint) => `${point.row}-${point.col}`;

class ZipPuzzleEngine {
  size: number;
  totalCells: number;
  anchors: ZipAnchor[];
  anchorKeys: string[];
  anchorsByKey: Map<string, ZipAnchor>;
  path: ZipPuzzlePoint[] = [];
  visited = new Set<string>();
  anchorIndex = -1;
  status: ZipSnapshot["status"] = "idle";
  hasBacktracked = false;
  signature: string;

  constructor(puzzle: ZipPuzzleData, signature: string) {
    this.anchors = [...puzzle.anchors].sort((a, b) => a.value - b.value);
    this.anchorKeys = this.anchors.map((anchor) => keyOf(anchor));
    this.anchorsByKey = new Map(this.anchors.map((anchor) => [keyOf(anchor), anchor]));
    this.size = puzzle.size;
    this.totalCells = this.size * this.size;
    this.signature = signature;
  }

  setPuzzle(puzzle: ZipPuzzleData, signature: string) {
    this.anchors = [...puzzle.anchors].sort((a, b) => a.value - b.value);
    this.anchorKeys = this.anchors.map((anchor) => keyOf(anchor));
    this.anchorsByKey = new Map(this.anchors.map((anchor) => [keyOf(anchor), anchor]));
    this.size = puzzle.size;
    this.totalCells = this.size * this.size;
    this.path = [];
    this.visited = new Set();
    this.anchorIndex = -1;
    this.status = "idle";
    this.hasBacktracked = false;
    this.signature = signature;
  }

  private isAdjacent(a: ZipPuzzlePoint, b: ZipPuzzlePoint) {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
  }

  private ensureStart(point: ZipPuzzlePoint): VisitResult {
    const firstAnchor = this.anchors[0];
    if (!firstAnchor) return { changed: false };
    if (firstAnchor.row !== point.row || firstAnchor.col !== point.col) {
      return { changed: false, invalidKey: keyOf(point) };
    }
    this.path = [point];
    this.visited = new Set([keyOf(point)]);
    this.anchorIndex = 0;
    this.status = this.totalCells === 1 ? "won" : "active";
    return { changed: true };
  }

  private recomputeAnchors() {
    this.anchorIndex = -1;
    this.path.forEach((point) => {
      const anchorIdx = this.anchorKeys.indexOf(keyOf(point));
      if (anchorIdx !== -1 && anchorIdx === this.anchorIndex + 1) {
        this.anchorIndex = anchorIdx;
      }
    });
  }

  private resetVisitedFromPath() {
    this.visited = new Set(this.path.map((point) => keyOf(point)));
  }

  visit(point: ZipPuzzlePoint): VisitResult {
    if (point.row < 0 || point.col < 0 || point.row >= this.size || point.col >= this.size) {
      return { changed: false };
    }

    if (!this.path.length) {
      return this.ensureStart(point);
    }

    const last = this.path[this.path.length - 1];
    if (last.row === point.row && last.col === point.col) {
      return { changed: false };
    }

    if (!this.isAdjacent(last, point)) {
      return { changed: false, invalidKey: keyOf(point) };
    }

    const cellKey = keyOf(point);

    if (this.visited.has(cellKey)) {
      const lastIndex = this.path.length - 1;
      const previousIndex = lastIndex - 1;
      if (previousIndex >= 0) {
        const previous = this.path[previousIndex];
        if (previous.row === point.row && previous.col === point.col) {
          this.path.pop();
          this.resetVisitedFromPath();
          this.hasBacktracked = true;
          this.recomputeAnchors();
          this.status = "active";
          return { changed: true };
        }
      }
      return { changed: false, invalidKey: cellKey };
    }

    const anchor = this.anchorsByKey.get(cellKey);
    const nextAnchor = this.anchors[this.anchorIndex + 1];
    if (anchor) {
      if (!nextAnchor || anchor.value !== nextAnchor.value) {
        return { changed: false, invalidKey: cellKey };
      }
    }

    this.path.push(point);
    this.visited.add(cellKey);
    if (anchor && nextAnchor && anchor.value === nextAnchor.value) {
      this.anchorIndex += 1;
    }
    if (this.path.length === this.totalCells && this.anchorIndex === this.anchors.length - 1) {
      this.status = "won";
    } else {
      this.status = "active";
    }
    return { changed: true };
  }

  undo(): boolean {
    if (this.path.length <= 1) return false;
    this.path.pop();
    this.resetVisitedFromPath();
    this.hasBacktracked = true;
    this.recomputeAnchors();
    this.status = "active";
    return true;
  }

  getSnapshot(): ZipSnapshot {
    return {
      path: [...this.path],
      status: this.status,
      hasBacktracked: this.hasBacktracked
    };
  }
}

export const useZipPuzzleEngine = (puzzle: ZipPuzzleData) => {
  const signature = useMemo(() => JSON.stringify(puzzle), [puzzle]);
  const engineRef = useRef<ZipPuzzleEngine>();
  const [, forceRender] = useState(0);

  if (!engineRef.current) {
    engineRef.current = new ZipPuzzleEngine(puzzle, signature);
  } else if (engineRef.current.signature !== signature) {
    engineRef.current.setPuzzle(puzzle, signature);
  }

  const visit = useCallback(
    (point: ZipPuzzlePoint) => {
      const result = engineRef.current?.visit(point);
      if (result?.changed) {
        forceRender((value) => value + 1);
      }
      return result;
    },
    []
  );

  const undo = useCallback(() => {
    if (engineRef.current?.undo()) {
      forceRender((value) => value + 1);
    }
  }, []);

  return {
    size: puzzle.size,
    anchors: engineRef.current.anchors,
    snapshot: engineRef.current.getSnapshot(),
    visit,
    undo
  };
};
