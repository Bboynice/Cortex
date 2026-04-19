// src/components/platform/editor/InsightPanel.tsx
import AnalyticsCard from "@/src/components/ui/AnalyticsCard";
import { AlertTriangle, CheckCircle2, Lightbulb, Loader2, Wrench, Check} from "lucide-react";
import NeonBorder from "@/src/components/ui/NeonBorder";
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
}

function kindIcon(kind: InsightFeedbackKind) {
  switch (kind) {
    case "issue":
      return <AlertTriangle className="text-red-400" size={18} />;
    case "improvement":
      return <Wrench className="text-yellow-400" size={18} />;
    case "praise":
      return <CheckCircle2 className="text-green-400" size={18} />;
  }
}

export default function InsightPanel({ analysis, status = "idle", errorMessage }: InsightPanelProps) {
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
                          color="green" 
                          infoTooltip={codeQualityTooltip}
                          loading={status === "loading" ? true : false}
                        />
                        <AnalyticsCard 
                          title="Performance" 
                          score={performance} 
                          description={performanceSummary} 
                          color="orange" 
                          infoTooltip={performanceTooltip}
                          loading={status === "loading" ? true : false}
                        />
                        <AnalyticsCard 
                          title="Best Practices" 
                          score={bestPractices} 
                          description={bestPracticesSummary} 
                          color="blue" 
                          infoTooltip={bestPracticesTooltip}
                          loading={status === "loading" ? true : false}
                        />
          
      </div>

      {/* 3. AI Suggestion (UI only) */}
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
            onClick={() => {}}
            className="inline-flex shrink-0 items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold text-orange-400 hover:bg-orange-500/10 hover:text-orange-300"
            aria-label="Apply fix"
          >
            <span>Apply Fix</span>
            <Check size={14} className="opacity-80" aria-hidden="true" />
          </button>
        </div>

        <div className="px-4 pb-4">
          <p className="text-sm text-muted-foreground dark:text-muted leading-relaxed whitespace-pre-wrap break-words">
            {suggestion}
            
          </p>
        </div>
        
      </div>
    </section>
  );
}