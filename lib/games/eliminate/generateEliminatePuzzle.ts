import { eliminateCategories, propertyRules } from "./data";

export type EliminateDifficulty = 1 | 2 | 3;

export type EliminatePuzzle = {
  items: string[];
  correctIndex: number;
  explanation: string;
};

const pickRandom = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const shuffle = <T>(array: T[]): T[] => {
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
    explanation: `${category.name} vs intruder`
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
    explanation: rule.description
  };
};

export const generateEliminatePuzzle = (difficulty: EliminateDifficulty = 2): EliminatePuzzle => {
  if (difficulty === 1) {
    return buildCategoryPuzzle();
  }
  return Math.random() > 0.5 ? buildCategoryPuzzle() : buildPropertyPuzzle();
};
