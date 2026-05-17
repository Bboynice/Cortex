"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document === "undefined") return "dark";
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Sync with the theme chosen by the script in root layout
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    const root = document.documentElement;
    if (nextTheme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("cortex-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("cortex-theme", "light");
    }
  };

  // Keep `ThemeContext.Provider` on every render so hooks like `useCortexTheme` never run outside
  // the provider (e.g. CodeEditor during the pre-mount "invisible" boot phase).
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {!mounted ? <div className="invisible">{children}</div> : children}
    </ThemeContext.Provider>
  );
}

// Hook for your Editor, Metrics, and Toggle button to interact with the system
export function useCortexTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useCortexTheme must be used within ThemeProvider");
  return context;
}