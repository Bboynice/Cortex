import React from 'react'
import { BarChart3 } from 'lucide-react';
import ProgressBar from "@/src/components/ui/ProgressBar";

interface LanguageMetricsProps {
  language: string;
  score: number;
  maxScore: number;
}

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

export default function LanguageMetrics({ language, score, maxScore }: LanguageMetricsProps) {
    const languages = [
        { language: "Python", score: 22 , description: "Python is a versatile programming language that is easy to learn and use."},
        { language: "JavaScript", score: 44 , description: "JavaScript is a versatile programming language that is easy to learn and use."},
        { language: "Java", score: 12 , description: "Java is a versatile programming language that is easy to learn and use."},
        { language: "C++", score: 33 , description: "C++ is a versatile programming language that is easy to learn and use."},
        { language: "C", score: 20 , description: "C is a versatile programming language that is easy to learn and use."},
    ]

    return (
        <div className="flex flex-col dark:bg-muted/20 backdrop-blur-lg rounded-xl w-full h-full min-h-0 p-4 shadow-sm">
            <div className="flex items-center gap-2 h-7 mb-3 px-1 shrink-0">
                <BarChart3 className="dark:text-primary" size={18} aria-hidden="true" />
                <h3 className="text-sm font-semibold uppercase tracking-wider dark:text-muted-foreground">
                    Language Focus
                </h3>
            </div>

            <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto pr-1">
                {languages.map((lang, index) => {
                    const fill = colorForScore(lang.score, 100);
                    return (
                        <div
                            key={`${lang.language}-${index}`}
                            className="flex flex-col gap-2 rounded-xl border dark:border-border dark:bg-card p-4 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium dark:text-content">{lang.language}</h4>
                                <div className="flex items-baseline gap-1">
                                    <span
                                        className="text-2xl font-bold"
                                        style={{ color: fill }}
                                    >
                                        {lang.score}
                                    </span>
                                    <span className="text-xs dark:text-muted-foreground">/100</span>
                                </div>
                            </div>
                            <ProgressBar value={lang.score} max={100} height={8} fill={fill} />
                            <p className="text-sm dark:text-muted-foreground">{lang.description}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
