// src/components/platform/editor/InsightPanel.tsx
import AnalyticsCard from "@/src/components/ui/AnalyticsCard";
import { Lightbulb, Loader2, Sparkles, Check, FileText } from "lucide-react";
import CortexLoader from "@/src/components/ui/CortexLoader";
import { motion, useReducedMotion } from "framer-motion";

export type InsightFeedbackKind = "issue" | "improvement" | "praise";

export interface InsightFeedbackBlock {
  id: string;
  title: string;
  text: string;
  kind: InsightFeedbackKind;
}

export type InsightReport = {
  headline: string;
  verdict: string;
  overview: string;
  flow: { phase: string; detail: string }[];
  loopAndComplexityNotes: string | null;
  caution: string | null;
  generatedAt: string;
};

export interface InsightAnalysis {
  scores: {
    codeQuality: number;
    performance: number;
    bestPractices: number;
  };
  summaries: {
    codeQuality: string;
    performance: string;
    bestPractices: string;
  };
  feedback: InsightFeedbackBlock[];
  overallSuggestion: string;
  analyzedAt: string;
}

interface InsightPanelProps {
  analysis?: InsightAnalysis | null;
  status?: "idle" | "loading" | "error";
  errorMessage?: string | null;
  hasChallenge?: boolean;
  onApplyFix?: () => void;
  isApplyingFix?: boolean;
  applyFixError?: string | null;
  report?: InsightReport | null;
  onGenerateReport?: () => void;
  isGeneratingReport?: boolean;
  generateReportError?: string | null;
}


export default function InsightPanel({ analysis, status = "idle", errorMessage, hasChallenge = true, onApplyFix, isApplyingFix = false, applyFixError, report, onGenerateReport, isGeneratingReport = false, generateReportError }: InsightPanelProps) {
  const reduceMotion = useReducedMotion();

  if (!hasChallenge) {
    return (
      <section className="w-full flex flex-col dark:bg-background px-4 pb-4">
        <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-1 dark:border-border dark:bg-card/40 px-6 py-10 text-center">
          <h3 className="text-sm font-semibold uppercase tracking-wider dark:text-muted-foreground">
            No challenge yet
          </h3>
          <p className="max-w-md text-sm dark:text-muted-foreground">
            Click <span className="font-semibold dark:text-content">Generate</span> to create a challenge. Your code will be analyzed automatically once it&apos;s ready.
          </p>
        </div>
      </section>
    );
  }


  const codeQuality = analysis?.scores?.codeQuality ?? 0;
  const performance = analysis?.scores?.performance ?? 0;
  const bestPractices = analysis?.scores?.bestPractices ?? 0;
  const codeQualityTooltip =
    "Based on readability, structure, and how clearly the solution solves the task.";
  const performanceTooltip =
    "Based on efficiency, unnecessary work, and how heavy the code looks to run.";
  const bestPracticesTooltip =
    "Based on clean conventions, maintainability, and safer coding patterns.";

  const codeQualitySummary = analysis?.summaries?.codeQuality ?? "Waiting for analysis…";
  const performanceSummary = analysis?.summaries?.performance ?? "Waiting for analysis…";
  const bestPracticesSummary = analysis?.summaries?.bestPractices ?? "Waiting for analysis…";

  const suggestion =
    analysis?.overallSuggestion ??
    "Start typing your solution — I’ll analyze it periodically and surface improvements here.";

  const suggestionBusy = status === "loading" || isApplyingFix;

  return (
    <section className="w-full flex flex-col dark:bg-background space-y-4 px-4 pb-4">
      <div className="flex items-center gap-2 px-2">
        <div className="ml-auto flex items-center gap-2 text-xs dark:text-muted-foreground">
          {status === "loading" && (
            <>
              <CortexLoader size={5} color="" />
              <span>Analyzing…</span>
            </>
          )}
          {status === "error" && <span className="dark:text-red-400">{errorMessage || "Analysis failed"}</span>}
          {status !== "loading" && status !== "error" && analysis?.analyzedAt && (
            <span>
              Updated {new Date(analysis.analyzedAt).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* 2. Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <AnalyticsCard 
                          title="Code Quality" 
                          score={codeQuality} 
                          description={codeQualitySummary} 
                          infoTooltip={codeQualityTooltip}
                          color="#ef4444"
                          loading={status === "loading" || isApplyingFix}
                        />
                        <AnalyticsCard 
                          title="Performance" 
                          score={performance} 
                          description={performanceSummary} 
                          infoTooltip={performanceTooltip}
                          color="#eab308"
                          loading={status === "loading" || isApplyingFix}
                        />
                        <AnalyticsCard 
                          title="Best Practices" 
                          score={bestPractices} 
                          description={bestPracticesSummary} 
                          infoTooltip={bestPracticesTooltip}
                          color="#22c55e"
                          loading={status === "loading" || isApplyingFix}
                        />
          
      </div>

      <div
        className="w-full rounded-xl border dark:border-border dark:bg-card/50 transition-all"
        aria-busy={suggestionBusy}
      >
        <div className="flex items-start justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="dark:text-yellow-400" size={18} aria-hidden="true" />
            <h3 className="text-sm font-semibold dark:text-muted-foreground uppercase tracking-wider opacity-80">
              AI Suggestion
            </h3>
          </div>

          <button
            type="button"
            onClick={onApplyFix}
            disabled={!onApplyFix || isApplyingFix || !analysis?.overallSuggestion || status === "loading"}
            className="inline-flex shrink-0 items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold dark:text-orange-400 dark:hover:bg-orange-500/10 dark:hover:text-orange-300 disabled:cursor-not-allowed disabled:opacity-50 dark:disabled:hover:bg-transparent"
            aria-label="Apply fix"
          >
            {isApplyingFix ? (
              <>
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                <span>Applying…</span>
              </>
            ) : (
              <>
                <span>Apply Fix</span>
                <Check size={14} className="opacity-80" aria-hidden="true" />
              </>
            )}
          </button>
        </div>

        <div className="px-4 pb-4">
          <motion.p
            className="text-sm dark:text-muted leading-relaxed whitespace-pre-wrap break-words"
            initial={{ opacity: 0 }}
            animate={
              suggestionBusy && !reduceMotion
                ? { opacity: [0.48, 1, 0.48] }
                : { opacity: 1 }
            }
            transition={
              suggestionBusy && !reduceMotion
                ? { duration: 1.35, repeat: Infinity, ease: "easeInOut" }
                : { duration: 1.5, ease: "easeInOut" }
            }
          >
            {suggestion}
          </motion.p>
          {applyFixError && (
            <motion.p className="mt-2 text-xs dark:text-red-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}>{applyFixError}</motion.p>
          )}
        </div>
      </div>
      <div
        className={`w-full rounded-xl border dark:border-border dark:bg-card/50 transition-all ${
          isGeneratingReport ? "blur-sm opacity-50 dark:shadow-white" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <FileText className="dark:text-yellow-400" size={18} aria-hidden="true" />
            <h3 className="font-display text-base font-semibold uppercase tracking-wider dark:text-content/90">
              The Architect — Structural Integrity Report
            </h3>
          </div>

          <button
            type="button"
            onClick={onGenerateReport}
            disabled={!onGenerateReport || isGeneratingReport || status === "loading"}
            className="inline-flex shrink-0 items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold font-sans dark:text-orange-400 dark:hover:bg-orange-500/10 dark:hover:text-orange-300 disabled:cursor-not-allowed disabled:opacity-50 dark:disabled:hover:bg-transparent"
            aria-label="Generate structural integrity report"
          >
            {isGeneratingReport ? (
              <>
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                <span>Generating…</span>
              </>
            ) : (
              <>
                <span>Generate Report</span>
                <Sparkles size={14} className="opacity-80" aria-hidden="true" />
              </>
            )}
          </button>
        </div>

        {generateReportError && (
          <p className="px-4 pb-2 font-sans text-sm dark:text-red-400">{generateReportError}</p>
        )}

        {report ? (
          <div className="space-y-4 px-4 pb-5 font-sans text-base leading-relaxed text-muted-foreground">
            <p className="font-display text-xl font-semibold tracking-tight text-balance dark:text-content">
              {report.headline}
            </p>
            <p className="text-[1.05rem] dark:text-content/90">{report.verdict}</p>
            <p className="whitespace-pre-wrap break-words text-muted-foreground">{report.overview}</p>
            <ul className="list-disc space-y-3 pl-5 marker:text-content/35">
              {report.flow.map((item, i) => (
                <li key={`${item.phase}-${i}`}>
                  <span className="font-display text-base font-semibold dark:text-content">{item.phase}</span>
                  <span className="text-muted-foreground"> — {item.detail}</span>
                </li>
              ))}
            </ul>

            {report.loopAndComplexityNotes ? (
              <p className="border-t border-border pt-4 text-base dark:border-border">
                <span className="font-display text-base font-semibold dark:text-content">Loops &amp; complexity: </span>
                <span className="text-muted-foreground">{report.loopAndComplexityNotes}</span>
              </p>
            ) : null}

            {report.caution ? (
              <p className="rounded-md border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 font-sans text-sm leading-relaxed text-yellow-100/95">
                {report.caution}
              </p>
            ) : null}

            <p className="font-sans text-xs uppercase tracking-wider text-content/45">
              Generated {new Date(report.generatedAt).toLocaleString()}
            </p>
          </div>
        ) : (
          <div className="px-4 pb-5 font-sans text-base leading-relaxed text-muted-foreground/90">
            Click <span className="font-medium text-content">Generate Report</span> for a deep
            structural walkthrough of your solution.
          </div>
        )}
      </div>
    </section>
  );
}