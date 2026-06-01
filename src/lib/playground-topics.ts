export const PLAYGROUND_TOPICS = [
  { value: "random", label: "Random" },

  // --- CORE FUNDAMENTALS ---
  { value: "Control Flow & Conditionals", label: "Conditionals (If/Else)" },
  { value: "Loops & Iteration", label: "Loops & Iteration" },
  { value: "Number Theory & Math", label: "Number Theory & Math" },
  { value: "Bitwise Operations", label: "Bitwise Operations" },

  // --- STRINGS & PARSING ---
  { value: "String Manipulation", label: "String Manipulation" },
  { value: "Pattern Matching & Regex", label: "Pattern Matching" },
  { value: "Data Parsing (JSON/CSV)", label: "Data Parsing" },

  // --- DATA STRUCTURES (GRANULAR) ---
  { value: "1D Arrays & Lists", label: "Arrays / Lists (1D)" },
  { value: "2D Arrays & Matrices", label: "Matrices (2D Arrays)" },
  { value: "Hash Maps & Objects", label: "Hash Maps (Key-Value)" },
  { value: "Sets", label: "Sets (Unique Items)" },
  { value: "Stacks (LIFO)", label: "Stacks (LIFO)" },
  { value: "Queues (FIFO)", label: "Queues (FIFO)" },

  // --- ALGORITHMIC PATTERNS ---
  { value: "Sorting Algorithms", label: "Sorting Algorithms" },
  { value: "Binary Search", label: "Binary Search" },
  { value: "Two Pointers", label: "Two Pointers" },
  { value: "Sliding Window", label: "Sliding Window" },
  { value: "Recursion", label: "Recursion" },
  { value: "Dynamic Programming (1D)", label: "Dynamic Programming" },

  // --- SYSTEM DESIGN / LOGIC ---
  { value: "State Machines", label: "State Machines" },
  { value: "Date & Time Manipulation", label: "Date & Time" },
  { value: "Object-Oriented Basics", label: "Classes & Structs" },
] as const;

export type PlaygroundTopic = (typeof PLAYGROUND_TOPICS)[number]["value"];

export function topicToPrompt(topic: PlaygroundTopic): string | undefined {
  if (topic === "random") return undefined;
  const entry = PLAYGROUND_TOPICS.find((t) => t.value === topic);
  if (!entry) return undefined;
  return [
    `Category: ${entry.value}.`,
    "Invent one specific, self-contained problem in this category.",
    "It must be solvable with a single pure function (no classes, no I/O, no async).",
    "Arguments and return value must be JSON-serializable (arrays, strings, numbers, booleans, plain objects).",
    "Include clear edge cases in your test inputs.",
  ].join(" ");
}
