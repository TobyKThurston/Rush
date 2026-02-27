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
  },
  {
    name: "Musical Instruments",
    pool: ["Violin", "Cello", "Flute", "Oboe", "Clarinet", "Piano", "Harp"],
    intruders: ["Canvas", "Sculpture", "Marble"]
  },
  {
    name: "Planets",
    pool: ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Neptune"],
    intruders: ["Pluto", "Europa", "Andromeda"]
  },
  {
    name: "Programming Languages",
    pool: ["Python", "Java", "Kotlin", "Rust", "Swift", "Go", "Ruby"],
    intruders: ["Docker", "Kubernetes", "Postgres"]
  },
  {
    name: "Sports",
    pool: ["Tennis", "Soccer", "Baseball", "Rugby", "Cricket", "Hockey", "Volleyball"],
    intruders: ["Opera", "Ballet", "Haiku"]
  },
  {
    name: "Kitchen Spices",
    pool: ["Cumin", "Paprika", "Turmeric", "Coriander", "Nutmeg", "Saffron", "Cinnamon"],
    intruders: ["Basil", "Thyme", "Parsley"]
  },
  {
    name: "US States",
    pool: ["Texas", "Nevada", "Oregon", "Florida", "Georgia", "Ohio", "Alaska"],
    intruders: ["Toronto", "Lima", "Seoul"]
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
  },
  {
    description: "Multiples of 3",
    correctPool: ["3", "6", "9", "12", "15", "18", "21"],
    intruderPool: ["10", "14", "22"]
  },
  {
    description: "Perfect squares",
    correctPool: ["1", "4", "9", "16", "25", "36", "49"],
    intruderPool: ["18", "20", "27"]
  },
  {
    description: "All capitalized colors",
    correctPool: ["Amber", "Azure", "Coral", "Ivory", "Olive", "Sienna", "Teal"],
    intruderPool: ["Cabin", "River", "Cloud"]
  },
  {
    description: "Words with double letters",
    correctPool: ["Letter", "Coffee", "Balloon", "Address", "Ribbon", "Muffin", "Kettle"],
    intruderPool: ["Garden", "Planet", "Winter"]
  },
  {
    description: "Months with 31 days",
    correctPool: ["January", "March", "May", "July", "August", "October", "December"],
    intruderPool: ["April", "June", "September"]
  },
  {
    description: "Words that start with ST",
    correctPool: ["Stone", "Starlit", "Stanza", "Stitch", "Studio", "Stream", "Sturdy"],
    intruderPool: ["Silver", "Shimmer", "Signal"]
  }
];
