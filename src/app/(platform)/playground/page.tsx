'use client';

import { generateCodingChallenge } from '../playground/actions';
import { useEffect, useRef, useState } from 'react';
import MyButton from '@/src/components/ui/GlowButton/GlowButton';
import DropdownMenu from '@/src/components/ui/Dropdown';
import TaskInstructions from '@/src/components/platform/editor/TaskInstructions';
import CodeWindow from '@/src/components/platform/editor/CodeWindow';
import { executeCode } from '@/src/lib/code-executor';
import { runTestCases, resolveEntry, summarizeResults, type TestResult } from '@/src/lib/test-runner';
import InsightPanel, { type InsightAnalysis } from '@/src/components/platform/editor/InsightPanel';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/src/hooks/use-toast';

export default function PlaygroundPage() {
  const searchParams = useSearchParams();

  type Language = "javascript" | "python" | "rust";

  const [challenge, setChallenge] = useState<string | undefined>(undefined);
  const [requirements, setRequirements] = useState<string[] | undefined>(undefined);
  const [hints, setHints] = useState<{ title: string; description: string }[] | undefined>(undefined);
  const [estimatedTime, setEstimatedTime] = useState<number | undefined>(undefined);
  const [generatedLanguageLabel, setGeneratedLanguageLabel] = useState<string | undefined>(undefined);
  const [generatedDifficultyLabel, setGeneratedDifficultyLabel] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<Language>("javascript"); // dropdown selection
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [editorLanguage, setEditorLanguage] = useState<Language>("javascript"); // active editor language
  const [logs, setLogs] = useState<string[]>(["Click RUN to test your solution!"]);
  const [analysis, setAnalysis] = useState<InsightAnalysis | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<"idle" | "loading" | "error">("idle");
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isApplyingFix, setIsApplyingFix] = useState(false);
  const [applyFixError, setApplyFixError] = useState<string | null>(null);
  const [testCases, setTestCases] = useState<{ input: string; output: string }[] | undefined>(undefined);
  const [entryFunction, setEntryFunction] = useState<string | undefined>(undefined);
  const [testResults, setTestResults] = useState<TestResult[] | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();
  const [instructionWidth, setInstructionWidth] = useState<number | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const languageChoices = [
    { value: "javascript" as const, label: "JavaScript" },
    { value: "python" as const, label: "Python" },
    { value: "rust" as const, label: "Rust" },
  ];
  const difficultyChoices = [
    { value: "easy" as const, label: "Easy" },
    { value: "medium" as const, label: "Medium" },
    { value: "hard" as const, label: "Hard" },
  ];
  const startCode: Record<Language, string> = {
    javascript: `function sumEvenNumbers(arr) {
  // Your code here
  return 0;
}`,
    python: `def sum_even_numbers(arr):
  # Your code here
  return 0`,
    rust: `fn sum_even_numbers(arr: &[i32]) -> i32 {
  // Your code here
  return 0;
}`,
  };
  const [code, setCode] = useState<string>(startCode.javascript);

  const latestContextRef = useRef<{
    code: string;
    language: Language;
    challenge?: string;
    requirements?: string[];
  }>({ code, language: editorLanguage, challenge, requirements });

  useEffect(() => {
    latestContextRef.current = { code, language: editorLanguage, challenge, requirements };
  }, [code, editorLanguage, challenge, requirements]);

  const lastSuccessfulHashRef = useRef<string | null>(null);
  const inflightRef = useRef<AbortController | null>(null);
  const applyFixInflightRef = useRef<AbortController | null>(null);
  const insightFirstTimeoutRef = useRef<number | null>(null);
  const insightIntervalRef = useRef<number | null>(null);

  const ANALYSIS_AFTER_GENERATE_MS = 60_000;
  const ANALYSIS_REPEAT_MS = 60_000;

  function clearInsightSchedule() {
    if (insightFirstTimeoutRef.current != null) {
      window.clearTimeout(insightFirstTimeoutRef.current);
      insightFirstTimeoutRef.current = null;
    }
    if (insightIntervalRef.current != null) {
      window.clearInterval(insightIntervalRef.current);
      insightIntervalRef.current = null;
    }
  }

  async function sha256Base64(input: string) {
    const data = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const bytes = new Uint8Array(hashBuffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  async function analyzeNow() {
    const ctx = latestContextRef.current;
    // Don't analyze until a challenge has been generated.
    if (!ctx.challenge) return;
    // Avoid hammering when code hasn't changed.
    const hash = await sha256Base64(`${ctx.language}\n${ctx.code}`);
    if (hash === lastSuccessfulHashRef.current) return;

    // Cancel previous request if still running.
    inflightRef.current?.abort();
    const controller = new AbortController();
    inflightRef.current = controller;

    setAnalysisStatus("loading");
    setAnalysisError(null);

    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          code: ctx.code,
          language: ctx.language,
          challenge: ctx.challenge,
          requirements: ctx.requirements,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || errJson?.error || `HTTP ${res.status}`);
      }

      const data = (await res.json()) as InsightAnalysis;
      setAnalysis(data);
      setAnalysisStatus("idle");
      lastSuccessfulHashRef.current = hash;
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setAnalysisStatus("error");
      setAnalysisError(e?.message || "Failed to analyze code");
    } finally {
      if (inflightRef.current === controller) inflightRef.current = null;
    }
  }

  function handleLanguageChange(next: Language) {
    // Switch editor language immediately (syntax highlighting + Run language),
    // but DO NOT reset code until user clicks "Generate".
    setLanguage(next);
    setEditorLanguage(next);
  }

  type GenerateOverrides = {
    language?: Language;
    difficulty?: "easy" | "medium" | "hard";
    topic?: string;
  };

  async function handleGenerate(overrides: GenerateOverrides = {}) {
    const nextLanguage = overrides.language ?? language;
    const nextDifficulty = overrides.difficulty ?? difficulty;

    // Sync UI state so dropdowns + editor reflect what we're generating for.
    if (overrides.language && overrides.language !== language) {
      setLanguage(overrides.language);
    }
    if (overrides.difficulty && overrides.difficulty !== difficulty) {
      setDifficulty(overrides.difficulty);
    }
    setEditorLanguage(nextLanguage);
    setCode(startCode[nextLanguage]);
    setTestResults(undefined);
    setEntryFunction(undefined);

    setLoading(true);
    inflightRef.current?.abort();
    setAnalysisStatus("idle");

    const result = await generateCodingChallenge({
      language: nextLanguage,
      difficulty: nextDifficulty,
      topic: overrides.topic,
    });

    if (result.success) {
      setChallenge(result.challenge ?? "No challenge found");
      setRequirements(result.requirements ?? []);
      setHints(result.hints ?? []);
      setEstimatedTime(result.estimatedTime ?? 0);
      setTestCases(result.testCases ?? [{ input: "Error generating test cases", output: "Error generating test cases" }]);
      setGeneratedLanguageLabel(languageChoices.find((c) => c.value === nextLanguage)?.label ?? undefined);
      setGeneratedDifficultyLabel(difficultyChoices.find((c) => c.value === nextDifficulty)?.label ?? undefined);
      setEntryFunction(result.entryFunction);

      // Prefer the AI-supplied starter (its signature matches entryFunction)
      // and fall back to the hardcoded snippet if missing.
      const nextStarter = result.starterCode?.trim() ? result.starterCode : startCode[nextLanguage];
      setCode(nextStarter);

      lastSuccessfulHashRef.current = null;
      latestContextRef.current = {
        code: nextStarter,
        language: nextLanguage,
        challenge: result.challenge ?? undefined,
        requirements: result.requirements ?? [],
      };
      setAnalysis(null);
      setAnalysisStatus("idle");
      setAnalysisError(null);
    } else {
      alert("Error generating challenge");
    }

    setLoading(false);
  }

  function startResize(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const startX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const rowW = rowRef.current?.getBoundingClientRect().width ?? 0;
    const PANEL_MIN = 240;
    const CODE_MIN  = 360;
    const HANDLE    = 6;
    const maxWidth  = Math.max(PANEL_MIN, rowW - CODE_MIN - HANDLE);
    // First-drag fallback: if no explicit width yet, start from the current 1/3.
    const startWidth = instructionWidth ?? Math.round(rowW / 3);
    function onMove(ev: MouseEvent | TouchEvent) {
      const x = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
      const next = Math.min(maxWidth, Math.max(PANEL_MIN, startWidth + (x - startX)));
      setInstructionWidth(next);
    }
    function onUp() {
      window.removeEventListener("mousemove", onMove as any);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove as any);
      window.removeEventListener("touchend", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    
    window.addEventListener("mousemove", onMove as any);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove as any, { passive: false });
    window.addEventListener("touchend", onUp);
    document.body.style.cursor = "col-resize";   // note: col-resize, not row-resize
    document.body.style.userSelect = "none";
  }

  function parseLangParam(raw: string | null): Language | undefined {
    if (!raw) return undefined;
    const v = raw.toLowerCase();
    if (v === "js" || v === "javascript") return "javascript";
    if (v === "py" || v === "python") return "python";
    if (v === "rs" || v === "rust") return "rust";
    return undefined;
  }

  function parseDiffParam(raw: string | null): "easy" | "medium" | "hard" | undefined {
    if (!raw) return undefined;
    const v = raw.toLowerCase();
    if (v === "easy" || v === "medium" || v === "hard") return v;
    return undefined;
  }

  async function handleApplyFix() {
    const ctx = latestContextRef.current;
    const suggestion = analysis?.overallSuggestion?.trim();
    if (!suggestion || !ctx.code?.trim() || isApplyingFix) return;

    applyFixInflightRef.current?.abort();
    const controller = new AbortController();
    applyFixInflightRef.current = controller;

    setIsApplyingFix(true);
    setApplyFixError(null);

    try {
      const res = await fetch("/api/apply-fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          code: ctx.code,
          language: ctx.language,
          suggestion,
          challenge: ctx.challenge,
          requirements: ctx.requirements,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || errJson?.error || `HTTP ${res.status}`);
      }

      const data = (await res.json()) as { code?: string };
      const nextCode = (data?.code ?? "").trim();
      if (!nextCode) throw new Error("Empty fix returned");

      setCode(nextCode);
      // Force re-analysis of the new code so the panel updates.
      lastSuccessfulHashRef.current = null;
      latestContextRef.current = { ...ctx, code: nextCode };
      analyzeNow();
    } catch (e: any) {
      if (e?.name === "AbortError") return;
      setApplyFixError(e?.message || "Failed to apply fix");
    } finally {
      if (applyFixInflightRef.current === controller) applyFixInflightRef.current = null;
      setIsApplyingFix(false);
    }
  }

  const handleRun = async (codeToRun: string) => {
    setLogs(["Running..."]);
    const result = await executeCode(codeToRun, editorLanguage);

    if (result.trim() === "Executed successfully (no output).") {
      addToast(
        "No output detected. Try to print/call your function.",
        "info"
      );
    }
    // Split results into lines for the terminal component
    const logLines = result.split("\n").filter((line: string) => line.trim().length > 0);
    setLogs(logLines);
  };

  // Returns the pass/total summary so SavePopUp can show a post-submit results view.
  const handleSubmit = async (
    codeToSubmit: string,
  ): Promise<{ passed: number; total: number } | undefined> => {
    if (!testCases || testCases.length === 0) {
      addToast("Generate a task first so there are test cases to check against.", "warning");
      return undefined;
    }

    setIsSubmitting(true);
    setTestResults(undefined);

    try {
      // Prefer the AI's name if the user's code actually defines it; otherwise
      // fall back to whatever function is present. This survives "Apply Fix"
      // rewrites and user renames.
      const entry = resolveEntry(codeToSubmit, editorLanguage, entryFunction);
      const results = await runTestCases(codeToSubmit, editorLanguage, entry, testCases);
      setTestResults(results);

      const { passed, total, errored, skipped } = summarizeResults(results);

      if (skipped === total && total > 0) {
        addToast("Grading for this language is not supported yet.", "warning");
      } else if (passed === total) {
        addToast(`All ${total} test cases passed!`, "success");
      } else if (errored > 0) {
        addToast(`${passed} / ${total} passed (${errored} errored)`, "warning");
      } else {
        addToast(`${passed} / ${total} test cases passed`, "error");
      }

      return { passed, total };
    } catch (e: any) {
      addToast(e?.message || "Failed to run test cases.", "error");
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear stale results whenever the user edits the code after submitting.
  useEffect(() => {
    if (testResults) setTestResults(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // Trigger generation when the dashboard navigates here with ?autoGenerate=...
  useEffect(() => {
    if (!searchParams.get('autoGenerate')) return;

    const overrides: GenerateOverrides = {
      language: parseLangParam(searchParams.get('lang')),
      difficulty: parseDiffParam(searchParams.get('diff')),
      topic: searchParams.get('title') || undefined,
    };

    handleGenerate(overrides);
    window.history.replaceState({}, '', '/playground');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // After a challenge exists: wait one minute before the first insights run,
  // then re-run every minute. Regenerating swaps `challenge`, which clears timers
  // and restarts this schedule so the AI always reads the newest task/context.
  useEffect(() => {
    if (!challenge) {
      clearInsightSchedule();
      return;
    }
    clearInsightSchedule();
    insightFirstTimeoutRef.current = window.setTimeout(() => {
      insightFirstTimeoutRef.current = null;
      void analyzeNow();
      insightIntervalRef.current = window.setInterval(() => {
        void analyzeNow();
      }, ANALYSIS_REPEAT_MS);
    }, ANALYSIS_AFTER_GENERATE_MS);

    return () => {
      clearInsightSchedule();
      inflightRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge]);

  return (
   <div className="h-full min-h-0 w-full overflow-y-auto pt-16 flex flex-col">
      <section className="w-full flex flex-col flex-1 min-h-0">
        <div className="flex h-auto w-full items-center justify-start dark:text-content shrink-0">
          <div className="flex h-auto w-1/3 flex-row items-center justify-center gap-2">
            <div className="flex h-auto w-[90%] flex-row items-center justify-between gap-2">
              <MyButton effect="glow" onClick={() => handleGenerate()}>
                {loading ? "Generating..." : "Generate"}
              </MyButton>
              <DropdownMenu
                choices={languageChoices}
                value={language}
                onChange={handleLanguageChange}
                placeholder="Language"
              />
              <DropdownMenu
                choices={difficultyChoices}
                value={difficulty}
                onChange={setDifficulty}
                placeholder="Difficulty"
              />
            </div>
          </div>
        </div>

        <div ref={rowRef} className="flex min-h-0 flex-1 w-full items-stretch overflow-hidden p-4 gap-4">
          <TaskInstructions
            challenge={challenge}
            requirements={requirements}
            hints={hints}
            estimatedTime={estimatedTime}
            languageLabel={generatedLanguageLabel}
            difficultyLabel={generatedDifficultyLabel}
            isGenerating={loading}
            isGenerated={Boolean(challenge)}
            testCases={testCases}
            testResults={testResults}
            isSubmitting={isSubmitting}
            instructionWidth={instructionWidth ?? undefined}
          />

          <div
            role="separator"
            aria-orientation="vertical"
            onMouseDown={startResize}
            onTouchStart={startResize}
            className="rounded-lg w-1.5 self-stretch shrink-0 cursor-col-resize dark:bg-border hover:dark:bg-primary/60 transition-colors"
          />
          <CodeWindow
            language={editorLanguage}
            code={code}
            onChange={setCode}
            onRun={handleRun}
            onSubmit={handleSubmit}
            logs={logs}
          />
        </div>
      </section>

      <InsightPanel
        analysis={analysis}
        status={analysisStatus}
        errorMessage={analysisError}
        hasChallenge={Boolean(challenge)}   
        onApplyFix={handleApplyFix}
        isApplyingFix={isApplyingFix}
        applyFixError={applyFixError}
      />
   </div>
   
  );
}
