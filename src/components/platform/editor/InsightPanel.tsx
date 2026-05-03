// src/components/platform/editor/InsightPanel.tsx
import AnalyticsCard from "@/src/components/ui/AnalyticsCard";
import { AlertTriangle, CheckCircle2, Lightbulb, Loader2, Sparkles, Wrench, Check} from "lucide-react";
import CortexLoader from "@/src/components/ui/CortexLoader";

export type InsightFeedbackKind = "issue" | "improvement" | "praise";

export interface InsightFeedbackBlock {
  id: string;
  title: string;
  text: string;
  kind: InsightFeedbackKind;
}

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
  analyzedAt: string; // ISO string
}

interface InsightPanelProps {
  analysis?: InsightAnalysis | null;
  status?: "idle" | "loading" | "error";
  errorMessage?: string | null;
  hasChallenge?: boolean;
  onApplyFix?: () => void;
  isApplyingFix?: boolean;
  applyFixError?: string | null;
}


export default function InsightPanel({ analysis, status = "idle", errorMessage, hasChallenge = true, onApplyFix, isApplyingFix = false, applyFixError }: InsightPanelProps) {
  if (!hasChallenge) {
    return (
      <section className="w-full flex flex-col bg-background px-4 pb-4">
        <div className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-1 border-border bg-card/40 px-6 py-10 text-center">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            No challenge yet
          </h3>
          <p className="max-w-md text-sm text-muted-foreground">
            Click <span className="font-semibold text-content">Generate</span> to create a challenge. Your code will be analyzed automatically once it&apos;s ready.
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

  const feedbackBlocks = Array.isArray(analysis?.feedback) ? analysis!.feedback : [];
  const suggestion =
    analysis?.overallSuggestion ??
    "Start typing your solution — I’ll analyze it periodically and surface improvements here.";

  return (
    <section className="w-full flex flex-col bg-background space-y-4 px-4 pb-4">
      <div className="flex items-center gap-2 px-2">
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          {status === "loading" && (
            <>
              <CortexLoader size={5} color="" />
              <span>Analyzing…</span>
            </>
          )}
          {status === "error" && <span className="text-red-400">{errorMessage || "Analysis failed"}</span>}
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
                          color="green"
                          loading={status === "loading" ? true : false}
                        />
                        <AnalyticsCard 
                          title="Performance" 
                          score={performance} 
                          description={performanceSummary} 
                          infoTooltip={performanceTooltip}
                          color="yellow"
                          loading={status === "loading" ? true : false}
                        />
                        <AnalyticsCard 
                          title="Best Practices" 
                          score={bestPractices} 
                          description={bestPracticesSummary} 
                          infoTooltip={bestPracticesTooltip}
                          color="blue"
                          loading={status === "loading" ? true : false}
                        />
          
      </div>

      <div className={`w-full rounded-xl border border-border bg-card/50 transition-all ${status === "loading" ? "blur-sm opacity-50 shadow-white" : ""}`}>
        <div className="flex items-start justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-yellow-400" size={18} aria-hidden="true" />
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider opacity-80">
              AI Suggestion
            </h3>
          </div>

          <button
            type="button"
            onClick={onApplyFix}
            disabled={!onApplyFix || isApplyingFix || !analysis?.overallSuggestion || status === "loading"}
            className="inline-flex shrink-0 items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold text-orange-400 hover:bg-orange-500/10 hover:text-orange-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
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
          <p className="text-sm text-muted-foreground dark:text-muted leading-relaxed whitespace-pre-wrap break-words">
            {suggestion}
          </p>
          {applyFixError && (
            <p className="mt-2 text-xs text-red-400">{applyFixError}</p>
          )}
        </div>
      </div>
    </section>
  );
}