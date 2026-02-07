"use client";

import { motion, Variants } from "framer-motion";
import { useId } from "react"; 

interface NeonBeamProps {
  colorClass?: string;
  duration?: number;
  type?: "bottom" | "border";
  rounded?: number;
  rainbow?: boolean;
}

export default function NeonBeam({ 
  colorClass = "via-cyan-400", 
  duration = 3,
  type = "bottom",
  rounded = 0,
  rainbow = true,
}: NeonBeamProps) {
  
  // 2. Generate a unique ID for this specific beam's gradient
  const gradientId = useId(); 

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
          rx={rounded}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-white/10 dark:text-white/5" 
        />

        <motion.rect
          width="100%"
          height="100%"
          rx={rounded}
          fill="none"
          stroke={`url(#${gradientId})`} 
          strokeWidth="3"
          strokeLinecap="round"
          variants={borderVariants}
          initial="initial"
          animate="animate"
        />

        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}