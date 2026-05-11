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
                        'Return JSON: {"challenge": string, "requirements": string[], "hints": { "title": string, "description": string }[], "estimatedTime": number, "testCases": { "input": string, "output": string }[] }',
                        "",
                        "Constraints:",
                        "- Use ONLY standard language features. No third-party libraries, no frameworks, no package imports of any kind.",
                        "- No UI, web, networking, file-I/O, or framework tasks.",
                        "- The task must be solvable with a single pure function the user writes in the editor.",
                        '- requirements: 2-4 items, each "Label: value", no bullets/numbering',
                        "- hints: EXACTLY 3 items; each has title + description; keep both short; no bullets/numbering",
                        "- difficulty guide: easy(simple loops/if), medium(edge cases/parsing), hard(efficient algorithm)",
                        "- estimatedTime: integer minutes; easy 10-20, medium 20-40, hard 40-60",
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
        const testCasesRaw = (parsed as any)?.testCases;
        const testCases = testCasesRaw
            .map((t: any) => ({
                input: typeof t?.input === "string" ? t.input : String(t?.input ?? ""),
                output: typeof t?.output === "string" ? t.output : String(t?.output ?? ""),
            }))
            .filter((t: { input: string; output: string }) => t.input || t.output)
            .slice(0, 5);

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
        };
    } catch (error) {
        console.error('Error generating coding challenge:', error);
        return {
            success: false,
            error: 'Failed to fetch coding challenge',
        };
    }
}