import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { InsightAnalysis, InsightReport } from "@/src/components/platform/editor/InsightPanel";
import type { PlaygroundTopic } from "@/src/lib/playground-topics";

export type PlaygroundLanguage = "javascript" | "python" | "rust";
export type PlaygroundDifficulty = "easy" | "medium" | "hard";

type TestCase = { input: string; output: string };
type Hint = { title: string; description: string };

/** Everything you want to survive refresh + drive TaskInstructions / CodeWindow / tests */
interface PlaygroundState {
  code: string;
  challenge: string | undefined;
  requirements: string[];
  hints: Hint[];
  estimatedTime: number | undefined;
  testCases: TestCase[] | undefined;
  entryFunction: string | undefined;

  language: PlaygroundLanguage;
  editorLanguage: PlaygroundLanguage;
  difficulty: PlaygroundDifficulty;
  topic: PlaygroundTopic;

  analysis: InsightAnalysis | null;
  report: InsightReport | null;

  setCode: (code: string) => void;
  setLanguage: (lang: PlaygroundLanguage) => void;
  setEditorLanguage: (lang: PlaygroundLanguage) => void;
  setDifficulty: (d: PlaygroundDifficulty) => void;
  setTopic: (t: PlaygroundTopic) => void;

  /** One action that runs after a successful `generateCodingChallenge` */
  applySuccessfulGeneration: (args: {
    code: string;
    challenge: string;
    requirements: string[];
    hints: Hint[];
    estimatedTime: number;
    testCases: TestCase[];
    entryFunction: string | undefined;
    language: PlaygroundLanguage;
    editorLanguage: PlaygroundLanguage;
    difficulty: PlaygroundDifficulty;
  }) => void;

  clearInsights: () => void;
  setAnalysis: (a: InsightAnalysis | null) => void;
  setReport: (r: InsightReport | null) => void;
}

const initialCode = `function sumEvenNumbers(arr) {
  // Your code here
  return 0;
}`;

export const usePlaygroundStore = create<PlaygroundState>()(
  persist(
    (set) => ({
      code: initialCode,
      challenge: undefined,
      requirements: [],
      hints: [],
      estimatedTime: undefined,
      testCases: undefined,
      entryFunction: undefined,
      language: "javascript",
      editorLanguage: "javascript",
      difficulty: "easy",
      topic: "random",
      analysis: null,
      report: null,

      setCode: (code) => set({ code }),
      setLanguage: (language) => set({ language }),
      setEditorLanguage: (editorLanguage) => set({ editorLanguage }),
      setDifficulty: (difficulty) => set({ difficulty }),
      setTopic: (topic) => set({ topic }),

      applySuccessfulGeneration: ({
        code,
        challenge,
        requirements,
        hints,
        estimatedTime,
        testCases,
        entryFunction,
        language,
        editorLanguage,
        difficulty,
      }) =>
        set({
          code,
          challenge,
          requirements,
          hints,
          estimatedTime,
          testCases,
          entryFunction,
          language,
          editorLanguage,
          difficulty,
          analysis: null,
          report: null,
        }),

      clearInsights: () => set({ analysis: null, report: null }),
      setAnalysis: (analysis) => set({ analysis }),
      setReport: (report) => set({ report }),
    }),
    {
      name: "cortex-playground-storage",
      partialize: (s) => ({
        code: s.code,
        challenge: s.challenge,
        requirements: s.requirements,
        hints: s.hints,
        estimatedTime: s.estimatedTime,
        testCases: s.testCases,
        entryFunction: s.entryFunction,
        language: s.language,
        editorLanguage: s.editorLanguage,
        difficulty: s.difficulty,
        topic: s.topic,
        analysis: s.analysis,
        report: s.report,
      }),
    }
  )
);