import React from 'react'
import MissionCard from './MissionCard';
const missions = [
    { title: "Array Sorting Algorithm", description: "Implement a custom sorting function", duration: "20 min", points: 75, difficulty: "Medium", lang: "JS" },
    { title: "Data Structure Challenge", description: "Build a binary search tree", duration: "35 min", points: 120, difficulty: "Hard", lang: "Py" },
    { title: "Memory Management", description: "Optimize resource allocation", duration: "15 min", points: 50, difficulty: "Easy", lang: "Rs" },
  ];
export default function DailyChallenges() {
    return (
        <div className="flex flex-col bg-muted/20 backdrop-blur-lg rounded-xl w-full h-full p-4 shadow-sm">
            <h1>Daily Challenges</h1>
            <div className="space-y-3">
                {missions.map((mission) => (
                    <MissionCard key={mission.title} title={mission.title} description={mission.description} duration={mission.duration} points={mission.points} difficulty={mission.difficulty as "Medium" | "Hard" | "Easy"} lang={mission.lang as "JS" | "Py" | "Rs"} />
                ))}
            </div>
        </div>
    )
}