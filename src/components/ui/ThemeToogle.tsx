"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("cortex-theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(systemPrefersDark ? "dark" : "light");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("cortex-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("cortex-theme", "light");
    }
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <div
        className="flex min-h-[2.25rem] min-w-[2.25rem] shrink-0 items-center justify-center self-stretch rounded-lg border border-white/10 bg-white/5 px-3"
        aria-hidden
      />
    );
  }

  const isDark = theme === "dark";

  const springTransition = {
    type: "spring",
    stiffness: 180,
    damping: 14,
    mass: 0.8
  } as const; // Fixed TS assignment error automatically

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      // Added a tooltip using native HTML title attribute for 100% clarity on hover
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="relative flex min-h-[2.25rem] min-w-[2.25rem] shrink-0 items-center justify-center self-stretch rounded-lg border border-white/10 bg-white/5 px-3 transition-colors hover:bg-white/10 group"
      aria-label="Toggle system core engine theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        <svg
          width="22"
          height="22"
          viewBox="0 0 100 100"
          className="block overflow-visible"
        >
          {/* OUTER RING: Moon Arc vs Sun Rays */}
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            strokeWidth="7"
            fill="none"
            pathLength={100}
            style={{ transformOrigin: "50px 50px" }}
            animate={{ 
              rotate: isDark ? -40 : 140,
              // Dark: 1 long crescent line (65 length) | Light: 4 split radiating ray segments (8 length each)
              strokeDasharray: isDark ? "65 35" : "8 17",
              stroke: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(232, 80, 2, 0.6)"
            }}
            transition={springTransition}
            strokeLinecap="round"
          />

          {/* MIDDLE RING: Structural depth alignment */}
          <motion.circle
            cx="50"
            cy="50"
            r="26"
            strokeWidth="8"
            fill="none"
            pathLength={100}
            style={{ transformOrigin: "50px 50px" }}
            animate={{ 
              rotate: isDark ? 50 : -130,
              // Dark: Clean balancing crescent wrap | Light: Tighter inner burst flares
              strokeDasharray: isDark ? "55 45" : "6 19",
              stroke: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(232, 80, 2, 0.8)"
            }}
            transition={springTransition}
            strokeLinecap="round"
          />

          {/* INNER CORE: Dark Horizon vs Sunny Core */}
          <motion.circle
            cx="50"
            cy="50"
            r="11"
            strokeWidth="8"
            fill="none"
            pathLength={100}
            style={{ transformOrigin: "50px 50px" }}
            animate={{ 
              rotate: isDark ? -90 : 270,
              // Dark: Becomes a closed dark circle | Light: Becomes a solid bright core center
              strokeDasharray: isDark ? "100 0" : "100 0",
              stroke: isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(232, 80, 2, 1)",
              scale: isDark ? 0.9 : 1.1 // Core expands slightly when sun activates
            }}
            transition={springTransition}
          />
        </svg>
      </div>
    </button>
  );
}