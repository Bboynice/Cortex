'use server';

import { openai } from '@/src/lib/ai-client';
import { chargeCredits } from '@/src/lib/billing';
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
        // --- INDUSTRIAL UTILITIES ---
        "calculate the 'Thermal Efficiency' (percentage) from an array of heat readings",
        "mask sensitive characters in a system log leaving only the first and last",
        "generate a unique 'Session ID' by combining a timestamp and a random hex",
        "extract all 'ERROR' tags from a raw system output string",
        "format a raw byte count into a human-readable string (KB, MB, GB)",
        "validate if a 'Hardware Version' string (e.g., v1.2) follows the correct format",
        "sanitize a user-provided 'Alias' by removing all non-alphanumeric characters",
        "calculate the 'Uptime Ratio' from an array of boolean power states",
        "detect a 'Data Spike': find if any value in a sequence is > 50% of the previous",
        "truncate a log entry to 100 characters and append an industrial '...' marker",
        "find the 'Coldest Node' (minimum value) in a telemetry data set",
        "check if a string of characters contains any forbidden 'Restricted Symbols'",
        "count how many 'Critical Failures' exist in a nested object of status reports",
        "map an array of raw status codes (0, 1, 2) to ('OFF', 'STANDBY', 'ACTIVE')",
        "calculate the 'Mean Latency' from an array of millisecond response times",
        "check if a provided 'Access Key' meets the 8-character minimum length",
        "generate a 'System Slug' (lowercase-hyphenated) from a mission title",
        "find the most frequent 'Event Category' in a flat list of logs",
        "compute the 'Checksum' of a string by summing the ASCII values of its characters",
        "verify if a list of 'Packet IDs' is strictly increasing (no gaps)",
        "remove duplicate 'IP Addresses' from a list while maintaining the original order",
        "calculate the 'Load Balance' (difference between highest and lowest value)",
        "detect 'Silent Drops': find index where a value is null in a data stream",
        "count the number of 'Active Modules' in a status bitmask string (1s and 0s)",
        "format a number as a 'Core Percentage' with exactly two decimal places",
        "extract the 'Domain' from a raw server connection string",
        "find the 'Peak Load' (maximum value) in a 24-hour telemetry array",
        "swap the 'High' and 'Low' values in an array of two-element clusters",
        "calculate the total 'Processing Time' by summing an array of durations",
        "check if a 'Command String' starts and ends with the required brackets '[ ]'",
    ],
    medium: [
        // --- SYSTEMS ARCHITECTURE & CLASSES ---
        "implement a 'CortexCache' class with basic Get/Set and a 10-item limit",
        "build a 'TaskQueue' class that processes items in First-In-First-Out (FIFO) order",
        "create a 'StateTracker' that records a history of 5 changes and allows 'Undo'",
        "transform a flat list of 'Folder Paths' into a nested 'Directory Tree' object",
        "implement a 'LogFilter' that handles multiple criteria (Level, Date, Module)",
        "build a 'RateLimiter' function that returns false if called > 5 times per second",
        "develop a 'ValidationEngine' that checks an object against a simple schema",
        "create a 'DataDiff' utility that returns only the changed values between two objects",
        "implement a 'WeightedRandom' selector for AI personality traits",
        "build a 'SearchIndex' that maps words in a document to their line numbers",
        "implement a 'VersionComparator' for complex semantic versions (e.g., 1.2.10 vs 1.10.2)",
        "create a 'CircuitBreaker' class that disables a function after 3 consecutive errors",
        "transform a 'CSV' data string into a clean Array of typed Objects",
        "calculate the 'Moving Average' of a telemetry stream with a window of N",
        "implement a 'TokenMasker' that redacts specific keywords from a large text block",
        "find the 'Deepest Level' of a nested JSON configuration object",
        "group a list of 'System Alerts' by their severity and count the occurrences",
        "build a 'TemplateEngine' that replaces {{variables}} in a string with object data",
        "implement a 'Dependency Check': ensure all 'Required IDs' exist in a 'Provided' list",
        "create a 'ColorConverter' between HEX, RGB, and HSL formats",
        "detect 'Pattern Drifts': find if a sequence of values significantly deviates from a mean",
        "implement a 'PaginationLogic' generator (total, current, next, previous pages)",
        "build an 'EventBus' class that allows basic Emit and Listen functionality",
        "calculate the 'Intersection' of two massive sets of server logs",
        "implement a 'BinarySearch' to find a target 'Timestamp' in a sorted array",
        "flatten a 'Deeply Nested' array into a single level without using .flat()",
        "find the 'First Non-Repeating' character in a long stream of hex data",
        "build a 'Breadcrumb' string from a nested object path (e.g., 'sys/core/power')",
        "implement a 'DeepClone' function that creates a fresh copy of a nested object",
        "calculate 'Overlap' between two scheduled maintenance intervals",
    ],
    hard: [
        // --- COMPLEX ENGINEERING & ALGORITHMS ---
        "detect a 'Circular Dependency' in a module graph (Cycle Detection)",
        "implement a 'Virtual DOM' diff algorithm to identify changes between two trees",
        "build a 'PriorityScheduler' that executes tasks based on weight and arrival time",
        "solve the 'Optimal Resource Allocation' problem (0/1 Knapsack logic)",
        "implement a 'Pathfinder' (BFS) to find the shortest route through a grid of nodes",
        "create a 'JSON-to-Typescript' interface generator from a raw sample object",
        "build a 'Self-Healing' data sequence that corrects single-bit errors",
        "implement a 'Tokenizer' and 'Parser' for a simple math-based query language",
        "solve the 'LRU Cache' problem using a Map and a Doubly Linked List logic",
        "implement 'ReactiveSignals': a simple system where variables auto-update on change",
        "detect 'Stress Fractures': find the largest contiguous subarray sum (Kadane’s)",
        "reconstruct a 'Fragmented Stream' by reordering packets by ID and offset",
        "implement a 'Markdown' parser for headers, bold text, and code blocks",
        "build a 'Trie' (Prefix Tree) to provide ultra-fast autocomplete for 1000+ commands",
        "find the 'Median' of two large sorted telemetry arrays in logarithmic time",
        "solve the 'WordBreak' challenge: can a string be split into a valid command sequence?",
        "implement a 'Token Bucket' algorithm for high-concurrency traffic shaping",
        "build a 'Dependency Resolver' that outputs a valid 'Boot Order' for system modules",
        "calculate the 'Edit Distance' (Levenshtein) between two legacy configurations",
        "implement a 'Min-Heap' to track the 5 lowest-latency servers in real-time",
        "solve the 'Matrix Rotation' problem for a 2D grid of pixel data (90 degrees)",
        "implement an 'Abstract Syntax Tree' (AST) walker for a custom JSON-based logic",
        "build a 'BigInt' addition and subtraction utility for strings of 50+ digits",
        "solve the 'N-Queens' logic for positioning AI sensors on a grid with no overlap",
        "implement a 'Huffman Coding' compression algorithm for a technical text block",
        "find the 'Longest Common Subsequence' between two different system logs",
        "build a 'State Machine' that transition between (Idle, Loading, Error, Success)",
        "implement a 'Debounce' and 'Throttle' utility from scratch",
        "solve the 'Sudoku Solver' logic for a 9x9 diagnostic grid",
        "implement a 'Custom Sort' that orders logs by Severity, then Timestamp, then ID",
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
        const costMap = { easy: 10, medium: 15, hard: 25 };
        const baseCost = costMap[difficulty];
    
        // 2. Charge the user
        const billing = await chargeCredits(baseCost);
        if (!billing.success) {
            return { success: false, error: billing.error };
        }      

        const response = await openai.chat.completions.create({
            model: billing.modelToUse,
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
