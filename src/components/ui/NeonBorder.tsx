"use client";

import { motion, Variants } from "framer-motion";

interface NeonBeamProps {
  colorClass?: string;
  duration?: number;
  type?: "bottom" | "border";
  rounded?: RoundedPreset | number;
  rainbow?: boolean;
}

type RoundedPreset =
  | "rounded-none"
  | "rounded-xs"
  | "rounded-sm"
  | "rounded-md"
  | "rounded-lg"
  | "rounded-xl"
  | "rounded-2xl"
  | "rounded-3xl"
  | "rounded-4xl";

const ROUNDED_TO_PX: Record<RoundedPreset, number> = {
  "rounded-none": 0,
  "rounded-xs": 2,
  "rounded-sm": 4,
  "rounded-md": 6,
  "rounded-lg": 8,
  "rounded-xl": 12,
  "rounded-2xl": 16,
  "rounded-3xl": 24,
  "rounded-4xl": 32,
};

export default function NeonBeam({ 
  colorClass = "via-cyan-400", 
  duration = 3,
  type = "bottom",
  rounded = "rounded-none",
  rainbow = true,
}: NeonBeamProps) {
  const borderColorClass = colorClass.replace("via-", "text-");
  const roundedPx = typeof rounded === "number" ? rounded : ROUNDED_TO_PX[rounded];

  // 3. Use Array Syntax for the filter to guarantee the loop works
  const borderVariants: Variants = {
    initial: { 
      pathLength: 0.3, // Beam is 30% of total length
      pathOffset: 0, 
      filter: "hue-rotate(0deg)",
      opacity: 0 
    },
    animate: { 
      pathOffset: 1, 
      // Cycling from 0 to 360 ensures a perfect loop
      filter: rainbow ? ["hue-rotate(0deg)", "hue-rotate(360deg)"] : "hue-rotate(0deg)",
      opacity: 1,
      transition: { 
        duration: duration, 
        ease: "linear", 
        repeat: Infinity 
      } 
    }
  };

  const lineVariants: Variants = {
    initial: { 
      x: "-100%", 
      filter: "hue-rotate(0deg)" 
    },
    animate: { 
      x: "100%", 
      filter: rainbow ? ["hue-rotate(0deg)", "hue-rotate(360deg)"] : "hue-rotate(0deg)",
      transition: { 
        duration: duration, 
        ease: "linear", 
        repeat: Infinity,
        repeatDelay: 0.5 
      }
    }
  };

  // --- MODE 1: BOTTOM LINE ---
  if (type === "bottom") {
    return (
      <>
        <motion.div
          className={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent ${colorClass} to-transparent z-20`}
          variants={lineVariants}
          initial="initial"
          animate="animate"
        />
        <motion.div
          className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${colorClass} to-transparent blur-sm z-10`}
          variants={lineVariants}
          initial="initial"
          animate="animate"
        />
      </>
    );
  }

  return (
    <div className="absolute inset-0 z-10 pointer-events-none rounded-[inherit] overflow-hidden">
      <svg className="absolute w-full h-full top-0 left-0" suppressHydrationWarning>
        {/* Background Trace (Optional) */}
        <rect
          width="100%"
          height="100%"
          rx={roundedPx}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-white/10 dark:text-white/5" 
        />

        <motion.rect
          width="100%"
          height="100%"
          rx={roundedPx}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={borderColorClass}
          variants={borderVariants}
          initial="initial"
          animate="animate"
        />

        <motion.rect
          width="100%"
          height="100%"
          rx={roundedPx}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${borderColorClass} blur-[2px]`}
          variants={borderVariants}
          initial="initial"
          animate="animate"
        />

      </svg>
    </div>
  );
}