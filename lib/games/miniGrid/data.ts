export type MiniGridPuzzle = {
  grid: (string | null)[][];
  words: { direction: "across" | "down"; clue: string; positions: Array<[number, number]> }[];
};

export const miniGridPuzzles: MiniGridPuzzle[] = [
  {
    grid: [
      ["C", "A", "T"],
      ["A", null, "E"],
      ["T", "E", "A"]
    ],
    words: [
      { direction: "across", clue: "Small feline", positions: [[0, 0], [0, 1], [0, 2]] },
      { direction: "across", clue: "Warm drink", positions: [[2, 0], [2, 1], [2, 2]] },
      { direction: "down", clue: "Feline sound", positions: [[0, 2], [1, 2], [2, 2]] },
      { direction: "down", clue: "Beverage plant", positions: [[0, 0], [1, 0], [2, 0]] }
    ]
  }
];
