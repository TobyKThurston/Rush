import { eliminateCategories, propertyRules } from "./data";

export type EliminateDifficulty = 1 | 2 | 3;

export type EliminatePuzzle = {
  items: string[];
  correctIndex: number;
  explanation: string;
  mode: "Category" | "Property" | "Sequence";
};

const pickRandom = <T>(items: readonly T[]): T => items[Math.floor(Math.random() * items.length)];

const shuffle = <T>(array: readonly T[]): T[] => {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
};

const buildCategoryPuzzle = (): EliminatePuzzle => {
  const category = pickRandom(eliminateCategories);
  const items = shuffle(category.pool).slice(0, 5);
  let intruder = pickRandom(category.intruders);
  while (items.includes(intruder)) {
    intruder = pickRandom(category.intruders);
  }
  const finalItems = shuffle([...items, intruder]);
  const correctIndex = finalItems.indexOf(intruder);
  return {
    items: finalItems,
    correctIndex,
    explanation: `${category.name} set`,
    mode: "Category"
  };
};

const buildPropertyPuzzle = (): EliminatePuzzle => {
  const rule = pickRandom(propertyRules);
  const validItems = shuffle(rule.correctPool).slice(0, 5);
  let intruder = pickRandom(rule.intruderPool);
  while (validItems.includes(intruder)) {
    intruder = pickRandom(rule.intruderPool);
  }
  const finalItems = shuffle([...validItems, intruder]);
  return {
    items: finalItems,
    correctIndex: finalItems.indexOf(intruder),
    explanation: rule.description,
    mode: "Property"
  };
};

const SEQUENCE_RULES = [
  {
    explanation: "Consecutive numbers (+2)",
    valid: ["4", "6", "8", "10", "12", "14", "16"],
    intruders: ["11", "13", "15"]
  },
  {
    explanation: "Alphabetical month order",
    valid: ["April", "August", "December", "February", "January", "July", "June"],
    intruders: ["October", "November", "September"]
  },
  {
    explanation: "Roman numerals",
    valid: ["I", "II", "III", "IV", "V", "VI", "VII"],
    intruders: ["A", "B", "C"]
  }
] as const;

const buildSequencePuzzle = (): EliminatePuzzle => {
  const rule = pickRandom(SEQUENCE_RULES);
  const validItems = shuffle(rule.valid).slice(0, 5);
  const intruder = pickRandom(rule.intruders);
  const finalItems = shuffle([...validItems, intruder]);
  return {
    items: finalItems,
    correctIndex: finalItems.indexOf(intruder),
    explanation: rule.explanation,
    mode: "Sequence"
  };
};

export const generateEliminatePuzzle = (difficulty: EliminateDifficulty = 2): EliminatePuzzle => {
  if (difficulty === 1) {
    return buildCategoryPuzzle();
  }
  if (difficulty === 3) {
    const hardBuilders = [buildPropertyPuzzle, buildSequencePuzzle];
    return pickRandom(hardBuilders)();
  }
  const mixedBuilders = [buildCategoryPuzzle, buildPropertyPuzzle, buildSequencePuzzle];
  return pickRandom(mixedBuilders)();
};
