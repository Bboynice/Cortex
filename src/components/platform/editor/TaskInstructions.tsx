import Pill from "@/src/components/ui/Pill";
import { Loader2 } from "lucide-react";
import NeonBorder from "@/src/components/ui/NeonBorder";
import CortexLoader from "@/src/components/ui/CortexLoader";
import { useEffect, useState , useRef} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, CheckCircle2, XCircle, AlertTriangle, MinusCircle } from "lucide-react";
import { useToast } from "@/src/hooks/use-toast";
import type { TestResult } from "@/src/lib/test-runner";
import { summarizeResults } from "@/src/lib/test-runner";

interface TaskInstructionsProps {
  challenge?: string;
  requirements?: string[];
  hints?: { title: string; description: string }[];
  estimatedTime?: number;
  languageLabel?: string;
  difficultyLabel?: string;
  isGenerating?: boolean;
  isGenerated?: boolean;
  testCases?: { input: string; output: string }[];
  testResults?: TestResult[];
  isSubmitting?: boolean;
  instructionWidth?: number;
}





export default function TaskInstructions({ 
  challenge = "Generate a new task",
  requirements = ["Follow the instructions", "Here will be the requirements"],
  hints = [{ title: "Here might be some hints", description: "" }],
  estimatedTime = 0,
  languageLabel,
  difficultyLabel,
  isGenerating = false,
  isGenerated = false,
  testCases = [],
  testResults,
  isSubmitting = false,
  instructionWidth,
}: TaskInstructionsProps) {
  const [showTestCases, setShowTestCases] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast(text + " copied to clipboard.", "copy");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Auto-open the test cases section the moment a submission starts or finishes
  // so the user actually sees the per-case status they just triggered.
  useEffect(() => {
    if (isSubmitting || testResults) setShowTestCases(true);
  }, [isSubmitting, testResults]);

  const summary = summarizeResults(testResults);
  const hasResults = Boolean(testResults && testResults.length > 0);
  const passedAll = hasResults && summary.passed === summary.total && summary.total > 0;


  
  return (
    <div 
    style={instructionWidth != null ? { width: instructionWidth } : undefined}
    className={[
      "flex min-h-0 shrink-0 self-stretch flex-col items-center overflow-hidden",
      "rounded-lg border-1 dark:border-border dark:bg-surface dark:text-content",
      instructionWidth == null ? "w-1/3" : "",
    ].join(" ")}
    
    >
        <div className={`w-full h-12 flex justify-center items-center pl-4 pr-4 shrink-0`}>
        <div className="w-full flex min-w-0 justify-between items-center gap-2">
          <div className="dark:text-muted-foreground h-auto py-2 shrink-0">AI Task Generator</div>
          <div className="w-auto h-auto flex min-w-0 flex-wrap items-center justify-end gap-2">
            {languageLabel && <Pill text={languageLabel} variant="content" />}
            {difficultyLabel && <Pill text={difficultyLabel} variant="primary" />}
          </div>
        </div>
        </div>
        <div className="w-full flex-1 min-h-0 overflow-y-auto p-4">
        <div className="w-full h-auto p-4 rounded-md border dark:border-border bg-cortex-heat dark:text-content ">
          <p className="text-lg font-semibold dark:text-white">Challenge:</p>
         {isGenerating ?  <CortexLoader size={3} /> : <p className="dark:text-white/70">{challenge}</p>}
          <p className="text-lg font-semibold dark:text-white mt-3">Requirements:</p>
          <div className="flex flex-col gap-2">
            {isGenerating ? <CortexLoader size={3} /> : 
            <ul className="list-disc list-inside space-y-1 dark:text-white/50">
              {(requirements.length ? requirements : ["No requirements found"]).map((requirement, idx) => (
                <li key={`${idx}-${requirement}`}>{requirement}</li>
              ))}
            </ul>
            }
        </div>
      </div>
      <div className="w-full justify-start items-center flex flex-col w-full h-auto p-4">
        <div className="h-auto w-full flex justify-center items-center flex-col gap-4 border-b dark:border-border pb-4">
          {hints.map((hint, idx) => (
            <div key={`${idx}-${hint.title}`} className="w-full flex h-auto justify-center items-center flex-row gap-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="shrink-0 dark:text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.18" stroke="none" />
                    <path d="M8.2 12.2l2.3 2.3L15.8 9.7" />
                  </svg>
                  <div className="w-full flex justify-start flex-col">
                    {isGenerating ? (
                      <div className="py-1">
                        <CortexLoader size={3} />
                      </div>
                    ) : (
                      <>
                        <h1 className="text-lg font-semi-bold dark:text-muted-foreground">{hint.title}</h1>
                        <p className="text-sm dark:text-muted">{hint.description}</p>
                      </>
                    )}
                  </div>
            </div>
          ))}
        </div>
        <div className="flex w-full justify-start items-center h-auto items-center flex-row gap-1 py-2">
          <div className="flex justify-start items-center flex-row gap-1 w-1/2">
          <svg
            className="h-[1.15em] w-[1.15em] dark:text-content/70"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
          >
            {/* soft filled clock face */}
            <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.22" />
            {/* hands (no outer border) */}
            <path
              d="M12 7.5v4.8l3.2 1.9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="1" fill="currentColor" fillOpacity="0.85" />
          </svg>
          <p className="text-sm dark:text-muted">Estimated:</p>
            {isGenerating ? <CortexLoader size={3} /> : 
            <p className="text-sm dark:text-content/50">{estimatedTime} minutes</p>
            }
            </div>
            {isGenerated && !isGenerating && (
              <p
                onClick={() => setShowTestCases(!showTestCases)}
                className="text-sm dark:text-content/50 w-1/2 justify-end items-end flex hover:text-primary transition-colors hover:underline cursor-pointer select-none"
              >
                {showTestCases ? "Hide" : "See"} Test Cases
              </p>
            )}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isGenerated && showTestCases && !isGenerating &&(
          <motion.div
            key="test-cases"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full overflow-hidden"
          >
            <div className="w-[calc(100%-2rem)] mx-4 mb-4 flex flex-col items-start justify-start gap-1 p-4 border dark:border-border rounded-md bg-none dark:text-content">
              <div className="flex w-full flex-row items-center justify-between">
                <div className="text-lg font-semibold dark:text-white">Test Cases:</div>
                {(isSubmitting || hasResults) && (
                  <div className="flex flex-row items-center gap-2">
                    {isSubmitting && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    )}
                    <span
                      className={[
                        "font-mono text-sm",
                        isSubmitting
                          ? "text-content/60"
                          : passedAll
                            ? "text-green-500"
                            : summary.errored > 0
                              ? "text-yellow-500"
                              : "text-red-500",
                      ].join(" ")}
                    >
                      {isSubmitting
                        ? `running... 0 / ${testCases.length}`
                        : `${summary.passed} / ${summary.total}`}
                    </span>
                  </div>
                )}
              </div>

              {hasResults && (
                <p
                  className={[
                    "text-sm",
                    passedAll
                      ? "text-green-500/80"
                      : summary.errored > 0
                        ? "text-yellow-500/80"
                        : "text-red-500/80",
                  ].join(" ")}
                >
                  {passedAll
                    ? "All test cases passed."
                    : `${summary.passed} of ${summary.total} test cases passed${
                        summary.errored > 0 ? ` (${summary.errored} errored)` : ""
                      }.`}
                </p>
              )}

              <div className="mt-1 flex w-full flex-col gap-2">
                {testCases.map((testCase, idx) => {
                  const result = testResults?.[idx];
                  return (
                    <div
                      key={`${idx}-${testCase.input}`}
                      className={[
                        "w-full rounded-md border p-2.5 transition-colors",
                        result?.status === "pass"
                          ? "border-green-500/20 bg-green-500/[0.04]"
                          : result?.status === "fail"
                            ? "border-red-500/20 bg-red-500/[0.05]"
                            : result?.status === "error"
                              ? "border-yellow-500/20 bg-yellow-500/[0.05]"
                              : result?.status === "skipped"
                                ? "border-border/40 bg-content/[0.03]"
                                : "border-border/40",
                      ].join(" ")}
                    >
                      <div className="flex w-full flex-row items-center justify-between gap-2 min-w-0">
                        <div className="flex flex-row flex-wrap gap-x-3 gap-y-0.5 min-w-0">
                          <span className="text-sm dark:text-content/50">
                            Input:{" "}
                            <b
                              title="Copy to clipboard"
                              onClick={() => handleCopy(testCase.input)}
                              className="text-sm font-mono hover:text-primary transition-colors cursor-pointer select-none"
                            >
                              {testCase.input}
                            </b>
                          </span>
                          <span className="text-sm dark:text-content/50">
                            Output:{" "}
                            <b
                              title="Copy to clipboard"
                              onClick={() => handleCopy(testCase.output)}
                              className="text-sm font-mono hover:text-primary transition-colors cursor-pointer select-none"
                            >
                              {testCase.output}
                            </b>
                          </span>
                        </div>
                        <TestCaseStatus result={result} isSubmitting={isSubmitting} />
                      </div>
                      {result && <ResultDetail result={result} />}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

// Renders the dynamic pass/fail/error badge next to a single test case row.
// Stays empty until the user has actually submitted, so the column is blank
// during exploration and only lights up green/red after grading.
function TestCaseStatus({
  result,
  isSubmitting,
}: {
  result?: TestResult;
  isSubmitting?: boolean;
}) {
  if (isSubmitting && !result) {
    return (
      <span className="flex shrink-0 items-center gap-1 text-sm text-content/60">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Running...
      </span>
    );
  }

  if (!result) return null;

  if (result.status === "pass") {
    return (
      <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-green-500">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Success
      </span>
    );
  }

  if (result.status === "fail") {
    return (
      <span
        title={`Got ${JSON.stringify((result as any).actual)}`}
        className="flex shrink-0 items-center gap-1 text-sm font-medium text-red-500"
      >
        <XCircle className="h-3.5 w-3.5" />
        Failed
      </span>
    );
  }

  if (result.status === "skipped") {
    return (
      <span
        title={(result as any).message}
        className="flex shrink-0 items-center gap-1 text-sm font-medium text-content/50"
      >
        <MinusCircle className="h-3.5 w-3.5" />
        Skipped
      </span>
    );
  }

  return (
    <span
      title={(result as any).message}
      className="flex shrink-0 items-center gap-1 text-sm font-medium text-yellow-500"
    >
      <AlertTriangle className="h-3.5 w-3.5" />
      Error
    </span>
  );
}

// The per-case detail line shown below Input/Output once a submission has finished.
// Pass cases get a quiet "Passed" line so the layout stays consistent; failures
// surface the expected vs. actual values inline so debugging is one glance away.
function ResultDetail({ result }: { result: TestResult }) {
  if (result.status === "pass") {
    return (
      <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-green-500/80">
        <CheckCircle2 className="h-3 w-3" />
        Passed
      </div>
    );
  }

  if (result.status === "fail") {
    const expected = JSON.stringify(result.expected);
    const actual = result.actual === null ? "(no value)" : JSON.stringify(result.actual);
    return (
      <div className="mt-1.5 flex flex-row flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        <span className="uppercase tracking-wide text-[10px] text-content/40">Expected</span>
        <code className="font-mono px-1.5 py-0.5 rounded bg-content/[0.08] text-content/80">
          {expected}
        </code>
        <span className="text-content/30">→</span>
        <span className="uppercase tracking-wide text-[10px] text-content/40">Got</span>
        <code className="font-mono px-1.5 py-0.5 rounded bg-red-500/15 text-red-400">
          {actual}
        </code>
      </div>
    );
  }

  if (result.status === "error") {
    return (
      <div className="mt-1.5 flex items-start gap-1.5 text-xs text-yellow-500/90">
        <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" />
        <span className="font-mono break-all">{result.message}</span>
      </div>
    );
  }

  if (result.status === "skipped") {
    return (
      <div className="mt-1.5 text-xs italic text-content/40">{result.message}</div>
    );
  }

  return null;
}
