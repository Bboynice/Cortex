// src/components/ui/AnalyticsCard.tsx
import { Info, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface AnalyticsCardProps {
  title: string;
  score: number;
  maxScore?: number;
  description: string;
  color?: "green" | "orange" | "blue"; // Limit to your theme colors
  infoTooltip?: string;
  loading?: boolean;
}

const colorMap = {
  green: { text: "text-green-500", bg: "bg-green-500" },
  orange: { text: "text-orange-500", bg: "bg-orange-500" },
  blue: { text: "text-blue-500", bg: "bg-blue-500" },
};

export default function AnalyticsCard({
  title,
  score,
  maxScore = 100,
  description,
  color = "green",
  infoTooltip,
  loading = false,
}: AnalyticsCardProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const theme = colorMap[color];

  return (
    <div className={`flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm ${loading ? "blur-sm opacity-50 shadow-white" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-content">{title}</h3>
          <span title={infoTooltip} className="inline-flex">
            <Info size={16} className="text-muted-foreground cursor-help" aria-hidden="true" />
          </span>
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <motion.span className={`text-3xl font-bold ${loading ? "backdrop-blur-lg" : ""} ${theme.text}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}> {score}</motion.span>
        <span className="text-muted-foreground">/{maxScore}</span>
      </div>

      {/* Simple Progress Bar */}
      <div className="h-2 w-full rounded-full bg-muted mb-2 overflow-hidden">
        <motion.div
          className={`h-full rounded-full transition-all duration-500 ${theme.bg}`}
          style={{ width: `${percentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
        </motion.div>
      </div>

      <motion.p className="text-sm text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, ease: "easeInOut" }}>{description}</motion.p>
    </div>


  );
}