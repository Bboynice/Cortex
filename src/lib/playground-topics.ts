export const PLAYGROUND_TOPICS = [
  { value: "random", label: "Random" },
  { value: "arrays", label: "Arrays" },
  { value: "strings", label: "Strings" },
  { value: "hash-maps", label: "Hash Maps" },
  { value: "linked-lists", label: "Linked Lists" },
  { value: "stacks-queues", label: "Stacks & Queues" },
  { value: "trees", label: "Trees" },
  { value: "binary-trees", label: "Binary Trees" },
  { value: "graphs", label: "Graphs" },
  { value: "heaps", label: "Heaps" },
  { value: "sorting", label: "Sorting" },
  { value: "searching", label: "Searching" },
  { value: "binary-search", label: "Binary Search" },
  { value: "two-pointers", label: "Two Pointers" },
  { value: "sliding-window", label: "Sliding Window" },
  { value: "recursion", label: "Recursion" },
  { value: "dynamic-programming", label: "Dynamic Programming" },
  { value: "greedy", label: "Greedy" },
  { value: "backtracking", label: "Backtracking" },
  { value: "divide-and-conquer", label: "Divide & Conquer" },
  { value: "bit-manipulation", label: "Bit Manipulation" },
  { value: "math", label: "Math" },
  { value: "geometry", label: "Geometry" },
  { value: "simulation", label: "Simulation" },
  { value: "design-patterns", label: "Design Patterns" },
  { value: "classes-oop", label: "Classes & OOP" },
  { value: "parsing", label: "Parsing & Regex" },
  { value: "file-io", label: "File I/O" },
  { value: "async-concurrency", label: "Async & Concurrency" },
  { value: "system-design", label: "System Design" },
] as const;

export type PlaygroundTopic = (typeof PLAYGROUND_TOPICS)[number]["value"];

export function topicToPrompt(topic: PlaygroundTopic): string | undefined {
  if (topic === "random") return undefined;
  const label = PLAYGROUND_TOPICS.find((t) => t.value === topic)?.label;
  if (!label) return undefined;
  return [
    `Category: ${label}.`,
    "Invent one specific, self-contained problem in this category.",
    "It must be solvable with a single pure function (no classes, no I/O, no async).",
    "Arguments and return value must be JSON-serializable (arrays, strings, numbers, booleans, plain objects).",
    "Include clear edge cases in your test inputs.",
  ].join(" ");
}
