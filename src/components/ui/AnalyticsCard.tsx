// src/components/ui/AnalyticsCard.tsx
"use client";

import { Info } from "lucide-react";
import { motion } from "framer-motion";
import ProgressBar from "./ProgressBar";

interface AnalyticsCardProps {
  title: string;
  score: number;
  maxScore?: number;
  description: string;
  /** Optional override. If omitted, color is derived from the score (green / yellow / red, matching Badge). */
  color?: string;
  infoTooltip?: string;
  loading?: boolean;
}

// Matches Badge variants — same green / yellow / red tokens (tailwind *-700).
const SCORE_COLORS = {
  success: "#15803d", // green-700
  warning: "#a16207", // yellow-700
  error: "#b91c1c",   // red-700
} as const;

function colorForScore(score: number, max: number): string {
  const pct = (score / max) * 100;
  if (pct >= 80) return SCORE_COLORS.success;
  if (pct >= 50) return SCORE_COLORS.warning;
  return SCORE_COLORS.error;
}

export default function AnalyticsCard({
  title,
  score,
  maxScore = 100,
  description,
  color,
  infoTooltip,
  loading = false,
}: AnalyticsCardProps) {
  const resolvedColor = color ?? colorForScore(score, maxScore);

  return (
    <div className={`flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm ${loading ? "blur-sm opacity-50 shadow-white" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-content">{title}</h3>
        {infoTooltip ? (
          <button
            type="button"
            title={infoTooltip}
            aria-label={infoTooltip}
            className="inline-flex items-center rounded-sm text-muted-foreground cursor-help"
          >
            <Info size={16} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <motion.span className={`text-3xl font-bold ${loading ? "backdrop-blur-lg" : ""}`} style={{ color: resolvedColor }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}> {score}</motion.span>
        <span className="text-muted-foreground">/{maxScore}</span>
      </div>

      <ProgressBar value={score} max={maxScore} fill={resolvedColor} className="mb-2" />

      <motion.p className="text-sm text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}>{description}</motion.p>
    </div>


  );
}