'use client';

import React from 'react'
import { Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MissionCard from './MissionCard';
import GlowButton from '../../ui/GlowButton/GlowButton';

const LANG_MAP: Record<"JS" | "Py" | "Rs", "javascript" | "python" | "rust"> = {
    JS: "javascript",
    Py: "python",
    Rs: "rust",
};

const DIFF_MAP: Record<"Easy" | "Medium" | "Hard", "easy" | "medium" | "hard"> = {
    Easy: "easy",
    Medium: "medium",
    Hard: "hard",
};

const missions = [
    { title: "FizzBuzz", description: "Return Fizz, Buzz, or FizzBuzz for multiples up to N", duration: "15 min", points: 50, difficulty: "Easy", lang: "JS" },
    { title: "Palindrome Checker", description: "Detect whether a string reads the same backwards", duration: "15 min", points: 50, difficulty: "Easy", lang: "JS" },
    { title: "Flatten Nested Array", description: "Recursively flatten arrays of arbitrary depth", duration: "20 min", points: 75, difficulty: "Medium", lang: "JS" },
    { title: "Anagram Detector", description: "Check if two strings are anagrams of each other", duration: "25 min", points: 90, difficulty: "Medium", lang: "JS" },
    { title: "Two Sum", description: "Find two indices whose values add up to a target", duration: "35 min", points: 120, difficulty: "Hard", lang: "JS" },
  ];

export default function DailyChallenges() {
    const router = useRouter();

    function startMission(mission: { title: string; difficulty: string; lang: string }) {
        const params = new URLSearchParams({
            autoGenerate: "1",
            title: mission.title,
            diff: DIFF_MAP[mission.difficulty as "Easy" | "Medium" | "Hard"],
            lang: LANG_MAP[mission.lang as "JS" | "Py" | "Rs"],
        });
        router.push(`/playground?${params.toString()}`);
    }

    return (
        <div className="theme-sync flex h-full min-h-0 w-full flex-col rounded-xl bg-muted/20 p-4 shadow-sm backdrop-blur-lg">
            <div className="mb-3 flex h-7 shrink-0 items-center gap-2 px-1">
                <Sparkles className="text-primary" size={18} aria-hidden="true" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Daily Challenges
                </h3>
            </div>
            <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto pr-1">
                {missions.map((mission, index) => (
                    <MissionCard
                        key={`${mission.title}-${index}`}
                        title={mission.title}
                        description={mission.description}
                        duration={mission.duration}
                        points={mission.points}
                        difficulty={mission.difficulty as "Medium" | "Hard" | "Easy"}
                        lang={mission.lang as "JS" | "Py" | "Rs"}
                        onStart={() => startMission(mission)}
                    />
                ))}
            </div>
            <div className="shrink-0 pt-6 w-full">
                <GlowButton
                    color="primary"
                    roundness={12}
                    effect="glow"
                    className="w-full"
                    onClick={() => router.push('/playground?autoGenerate=1')}
                >
                    Generate more missions
                </GlowButton>
            </div>
        </div>
    )
}
