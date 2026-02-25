export type EliminateCategory = {
  name: string;
  pool: string[];
  intruders: string[];
};

export type PropertyRule = {
  description: string;
  correctPool: string[];
  intruderPool: string[];
};

export const eliminateCategories: EliminateCategory[] = [
  {
    name: "Fruits",
    pool: ["Apple", "Pear", "Banana", "Orange", "Grape", "Peach", "Plum", "Mango", "Kiwi"],
    intruders: ["Carrot", "Celery", "Cucumber"]
  },
  {
    name: "Animals",
    pool: ["Horse", "Lion", "Zebra", "Camel", "Panda", "Tiger", "Koala"],
    intruders: ["Bonsai", "Quartz", "Velvet"]
  },
  {
    name: "Gemstones",
    pool: ["Ruby", "Emerald", "Sapphire", "Diamond", "Topaz", "Opal", "Garnet"],
    intruders: ["Marble", "Pearl", "Ivory"]
  },
  {
    name: "Capital Cities",
    pool: ["Paris", "Rome", "Berlin", "Madrid", "Vienna", "Prague", "Oslo", "Athens"],
    intruders: ["Sydney", "Zurich", "Montreal"]
  },
  {
    name: "Tea Varietals",
    pool: ["Sencha", "Matcha", "Oolong", "Assam", "Darjeeling", "Gyokuro"],
    intruders: ["Espresso", "Cocoa"]
  }
];

export const propertyRules: PropertyRule[] = [
  {
    description: "Four-letter words",
    correctPool: ["Lily", "Rose", "Iris", "Fern", "Mint", "Lace", "Nori"],
    intruderPool: ["Tulip", "Daisy", "Petal"]
  },
  {
    description: "Even numbers",
    correctPool: ["2", "4", "6", "8", "10", "12", "14"],
    intruderPool: ["9", "11", "15"]
  },
  {
    description: "Prime numbers",
    correctPool: ["2", "3", "5", "7", "11", "13", "17"],
    intruderPool: ["12", "15", "21"]
  },
  {
    description: "Words ending with a vowel",
    correctPool: ["Aura", "Mosa", "Cameo", "Halo", "Tempo", "Solea"],
    intruderPool: ["Velvet", "Marble", "Quartz"]
  }
];
