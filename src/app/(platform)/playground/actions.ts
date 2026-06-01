'use server';

import { openai } from '@/src/lib/ai-client';
import { chargeCredits } from '@/src/lib/billing';
import { executeCode } from "@/src/lib/code-executor";
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

import {
    deriveExpectedOutputs,
    resolveEntry,
    type SupportedLanguage,
} from '@/src/lib/test-runner';

// ==========================================
// 1. SECURE POINT AWARDER (Anti-Cheat RPC)
// ==========================================
export async function submitChallengeAction(challengeId: string, difficulty: string) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    // Call our secure RPC to check if solved, record it, and add points
    const { data, error } = await supabase.rpc('submit_and_award', {
        p_challenge_id: challengeId,
        p_difficulty: difficulty
    });

    // ✨ ADDED CONSOLE.ERROR SO YOU CAN SEE THE EXACT DATABASE BUG IN YOUR TERMINAL
    if (error) {
        console.error("🚨 DB SUBMISSION ERROR:", error);
        return { success: false, error: error.message };
    }
    
    return { success: true, ...data };
}

// ==========================================
// 2. THE AI FACTORY (Generate & Cache)
// ==========================================
export async function generateCodingChallenge({
    language = "javascript",
    difficulty = "easy",
    topic,
}: {
    language?: SupportedLanguage;
    difficulty?: "easy" | "medium" | "hard";
    topic?: string;
} = {}) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
            { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
        );

        const { data: { user } } = await supabase.auth.getUser();
        
        // Normalize the topic. Fallback to Arrays if empty or "random"
        const targetTopic = topic && topic.toLowerCase() !== "random" && topic.toLowerCase() !== "any" 
            ? topic.trim() 
            : "Arrays / Lists (1D)";

        // --- STEP A: CHECK THE CACHE ---
        if (user) {
            // 1. Get IDs of challenges this user has already passed
            const { data: solved } = await supabase
                .from('user_submissions')
                .select('challenge_id')
                .eq('user_id', user.id)
                .eq('status', 'passed');
            
            const solvedIds = solved?.map(s => s.challenge_id) || [];

            // 2. Look for a matching challenge NOT in their solved list
            let query = supabase
                .from('challenges')
                .select('*')
                .eq('language', language)
                .eq('difficulty', difficulty)
                .eq('topic', targetTopic);
            
            if (solvedIds.length > 0) {
                query = query.not('id', 'in', `(${solvedIds.join(',')})`);
            }

            const { data: existingChallenge } = await query.limit(1).maybeSingle();

            // 3. CACHE HIT! Return it instantly for 0 credits.
            if (existingChallenge) {
                return {
                    success: true,
                    challengeId: existingChallenge.id,
                    ...existingChallenge.content
                };
            }
        }

        // --- STEP B: CACHE MISS (Generate New) ---
        const costMap = { easy: 10, medium: 15, hard: 25 };
        const baseCost = costMap[difficulty];
    
        const billing = await chargeCredits(baseCost);
        if (!billing.success) {
            return { success: false, error: billing.error };
        }      

        // ✨ THE FIX: Get the last 15 tasks in this bucket to use as an exclusion list
        let exclusionPrompt = "";
        const { data: existingChallenges } = await supabase
            .from('challenges')
            .select('content')
            .eq('language', language)
            .eq('difficulty', difficulty)
            .eq('topic', targetTopic)
            .order('created_at', { ascending: false })
            .limit(15);

        if (existingChallenges && existingChallenges.length > 0) {
            // Extract just the challenge text to save AI tokens
            const existingDescriptions = existingChallenges
                .map(c => `- ${c.content?.challenge || 'Unknown'}`)
                .join("\n");
            
            exclusionPrompt = `
CRITICAL ANTI-DUPLICATION RULE:
Our platform already has the following tasks for this topic:
${existingDescriptions}

You MUST NOT re-skin or re-theme the logic from the tasks above. 
If the tasks above involve summing, counting, or finding a maximum, your task MUST require a completely different algorithmic mechanism (e.g., sorting, shifting, pattern matching, grouping, validating a sequence). 
Changing the nouns (e.g., from "Apples" to "Spaceships") is NOT acceptable. The underlying code structure required to solve this must be fundamentally unique.`;
        }

        const taskLine = `Create a programming task in ${language} about: "${targetTopic}". Difficulty: ${difficulty}. The task should clearly require solving this specific problem.`;

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
                        exclusionPrompt,
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
        const challenge = typeof (parsed as any)?.challenge === "string" ? (parsed as any).challenge.trim() : "";
        const requirementsRaw = Array.isArray((parsed as any)?.requirements) ? (parsed as any).requirements : [];
        const hintsRaw = Array.isArray((parsed as any)?.hints) ? (parsed as any).hints : [];
        const estimatedTimeRaw = (parsed as any)?.estimatedTime;
        const entryFunctionRaw = (parsed as any)?.entryFunction;
        const entryFunction = typeof entryFunctionRaw === "string" && /^[A-Za-z_][\w]*$/.test(entryFunctionRaw.trim()) ? entryFunctionRaw.trim() : undefined;
        const starterCodeRaw = (parsed as any)?.starterCode;
        const starterCode = typeof starterCodeRaw === "string" && starterCodeRaw.trim().length > 0 ? starterCodeRaw : undefined;
        const testRunnerCodeRaw = (parsed as any)?.testRunnerCode;
        const testRunnerCode = typeof testRunnerCodeRaw === "string" && testRunnerCodeRaw.trim().length > 0 ? testRunnerCodeRaw : undefined;
        const referenceSolutionRaw = (parsed as any)?.referenceSolution;
        const referenceSolution = typeof referenceSolutionRaw === "string" && referenceSolutionRaw.trim().length > 0 ? referenceSolutionRaw : undefined;
        const testInputs = normalizeTestInputs((parsed as any)?.testInputs);

        // Build robust test cases using your fallback utility methods
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

        const normalizedRequirements = requirements.length >= 2 ? requirements : [
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

        const normalizedHints = hints.length === 3 ? hints : [
            { title: "Break it down", description: "Solve step-by-step with small helpers" },
            { title: "Validate input", description: "Handle empty or invalid inputs safely" },
            { title: "Test edges", description: "Try boundary cases before finishing" },
        ];

        const difficultyFallbackTime: Record<string, number> = { easy: 15, medium: 30, hard: 50 };
        const estimatedTime = typeof estimatedTimeRaw === "number" && Number.isFinite(estimatedTimeRaw)
            ? Math.round(estimatedTimeRaw)
            : difficultyFallbackTime[difficulty] || 15;
        
        const newChallengeContent = {
            challenge: challenge || "No challenge found",
            requirements: normalizedRequirements,
            hints: normalizedHints,
            estimatedTime,
            testCases,
            entryFunction,
            starterCode,
        };

        // --- STEP C: SAVE TO LIBRARY ---
        if (user && testCases.length > 0) {
            
            // 🔒 SECURITY FIRST: Create an Admin client that bypasses RLS.
            // This ensures ONLY your secure Next.js server can write to the challenges table.
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY! 
            );

            const { data: inserted, error: insertError } = await supabaseAdmin
                .from('challenges')
                .insert({
                    language,
                    difficulty,
                    topic: targetTopic,
                    content: newChallengeContent
                })
                .select('id')
                .single();

            // Log any errors so you can see exactly why it fails in your terminal
            if (insertError) {
                console.error("🔒 ADMIN DB INSERT ERROR:", insertError.message);
            }

            if (inserted && !insertError) {
                return { success: true, challengeId: inserted.id, ...newChallengeContent };
            }
        } else if (testCases.length === 0) {
            console.warn("⚠️ Did not save to DB: AI failed to generate valid test cases.");
        }

        // Fallback if DB save fails
        return { success: true, challengeId: 'temp_id', ...newChallengeContent };

    } catch (error) {
        console.error('Error generating coding challenge:', error);
        return { success: false, error: 'Failed to fetch coding challenge' };
    }
}

// ==========================================
// 3. ROBUST TEST CASE UTILITIES
// ==========================================

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