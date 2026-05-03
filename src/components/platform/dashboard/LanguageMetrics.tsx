import React from 'react'
import ProgressBar from "@/src/components/ui/ProgressBar";

interface LanguageMetricsProps {
  language: string;
  score: number;
  maxScore: number;
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
    <div className="flex flex-col bg-muted/20 backdrop-blur-lg rounded-xl w-full h-full p-4 shadow-sm">
        <h1 className="text-xl font-bold">Language Focus</h1>
        <div className="flex flex-col gap-4 w-auto h-auto">
            {languages.map((language, index) => (
                <div key={`${language.language}-${index}`} className="flex flex-col gap-1">
                    <div className="flex flex-row justify-start items-center gap-4">
                        <h2 className="text-lg font-bold">{language.language}</h2>
                        <p className="text-sm text-muted-foreground">{language.score}%</p>
                    </div>
                    <ProgressBar value={language.score} max={100} height={12} fill="#22c55e" />
                    <p className="text-sm text-muted-foreground">{language.description}</p>
                </div>
            ))}
        </div>
    </div>
  )
}