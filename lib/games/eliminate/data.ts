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
  },
  {
    name: "Summer Olympics Host Cities",
    pool: ["Tokyo", "Rio", "London", "Beijing", "Athens", "Sydney", "Atlanta", "Barcelona"],
    intruders: ["Geneva", "Dubai", "Shanghai"]
  },
  {
    name: "Winter Olympics Host Cities",
    pool: ["Beijing", "PyeongChang", "Sochi", "Vancouver", "Turin", "Salt Lake City", "Nagano", "Lillehammer"],
    intruders: ["Dubai", "Toronto", "Shanghai"]
  },
  {
    name: "Olympic Figure Skating Gold Medalists",
    pool: ["Yuzuru Hanyu", "Nathan Chen", "Alexei Yagudin", "Kim Yuna", "Tara Lipinski", "Shizuka Arakawa", "Sarah Hughes"],
    intruders: ["Michelle Kwan", "Sasha Cohen", "Elene Gedevanishvili"]
  },
  {
    name: "Olympic Freestyle/Snow Sports Gold Medalists",
    pool: ["Eileen Gu", "Chloe Kim", "Kelly Clark", "Jamie Anderson", "Torah Bright"],
    intruders: ["Lindsey Vonn", "Mikaela Shiffrin", "Bode Miller"]
  },
  {
    name: "Grammy Album of the Year Winners",
    pool: ["Midnights", "Golden Hour", "25", "1989", "The Suburbs", "Rumours", "We Are"],
    intruders: ["Reputation", "Lover", "Born This Way"]
  },
  {
    name: "Academy Award Best Picture Winners",
    pool: ["Everything Everywhere All at Once", "CODA", "Nomadland", "Parasite", "Green Book", "The Shape of Water", "Moonlight", "Spotlight"],
    intruders: ["Marriage Story", "Joker", "Roma"]
  },
  {
    name: "Legendary Jazz Artists",
    pool: ["Miles Davis", "John Coltrane", "Thelonious Monk", "Charlie Parker", "Duke Ellington", "Billie Holiday", "Chet Baker"],
    intruders: ["Norah Jones", "Diana Krall", "Jamie Cullum"]
  },
  {
    name: "Acclaimed Arthouse Film Directors",
    pool: ["Stanley Kubrick", "Akira Kurosawa", "Wong Kar-wai", "Agnès Varda", "Federico Fellini", "Ingmar Bergman"],
    intruders: ["Steven Spielberg", "Christopher Nolan", "James Cameron"]
  },
  {
    name: "Legendary Fashion Designers",
    pool: ["Coco Chanel", "Yves Saint Laurent", "Christian Dior", "Cristóbal Balenciaga", "Gianni Versace", "Alexander McQueen", "Virgil Abloh"],
    intruders: ["Donatella Versace", "Karl Lagerfeld", "Marc Jacobs"]
  },
  {
    name: "Fashion Week Host Cities",
    pool: ["Paris", "Milan", "New York", "London", "Copenhagen", "Tokyo"],
    intruders: ["Berlin", "Barcelona", "Chicago"]
  },
  {
    name: "Michelin Three-Star Chefs",
    pool: ["Gordon Ramsay", "Alain Ducasse", "Thomas Keller", "Joël Robuchon", "Heston Blumenthal", "Pierre Gagnaire"],
    intruders: ["Jamie Oliver", "Nigella Lawson", "Bobby Flay"]
  },
  {
    name: "FIFA World Cup Host Nations",
    pool: ["Brazil", "Germany", "South Africa", "Russia", "Qatar", "Mexico", "Argentina", "Italy", "France"],
    intruders: ["Colombia", "Australia", "Portugal"]
  },
  {
    name: "Seven Wonders of the Ancient World",
    pool: ["Great Pyramid of Giza", "Colossus of Rhodes", "Lighthouse of Alexandria", "Mausoleum at Halicarnassus", "Temple of Artemis", "Statue of Zeus"],
    intruders: ["Parthenon", "Pantheon", "Colosseum"]
  },
  {
    name: "Countries Whose Flag Has Red",
    pool: ["Japan", "Canada", "Switzerland", "Turkey", "China", "Denmark", "United States"],
    intruders: ["Brazil", "Jamaica", "Ireland"]
  },
  {
    name: "UNESCO-Recognized Cuisines",
    pool: ["French Gastronomy", "Mexican Cuisine", "Mediterranean Diet", "Japanese Washoku", "Turkish Coffee Culture"],
    intruders: ["Italian Pizza", "Chinese Dim Sum", "Indian Curry"]
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
  },
  {
    description: "Summer Olympic years (1996–2020)",
    correctPool: ["1996", "2000", "2004", "2008", "2012", "2016", "2020"],
    intruderPool: ["1994", "1998", "2002"]
  },
  {
    description: "Palindromes",
    correctPool: ["Civic", "Radar", "Level", "Madam", "Refer", "Kayak", "Noon"],
    intruderPool: ["Civil", "River", "Lever"]
  },
  {
    description: "Countries that drive on the left",
    correctPool: ["Japan", "India", "Australia", "United Kingdom", "New Zealand", "South Africa", "Ireland"],
    intruderPool: ["France", "Germany", "China"]
  },
  {
    description: "Words that are also musical terms",
    correctPool: ["Rest", "Scale", "Bridge", "Bar", "Sharp", "Flat", "Key"],
    intruderPool: ["Pizzicato", "Tremolo", "Fortissimo"]
  },
  {
    description: "NATO phonetic alphabet words",
    correctPool: ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf"],
    intruderPool: ["Able", "Baker", "Cast"]
  }
];
