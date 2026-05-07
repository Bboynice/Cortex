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
    { title: "Array Sorting Algorithm", description: "Implement a custom sorting function", duration: "20 min", points: 75, difficulty: "Medium", lang: "JS" },
    { title: "Data Structure Challenge", description: "Build a binary search tree", duration: "35 min", points: 120, difficulty: "Hard", lang: "Py" },
    { title: "Memory Management", description: "Optimize resource allocation", duration: "15 min", points: 50, difficulty: "Easy", lang: "Rs" },
    { title: "Memory Management", description: "Optimize resource allocation", duration: "15 min", points: 50, difficulty: "Easy", lang: "Rs" },
    { title: "Memory Management", description: "Optimize resource allocation", duration: "15 min", points: 50, difficulty: "Easy", lang: "Rs" },
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
        <div className="flex flex-col dark:bg-muted/20 backdrop-blur-lg rounded-xl w-full h-full min-h-0 p-4 shadow-sm">
            <div className="flex items-center gap-2 h-7 mb-3 px-1 shrink-0">
                <Sparkles className="dark:text-primary" size={18} aria-hidden="true" />
                <h3 className="text-sm font-semibold uppercase tracking-wider dark:text-muted-foreground">
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
            <div className="shrink-0 pt-3 w-full">
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
