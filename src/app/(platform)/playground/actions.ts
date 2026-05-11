'use server';

import { openai } from '@/src/lib/ai-client';

export async function generateCodingChallenge({
    language = "javascript",
    difficulty = "easy",
    topic,
}: {
    language?: "javascript" | "python" | "rust";
    difficulty?: "easy" | "medium" | "hard";
    topic?: string;
} = {}) {
    try {
        const seed = crypto.randomUUID();

        // Treat empty / whitespace / sentinel values as "no topic chosen".
        const normalizedTopic = topic?.trim();
        const hasTopic =
            !!normalizedTopic &&
            normalizedTopic.toLowerCase() !== "any" &&
            normalizedTopic.toLowerCase() !== "random";

        const taskLine = hasTopic
            ? `Create a programming task in ${language} on the topic "${normalizedTopic}". Difficulty: ${difficulty}.`
            : `Create a self-contained programming task in ${language}. Difficulty: ${difficulty}. Pick a classic exercise category (algorithms, data manipulation, parsing, math, strings, arrays, recursion).`;

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
                        `Seed: ${seed} (use this to vary the specific task each call; do NOT use it to pick exotic topics)`,
                        taskLine,
                        "",
                        'Return JSON: {"challenge": string, "requirements": string[], "hints": { "title": string, "description": string }[], "estimatedTime": number, "testCases": { "input": string, "output": string }[], "entryFunction": string, "starterCode": string }',
                        "",
                        "Constraints:",
                        "- Use ONLY standard language features. No third-party libraries, no frameworks, no package imports of any kind.",
                        "- No UI, web, networking, file-I/O, or framework tasks.",
                        "- The task must be solvable with a single pure function the user writes in the editor.",
                        '- requirements: 2-4 items, each "Label: value", no bullets/numbering',
                        "- hints: EXACTLY 3 items; each has title + description; keep both short; no bullets/numbering",
                        "- difficulty guide: easy(simple loops/if), medium(edge cases/parsing), hard(efficient algorithm)",
                        "- estimatedTime: integer minutes; easy 10-20, medium 20-40, hard 40-60",
                        "",
                        "Grading fields (CRITICAL — these are used by an automated grader):",
                        `- entryFunction: the exact identifier name of the function the user must implement (e.g. "sumEvenNumbers"). camelCase for JavaScript/Rust, snake_case for Python.`,
                        `- starterCode: a ${language} snippet that defines ONLY the function signature using entryFunction as the name, with a placeholder body. Examples:`,
                        `    javascript: "function sumEvenNumbers(arr) {\\n  // Your code here\\n  return 0;\\n}"`,
                        `    python:     "def sum_even_numbers(arr):\\n    # Your code here\\n    return 0"`,
                        `    rust:       "fn sum_even_numbers(arr: &[i32]) -> i32 {\\n    // Your code here\\n    return 0;\\n}"`,
                        "- testCases: 3-5 items. BOTH input and output MUST be JSON-encoded strings the grader can JSON.parse:",
                        '    * "input"  must be a JSON array of positional arguments to entryFunction. e.g. "[[1,2,3,4]]" means call entryFunction([1,2,3,4]). For multi-arg: "[\\"hello\\", 3]" means entryFunction("hello", 3).',
                        '    * "output" must be the JSON-encoded expected return value. e.g. "6", "\\"banana\\"", "[1,2,3]", "true".',
                        "    * Do NOT include the function call syntax in input. Do NOT wrap output in extra quotes for numbers/booleans/arrays.",
                    ].join("\n"),
                },
            ],
            temperature: 0.7,
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
        const testCasesRaw = Array.isArray((parsed as any)?.testCases) ? (parsed as any).testCases : [];
        const testCases = testCasesRaw
            .map((t: any) => ({
                input: typeof t?.input === "string" ? t.input : String(t?.input ?? ""),
                output: typeof t?.output === "string" ? t.output : String(t?.output ?? ""),
            }))
            .filter((t: { input: string; output: string }) => t.input || t.output)
            .slice(0, 5);

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

        const requirements = requirementsRaw
            .map((r: unknown) => (typeof r === "string" ? r.trim() : ""))
            .map((r: string) => r.replace(/^[-*•\d.)\s]+/, "").trim())
            .filter(Boolean)
            .slice(0, 4);

        // Ensure we always return 2-4 requirements
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

        const difficultyFallbackTime: Record<typeof difficulty, number> = {
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