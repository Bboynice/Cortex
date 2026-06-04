'use server';

import { openai } from '@/src/lib/ai-client';
import { chargeCredits } from '@/src/lib/billing';
import { executeCode } from "@/src/lib/code-executor";
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js'; // For Admin operations
import { revalidatePath } from 'next/cache'; // For cache busting

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
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // ✨ FIXED: Uses Anon Key
        { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    const { data, error } = await supabase.rpc('submit_and_award', {
        p_challenge_id: challengeId,
        p_difficulty: difficulty
    });

    if (error) {
        console.error("🚨 DB SUBMISSION ERROR:", error);
        return { success: false, error: error.message };
    }
    
    // ✨ CACHE BUSTER: Update dashboard instantly when points are won
    if (data?.points_awarded > 0) {
        revalidatePath('/dashboard', 'page');
        revalidatePath('/settings/profile', 'page');
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
    allSkippedChallengeIds,
}: {
    language?: SupportedLanguage;
    difficulty?: "easy" | "medium" | "hard";
    topic?: string;
    allSkippedChallengeIds?: string[];


} = {}) {
    try {
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // ✨ FIXED: Uses Anon Key
            { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
        );

        const { data: { user } } = await supabase.auth.getUser();
        
        const targetTopic = topic && topic.toLowerCase() !== "random" && topic.toLowerCase() !== "any" 
            ? topic.trim() 
            : "Arrays / Lists (1D)";

        // --- STEP A: CHECK THE CACHE ---
        if (user) {
            const { data: solved } = await supabase
                .from('user_submissions')
                .select('challenge_id')
                .eq('user_id', user.id)
                .eq('status', 'passed');
            
            const solvedIds = solved?.map(s => s.challenge_id) || [];

            let query = supabase
                .from('challenges')
                .select('*')
                .eq('language', language)
                .eq('difficulty', difficulty)
                .eq('topic', targetTopic);
            
            // ✨ THE BULLETPROOF EXCLUSION LOOP ✨
            // Instead of string formatting, we explicitly tell the DB to ignore every solved ID.
            if (solvedIds.length > 0) {
                solvedIds.forEach(id => {
                    query = query.neq('id', id);
                });
            }

            if (allSkippedChallengeIds && allSkippedChallengeIds.length > 0) {
                allSkippedChallengeIds.forEach(id => {
                    query = query.neq('id', id);
                });
            }

            const { data: existingChallenge } = await query.limit(1).maybeSingle();

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
        if (!billing.success) return { success: false, error: billing.error };      

        // Get past tasks to feed into the AI Exclusion List
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
            const existingDescriptions = existingChallenges
                .map(c => `- ${c.content?.challenge || 'Unknown'}`)
                .join("\n");
            
            exclusionPrompt = `
CRITICAL ANTI-DUPLICATION RULE:
Our platform already has the following tasks for this topic:
${existingDescriptions}

You MUST NOT re-skin or re-theme the logic from the tasks above. 
If the tasks above involve summing, counting, or finding a maximum, your task MUST require a completely different algorithmic mechanism (e.g., sorting, shifting, pattern matching, grouping, validating a sequence). 
Changing the nouns (e.g., from "Apples" to "Spaceships") is NOT acceptable.`;
        }

        const taskLine = `Create a programming task in ${language} about: "${targetTopic}". Difficulty: ${difficulty}.`;

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
                        `- testRunnerCode: Provide a COMPLETE, runnable script in ${language}. It MUST include the correct reference implementation of entryFunction. Below the function, write exactly 3 to 5 test calls. For EACH test call, you must print/log exactly this format to standard output:`,
                        `___TEST_CASE___<stringified_input>___<stringified_output>`,
                        `CRITICAL RULE: Both <stringified_input> and <stringified_output> MUST be strictly valid JSON (use json.dumps in Python, JSON.stringify in JS).`,
                        "Do NOT print anything else. Just the test cases."
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
            // 🔒 SECURITY FIRST: Use the Admin key to bypass RLS and insert the task
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

            if (insertError) console.error("🔒 ADMIN DB INSERT ERROR:", insertError.message);

            if (inserted && !insertError) {
                return { success: true, challengeId: inserted.id, ...newChallengeContent };
            }
        }

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
        } catch {}
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
    const looksLikeFailure = rawOutput.startsWith("Error:") || rawOutput.startsWith("Compilation Error:") || rawOutput.startsWith("Error\n");

    if (looksLikeFailure) return extractCasesFromRunnerSource(testRunnerCode);

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

    const derived = await deriveExpectedOutputs(referenceSolution, language, entryFunction, testInputs);

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
                { role: "system", content: "You generate grading artifacts for an existing coding challenge. Return ONLY valid JSON." },
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
                    ].filter(Boolean).join("\n"),
                },
            ],
        });

        const raw = response.choices?.[0]?.message?.content ?? "";
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        const testInputs = normalizeTestInputs(parsed.testInputs);
        const referenceSolution = typeof parsed.referenceSolution === "string" && parsed.referenceSolution.trim() ? parsed.referenceSolution : undefined;
        const testRunnerCode = typeof parsed.testRunnerCode === "string" && parsed.testRunnerCode.trim() ? parsed.testRunnerCode : undefined;

        if (!referenceSolution && !testRunnerCode) return null;
        if (testInputs.length === 0 && !testRunnerCode) return null;

        return { referenceSolution, testInputs, testRunnerCode };
    } catch (err) {
        console.error("repairTestGradingFields failed:", err);
        return null;
    }
}