// src/components/ui/ProgressBar.tsx
"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  max?: number;
  /** Any CSS background value: hex, rgb, hsl, var(--...), or a gradient. Defaults to green. */
  fill?: string;
  /** Any CSS background value for the track. */
  track?: string;
  /** Bar thickness. Number = pixels (e.g. 8, 16). String = any CSS size ("0.5rem", "12px"). Defaults to 8px. */
  height?: number | string;
  className?: string;
  duration?: number;
  animate?: boolean;
}

const DEFAULT_FILL = "rgb(34 197 94)"; // tailwind green-500
const DEFAULT_TRACK = "rgb(229 231 235 / 0.15)"; // soft muted track
const DEFAULT_HEIGHT = 8; // matches old h-2

export default function ProgressBar({
  value,
  max = 100,
  fill = DEFAULT_FILL,
  track = DEFAULT_TRACK,
  height = DEFAULT_HEIGHT,
  className = "",
  duration = 1.5,
  animate = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      style={{ background: track, height: resolvedHeight }}
      className={`w-full rounded-full overflow-hidden ${className}`}
    >
      <motion.div
        className="h-full rounded-full"
        style={{ background: fill }}
        initial={animate ? { width: 0 } : false}
        animate={{ width: `${percentage}%` }}
        transition={{ duration, ease: "easeInOut" }}
      />
    </div>
  );
}
