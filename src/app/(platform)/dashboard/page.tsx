'use client';

import { generateCodingChallenge } from './actions';
import { useEffect, useRef, useState } from 'react';
import MyButton from '@/src/components/ui/GlowButton/GlowButton';
import DropdownMenu from '@/src/components/ui/dropdown';
import { Badge } from '@/src/components/ui/badge';
import TaskInstructions from '@/src/components/platform/editor/TaskInstructions';
import CodeWindow from '@/src/components/platform/editor/CodeWindow';
import { executeCode } from '@/src/lib/code-executor';
import InsightPanel, { type InsightAnalysis } from '@/src/components/platform/editor/InsightPanel';

export default function AppHome() {
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

  async function sha256Base64(input: string) {
    const data = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const bytes = new Uint8Array(hashBuffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  async function analyzeNow() {
    if (analysisStatus === "loading") return;

    const ctx = latestContextRef.current;
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

  async function handleGenerate() {
    // Reset editor only when Generate is clicked (not when dropdown changes)
    setEditorLanguage(language);
    setCode(startCode[language]);

    setLoading(true);
    
    // Call the server action directly
    const result = await generateCodingChallenge({ language, difficulty });
    
    if (result.success) {
      setChallenge(result.challenge ?? "No challenge found");
      setRequirements(result.requirements ?? []);
      setHints(result.hints ?? []);
      setEstimatedTime(result.estimatedTime ?? 0);

      setGeneratedLanguageLabel(languageChoices.find((c) => c.value === language)?.label ?? undefined);
      setGeneratedDifficultyLabel(difficultyChoices.find((c) => c.value === difficulty)?.label ?? undefined);
    } else {
      alert("Error generating challenge");
    }
    
    setLoading(false);
  }

  const handleRun = async (codeToRun: string) => {
    setLogs(["Running..."]);
    const result = await executeCode(codeToRun, editorLanguage);
    // Split results into lines for the terminal component
    const logLines = result.split("\n").filter((line: string) => line.trim().length > 0);
    setLogs(logLines);
  };

  // Analyze code every 1 second (only when it changed).
  useEffect(() => {
    analyzeNow();
    const id = window.setInterval(() => {
      analyzeNow();
    }, 999_999_999); // 10 seconds
    return () => {
      window.clearInterval(id);
      inflightRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
   <main className="flex h-full min-h-0 w-full flex-col overflow-y-auto">
      {/* Top area (controls + split view). Page scrolls normally. */}
      <section className="flex w-full flex-col">
        <div className="flex min-h-[4em] w-full shrink-0 items-center justify-start border-b-1 dark:border-accent dark:bg-background dark:text-content">
          <div className="flex h-auto w-1/3 flex-row items-center justify-center gap-2">
            <div className="flex h-auto w-[90%] flex-row items-center justify-between gap-2">
              <MyButton effect="glow" onClick={handleGenerate}>
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

        {/* Fixed-height split view so it doesn't grow with generated content */}
        <div className="flex h-[70vh] min-h-[28rem] w-full items-stretch overflow-hidden">
          <TaskInstructions
            challenge={challenge}
            requirements={requirements}
            hints={hints}
            estimatedTime={estimatedTime}
            languageLabel={generatedLanguageLabel}
            difficultyLabel={generatedDifficultyLabel}
            isGenerating={loading}
          />
          <CodeWindow language={editorLanguage} code={code} onChange={setCode} onRun={handleRun} logs={logs} />
        </div>
      </section>

      {/* Scroll down to see insights */}
      <InsightPanel analysis={analysis} status={analysisStatus} errorMessage={analysisError} />
   </main>
   
  );
}
