'use server';

import { openai } from '@/src/lib/ai-client';
import { chargeCredits } from '@/src/lib/billing';
import { executeCode } from "@/src/lib/code-executor";
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

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

// Add this to your existing actions.ts file
export async function awardTaskPoints(difficulty: "easy" | "medium" | "hard") {
    // 1. Set the reward logic
    const pointsMap = {
        easy: 10,
        medium: 25,
        hard: 50
    };
    const pointsToAward = pointsMap[difficulty];

    // 2. Initialize Supabase (Server-side)
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    // 3. Award the points securely
    const { error } = await supabase.rpc('add_user_points', {
        gained_points: pointsToAward
    });

    if (error) {
        return { success: false, error: "Failed to award points." };
    }

    return { success: true, awarded: pointsToAward };
}

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
                    content: "You are a senior coding mentor creating programming tasks. Return ONLY valid JSON."
                },
                {
                    role: "user",
                    content: [
                        taskLine,
                        "",
                        'Return JSON: {"challenge": string, "requirements": string[], "hints": { "title": string, "description": string }[], "estimatedTime": number, "entryFunction": string, "starterCode": string, "referenceSolution": string, "testInputs": string[], "testRunnerCode": string }',
                        "",
                        "Constraints:",
                        "- Use ONLY standard language features. No third-party libraries.",
                        "- The task must be solvable with a single pure function.",
                        '- requirements: 2-4 items, each "Label: value", no bullets.',
                        "- hints: EXACTLY 3 items; short title + description.",
                        "- estimatedTime: integer minutes (10 to 60).",
                        "",
                        "Grading fields (CRITICAL):",
                        `- entryFunction: The exact function name (e.g., "sumEvenNumbers").`,
                        `- starterCode: The function signature with a placeholder body.`,
                        `- referenceSolution: A complete, correct implementation of entryFunction only (no extra helpers that change the public API). Must compile and run.`,
                        `- testInputs: EXACTLY 3 to 5 items. Each item is a JSON-encoded arguments payload as a string (e.g. "[1, 2, 3]" for one array arg, or "[1, 2]" for two numeric args). Must match how entryFunction is called in testRunnerCode.`,
                        `- testRunnerCode: This is crucial. Provide a COMPLETE, runnable script in ${language}. It MUST include the correct reference implementation of entryFunction. Below the function, write exactly 3 to 5 test calls. For EACH test call, you must print/log exactly this format to standard output:`,
                        `___TEST_CASE___<stringified_input>___<stringified_output>`,
                        `CRITICAL RULE: Both <stringified_input> and <stringified_output> MUST be strictly valid JSON (use json.dumps in Python, JSON.stringify in JS). Do NOT use language-specific string representations like Python's default single-quoted lists.`,
                        "Example for Python:",
                        'import json',
                        'print(f"___TEST_CASE___[1, 2, 3]___{json.dumps(sum_even([1, 2, 3]))}")',
                        "Example for JavaScript:",
                        'console.log(`___TEST_CASE___[1, 2, 3]___${JSON.stringify(sumEven([1, 2, 3]))}`);',
                        "Example for Rust:",
                        '// Output strict JSON. Use double quotes for strings.',
                        'println!("___TEST_CASE___[1, 2, 3]___[\\"ACTIVE\\", \\"OFF\\"]");',
                        "Do NOT print anything else. Just the test cases.",
                        "",
                        "All grading fields are mandatory. testInputs must align with the ___TEST_CASE___ lines in testRunnerCode.",
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

        const testRunnerCodeRaw = (parsed as any)?.testRunnerCode;
        const testRunnerCode =
            typeof testRunnerCodeRaw === "string" && testRunnerCodeRaw.trim().length > 0
                ? testRunnerCodeRaw
                : undefined;

        const referenceSolutionRaw = (parsed as any)?.referenceSolution;
        const referenceSolution =
            typeof referenceSolutionRaw === "string" && referenceSolutionRaw.trim().length > 0
                ? referenceSolutionRaw
                : undefined;

        const testInputs = normalizeTestInputs((parsed as any)?.testInputs);

        let testCases = await buildTestCases({
            testRunnerCode,
            referenceSolution,
            testInputs,
            entryFunction,
            language,
        });

        if (testCases.length === 0 && entryFunction && challenge) {
            const repaired = await repairTestGradingFields({
                model: billing.modelToUse,
                language,
                challenge,
                entryFunction,
                starterCode,
            });
            if (repaired) {
                testCases = await buildTestCases({
                    testRunnerCode: repaired.testRunnerCode,
                    referenceSolution: repaired.referenceSolution,
                    testInputs: repaired.testInputs,
                    entryFunction,
                    language,
                });
            }
        }

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

async function buildTestCases({
    testRunnerCode,
    referenceSolution,
    testInputs,
    entryFunction,
    language,
}: {
    testRunnerCode: string | undefined;
    referenceSolution: string | undefined;
    testInputs: string[];
    entryFunction: string | undefined;
    language: SupportedLanguage;
}): Promise<{ input: string; output: string }[]> {
    const fromRunner = await parseTestRunnerOutput(testRunnerCode, language);
    if (fromRunner.length >= 3) return fromRunner.slice(0, 5);

    const fromReference = await buildCasesFromReference({
        referenceSolution,
        testInputs,
        entryFunction,
        language,
    });
    if (fromReference.length >= 3) return fromReference.slice(0, 5);

    // Prefer any partial results rather than returning nothing.
    if (fromRunner.length > 0) return fromRunner;
    if (fromReference.length > 0) return fromReference;

    return [];
}

function normalizeTestInputs(raw: unknown): string[] {
    if (!Array.isArray(raw)) return [];
    const out: string[] = [];
    for (const item of raw) {
        if (typeof item === "string") {
            const trimmed = item.trim();
            if (trimmed) out.push(trimmed);
            continue;
        }
        try {
            out.push(JSON.stringify(item));
        } catch {
            // skip non-serializable values
        }
    }
    return out.slice(0, 5);
}

function parseTestCaseLine(line: string): { input: string; output: string } | null {
    const marker = "___TEST_CASE___";
    const idx = line.indexOf(marker);
    if (idx === -1) return null;

    const rest = line.slice(idx + marker.length);
    const sep = rest.indexOf("___");
    if (sep === -1) return null;

    const input = rest.slice(0, sep).trim();
    const output = rest.slice(sep + 3).trim();
    if (!input || !output) return null;

    return { input, output };
}

function extractCasesFromRunnerSource(code: string): { input: string; output: string }[] {
    const cases: { input: string; output: string }[] = [];
    const re = /___TEST_CASE___([\s\S]*?)___([\s\S]*?)(?=\)|;|$|\n)/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(code)) !== null) {
        const input = match[1].trim();
        const output = match[2].trim();
        if (input && output) cases.push({ input, output });
    }
    return cases.slice(0, 5);
}

async function parseTestRunnerOutput(
    testRunnerCode: string | undefined,
    language: SupportedLanguage,
): Promise<{ input: string; output: string }[]> {
    if (!testRunnerCode) return [];

    const rawOutput = await executeCode(testRunnerCode, language);
    const looksLikeFailure =
        rawOutput.startsWith("Error:") ||
        rawOutput.startsWith("Compilation Error:") ||
        rawOutput.startsWith("Error\n");

    if (looksLikeFailure) {
        return extractCasesFromRunnerSource(testRunnerCode);
    }

    const cases: { input: string; output: string }[] = [];
    for (const line of rawOutput.split("\n")) {
        const parsed = parseTestCaseLine(line);
        if (parsed) cases.push(parsed);
    }

    if (cases.length > 0) return cases;

    // Execution succeeded but sentinel lines missing — scrape literals from source.
    return extractCasesFromRunnerSource(testRunnerCode);
}

async function buildCasesFromReference({
    referenceSolution,
    testInputs,
    entryFunction,
    language,
}: {
    referenceSolution: string | undefined;
    testInputs: string[];
    entryFunction: string | undefined;
    language: SupportedLanguage;
}): Promise<{ input: string; output: string }[]> {
    if (!referenceSolution?.trim() || testInputs.length === 0 || !entryFunction) return [];
    if (language === "rust") return [];

    const derived = await deriveExpectedOutputs(
        referenceSolution,
        language,
        entryFunction,
        testInputs,
    );

    const cases: { input: string; output: string }[] = [];
    for (let i = 0; i < testInputs.length; i++) {
        const row = derived[i];
        if (row?.ok) cases.push({ input: testInputs[i], output: row.output });
    }
    return cases;
}

type RepairedGradingFields = {
    referenceSolution?: string;
    testInputs: string[];
    testRunnerCode?: string;
};

async function repairTestGradingFields({
    model,
    language,
    challenge,
    entryFunction,
    starterCode,
}: {
    model: string;
    language: SupportedLanguage;
    challenge: string;
    entryFunction: string;
    starterCode: string | undefined;
}): Promise<RepairedGradingFields | null> {
    try {
        const response = await openai.chat.completions.create({
            model,
            response_format: { type: "json_object" },
            temperature: 0.1,
            max_tokens: 2500,
            messages: [
                {
                    role: "system",
                    content:
                        "You generate grading artifacts for an existing coding challenge. Return ONLY valid JSON.",
                },
                {
                    role: "user",
                    content: [
                        `Language: ${language}`,
                        `Task: ${challenge}`,
                        `entryFunction: ${entryFunction}`,
                        starterCode ? `starterCode:\n${starterCode}` : "",
                        "",
                        'Return JSON: {"referenceSolution": string, "testInputs": string[], "testRunnerCode": string}',
                        "",
                        "Rules:",
                        "- referenceSolution: complete correct implementation of entryFunction.",
                        "- testInputs: 3-5 JSON-encoded argument payloads as strings.",
                        `- testRunnerCode: runnable ${language} script with referenceSolution plus exactly 3-5 lines printing ___TEST_CASE___<input>___<output> using strict JSON for both parts.`,
                        "- Use only standard library features.",
                    ]
                        .filter(Boolean)
                        .join("\n"),
                },
            ],
        });

        const raw = response.choices?.[0]?.message?.content ?? "";
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const testInputs = normalizeTestInputs(parsed.testInputs);
        const referenceSolution =
            typeof parsed.referenceSolution === "string" && parsed.referenceSolution.trim()
                ? parsed.referenceSolution
                : undefined;
        const testRunnerCode =
            typeof parsed.testRunnerCode === "string" && parsed.testRunnerCode.trim()
                ? parsed.testRunnerCode
                : undefined;

        if (!referenceSolution && !testRunnerCode) return null;
        if (testInputs.length === 0 && !testRunnerCode) return null;

        return { referenceSolution, testInputs, testRunnerCode };
    } catch (err) {
        console.error("repairTestGradingFields failed:", err);
        return null;
    }
}
