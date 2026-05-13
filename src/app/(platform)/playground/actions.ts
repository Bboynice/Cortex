'use server';

import { openai } from '@/src/lib/ai-client';
import {
    deriveExpectedOutputs,
    resolveEntry,
    type SupportedLanguage,
} from '@/src/lib/test-runner';

type Difficulty = "easy" | "medium" | "hard";

// Curated, language-agnostic topic banks. We pick one server-side instead of
// asking the model to "vary the topic" — LLMs are bad at that and default to
// the most common task in their training data (hence the endless vowel
// counters). Big enough that repeats within a session are rare.
const TOPIC_BANK: Record<Difficulty, string[]> = {
    easy: [
        "reverse a string in place",
        "sum the digits of an integer",
        "count how many times a character appears in a string",
        "find the largest number in an array",
        "find the smallest number in an array",
        "check if a number is prime",
        "compute the nth Fibonacci number",
        "compute the factorial of a non-negative integer",
        "check if a year is a leap year",
        "convert Celsius to Fahrenheit",
        "convert Fahrenheit to Celsius",
        "count the number of words in a sentence",
        "capitalize the first letter of each word (title case)",
        "swap the case of every letter in a string",
        "remove all whitespace from a string",
        "count uppercase letters in a string",
        "compute the average of an array of numbers",
        "return the second-largest element of an array",
        "check if two strings differ by exactly one character",
        "count even numbers in an array",
        "count odd numbers in an array",
        "compute the greatest common divisor of two integers",
        "compute the least common multiple of two integers",
        "check if a string contains only digits",
        "double every element of an array",
        "find the longest word in a sentence",
        "compute the sum of multiples of 3 or 5 below N",
        "convert a number to its binary string representation",
        "compute the Hamming distance between two equal-length strings",
        "remove duplicate elements from an array preserving order",
    ],
    medium: [
        "rotate an array to the right by k positions",
        "find the first non-repeating character in a string",
        "merge two sorted arrays into a single sorted array",
        "check if two strings are anagrams",
        "group anagrams from a list of strings",
        "find the longest common prefix of an array of strings",
        "compress a string with run-length encoding",
        "decompress a run-length encoded string",
        "convert a roman numeral to an integer",
        "convert an integer to a roman numeral",
        "find the majority element of an array (appears > n/2 times)",
        "find all pairs in an array that sum to a target",
        "compute the moving average of an array with window size k",
        "validate a string of balanced brackets",
        "evaluate a simple arithmetic expression with + - * /",
        "find the kth largest element of an array",
        "flatten a deeply nested array of integers",
        "implement a simple version of String.prototype.split",
        "find the longest substring without repeating characters",
        "spiral-order traversal of a 2D matrix",
        "rotate a 2D matrix 90 degrees clockwise in place",
        "find all prime factors of an integer",
        "implement binary search on a sorted array",
        "given a list of intervals, merge overlapping ones",
        "count the number of islands in a 2D grid (BFS or DFS)",
        "find the longest sequence of consecutive integers in an unsorted array",
    ],
    hard: [
        "find the length of the longest increasing subsequence",
        "compute the edit distance between two strings (Levenshtein)",
        "solve the coin change problem (minimum coins to make amount)",
        "solve the 0/1 knapsack problem",
        "find the longest palindromic substring",
        "implement a simple regular expression matcher supporting . and *",
        "implement an LRU cache as a single function operating on a state object",
        "find the median of two sorted arrays in O(log(min(n, m)))",
        "find the maximum sum of any contiguous subarray (Kadane's)",
        "topological sort of a DAG given as an edge list",
        "shortest path in an unweighted graph (BFS)",
        "detect a cycle in a directed graph",
        "compute the number of distinct ways to climb stairs with variable step sizes",
        "given a sorted matrix, find the kth smallest element",
        "longest common subsequence of two strings",
        "word break: can a string be segmented into dictionary words",
        "Dutch national flag problem (sort an array of 0s, 1s, 2s in one pass)",
        "find all subsets that sum to a target",
        "schedule meetings into the minimum number of rooms",
        "minimum window substring containing all characters of a target string",
    ],
};

function pickRandomTopic(difficulty: Difficulty): string {
    const bank = TOPIC_BANK[difficulty];
    return bank[Math.floor(Math.random() * bank.length)];
}

export async function generateCodingChallenge({
    language = "javascript",
    difficulty = "easy",
    topic,
}: {
    language?: SupportedLanguage;
    difficulty?: Difficulty;
    topic?: string;
} = {}) {
    try {
        // Treat empty / whitespace / sentinel values as "no topic chosen".
        const normalizedTopic = topic?.trim();
        const hasUserTopic =
            !!normalizedTopic &&
            normalizedTopic.toLowerCase() !== "any" &&
            normalizedTopic.toLowerCase() !== "random";

        // If the caller didn't specify a topic, pick one from the bank so the
        // model isn't free to fall back to its favourite (vowel counter etc).
        const effectiveTopic = hasUserTopic ? normalizedTopic! : pickRandomTopic(difficulty);

        const taskLine = `Create a programming task in ${language} about: "${effectiveTopic}". Difficulty: ${difficulty}. The task should clearly require solving this specific problem — do NOT substitute a different topic just because it is more common.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: { type: "json_object" },
            messages: [
                {
                    role: 'system',
                    content:
                        "You are a coding mentor. Return ONLY valid JSON (no markdown, no backticks).",
                },
                {
                    role: "user",
                    content: [
                        taskLine,
                        "",
                        'Return JSON: {"challenge": string, "requirements": string[], "hints": { "title": string, "description": string }[], "estimatedTime": number, "testInputs": string[], "entryFunction": string, "starterCode": string, "referenceSolution": string }',
                        "",
                        "Constraints:",
                        "- Use ONLY standard language features. No third-party libraries, no frameworks, no package imports of any kind.",
                        "- No UI, web, networking, file-I/O, or framework tasks.",
                        "- The task must be solvable with a single pure function the user writes in the editor.",
                        '- requirements: 2-4 items, each "Label: value", no bullets/numbering',
                        "- hints: EXACTLY 3 items; each has title + description; keep both short; no bullets/numbering",
                        "- difficulty guide: easy(simple loops/if), medium(edge cases/parsing), hard(efficient algorithm)",
                        "- estimatedTime: integer minutes; easy 10-20, medium 20-40, hard 40-60",
                        "- Stick exactly to the topic above. Do NOT replace it with FizzBuzz, vowel counting, palindrome checking, or plain-string-reversal unless the topic literally asks for one of those.",
                        "",
                        "Grading fields (CRITICAL — read carefully):",
                        `- entryFunction: the exact identifier name of the function the user must implement (e.g. "sumEvenNumbers"). camelCase for JavaScript/Rust, snake_case for Python. The same name MUST be used in starterCode and referenceSolution.`,
                        `- starterCode: a ${language} snippet that defines ONLY the function signature using entryFunction as the name, with a placeholder body. Examples:`,
                        `    javascript: "function sumEvenNumbers(arr) {\\n  // Your code here\\n  return 0;\\n}"`,
                        `    python:     "def sum_even_numbers(arr):\\n    # Your code here\\n    return 0"`,
                        `    rust:       "fn sum_even_numbers(arr: &[i32]) -> i32 {\\n    // Your code here\\n    return 0;\\n}"`,
                        "- referenceSolution: a COMPLETE, CORRECT implementation of entryFunction in the same language. It MUST run as-is and produce correct outputs for every input in testInputs. Use only standard-library features. Do not include test calls, prints, or main(). Define the function at module/top level.",
                        "- testInputs: 3-5 items. Each item is a JSON-encoded string representing the positional arguments to entryFunction:",
                        '    * A JSON array of positional arguments. e.g. "[[1,2,3,4]]" means call entryFunction([1,2,3,4]). For multi-arg: "[\\"hello\\", 3]" means entryFunction("hello", 3).',
                        "    * Do NOT include the function call syntax. Do NOT compute or include expected outputs anywhere — the grader will derive them by executing referenceSolution.",
                        "    * Cover diverse, meaningful cases (typical, edge, boundary).",
                    ].join("\n"),
                },
            ],
            temperature: 0.9,
        });

        const raw = response.choices?.[0]?.message?.content ?? "";
        const parsed = JSON.parse(raw) as unknown;
        const challenge =
            typeof (parsed as any)?.challenge === "string"
                ? (parsed as any).challenge.trim()
                : "";
        const requirementsRaw = Array.isArray((parsed as any)?.requirements)
            ? (parsed as any).requirements
            : [];
        const hintsRaw = Array.isArray((parsed as any)?.hints) ? (parsed as any).hints : [];
        const estimatedTimeRaw = (parsed as any)?.estimatedTime;

        const entryFunctionRaw = (parsed as any)?.entryFunction;
        const entryFunction =
            typeof entryFunctionRaw === "string" && /^[A-Za-z_][\w]*$/.test(entryFunctionRaw.trim())
                ? entryFunctionRaw.trim()
                : undefined;

        const starterCodeRaw = (parsed as any)?.starterCode;
        const starterCode =
            typeof starterCodeRaw === "string" && starterCodeRaw.trim().length > 0
                ? starterCodeRaw
                : undefined;

        const referenceSolutionRaw = (parsed as any)?.referenceSolution;
        const referenceSolution =
            typeof referenceSolutionRaw === "string" && referenceSolutionRaw.trim().length > 0
                ? referenceSolutionRaw
                : undefined;

        // testInputs comes back as an array of JSON-encoded strings. Anything
        // that isn't already a string we coerce via JSON.stringify so it still
        // round-trips through the reference harness.
        const testInputsRaw = Array.isArray((parsed as any)?.testInputs)
            ? (parsed as any).testInputs
            : [];
        const testInputs: string[] = testInputsRaw
            .map((v: unknown) => (typeof v === "string" ? v : JSON.stringify(v)))
            .filter((s: string) => typeof s === "string" && s.length > 0)
            .slice(0, 5);

        // Derive expected outputs by *executing* the reference solution. This
        // is the whole point of the rewrite — the AI is bad at computing
        // outputs, but it's fine at writing the function that produces them.
        const testCases = await buildTestCases({
            referenceSolution,
            language,
            entryFunction,
            testInputs,
        });

        const requirements = requirementsRaw
            .map((r: unknown) => (typeof r === "string" ? r.trim() : ""))
            .map((r: string) => r.replace(/^[-*•\d.)\s]+/, "").trim())
            .filter(Boolean)
            .slice(0, 4);

        const normalizedRequirements =
            requirements.length >= 2
                ? requirements
                : [
                      "Goal: implement the challenge in the chosen language",
                      "Handle: edge cases and invalid inputs",
                  ];

        const hints = hintsRaw
            .map((h: any) => ({
                title: typeof h?.title === "string" ? h.title.trim() : "",
                description: typeof h?.description === "string" ? h.description.trim() : "",
            }))
            .map((h: { title: string; description: string }) => ({
                title: h.title.replace(/^[-*•\d.)\s]+/, "").trim(),
                description: h.description.replace(/^[-*•\d.)\s]+/, "").trim(),
            }))
            .filter((h: { title: string; description: string }) => h.title && h.description)
            .slice(0, 3);

        const normalizedHints =
            hints.length === 3
                ? hints
                : [
                      { title: "Break it down", description: "Solve step-by-step with small helpers" },
                      { title: "Validate input", description: "Handle empty or invalid inputs safely" },
                      { title: "Test edges", description: "Try boundary cases before finishing" },
                  ];

        const difficultyFallbackTime: Record<Difficulty, number> = {
            easy: 15,
            medium: 30,
            hard: 50,
        };
        const estimatedTime =
            typeof estimatedTimeRaw === "number" && Number.isFinite(estimatedTimeRaw)
                ? Math.round(estimatedTimeRaw)
                : difficultyFallbackTime[difficulty];

        return {
            success: true,
            challenge: challenge || "No challenge found",
            requirements: normalizedRequirements,
            hints: normalizedHints,
            estimatedTime,
            testCases,
            entryFunction,
            starterCode,
        };
    } catch (error) {
        console.error('Error generating coding challenge:', error);
        return {
            success: false,
            error: 'Failed to fetch coding challenge',
        };
    }
}

// Given the AI's reference solution and a list of input strings, executes the
// reference solution against each input and returns {input, output} pairs
// where output is the *real* return value. Inputs that error out are dropped.
// If nothing usable comes back we return an empty list — the caller / UI will
// surface that as "no test cases", which is better than showing lies.
async function buildTestCases({
    referenceSolution,
    language,
    entryFunction,
    testInputs,
}: {
    referenceSolution: string | undefined;
    language: SupportedLanguage;
    entryFunction: string | undefined;
    testInputs: string[];
}): Promise<{ input: string; output: string }[]> {
    if (!referenceSolution || testInputs.length === 0) return [];

    // Rust reference execution isn't wired up yet (same reason grading isn't).
    // Skip silently so the user still gets a challenge + starter; they can run
    // their own code but won't see meaningful test cases for Rust until then.
    if (language === "rust") return [];

    // Find the actual callable in the reference solution. Prefer the AI's
    // claimed entryFunction, fall back to whatever function the regex finds.
    const entry = resolveEntry(referenceSolution, language, entryFunction);
    if (!entry) return [];

    const derived = await deriveExpectedOutputs(
        referenceSolution,
        language,
        entry,
        testInputs,
    );

    const cases: { input: string; output: string }[] = [];
    for (let i = 0; i < testInputs.length; i++) {
        const d = derived[i];
        if (d?.ok) {
            cases.push({ input: testInputs[i], output: d.output });
        } else if (d) {
            // Log so we can spot bad reference solutions in server logs; the
            // case itself is silently dropped from the user-facing list.
            console.warn(
                `[generateCodingChallenge] reference solution failed for input ${i}: ${d.error}`,
            );
        }
    }
    return cases;
}
