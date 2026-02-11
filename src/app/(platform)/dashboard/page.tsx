'use client';

import { generateCodingChallenge } from './actions';
import { useState } from 'react';
import MyButton from '@/src/components/ui/GlowButton/GlowButton';
import DropdownMenu from '@/src/components/ui/dropdown';
import { Badge } from '@/src/components/ui/badge';
import TaskInstructions from '@/src/components/platform/editor/TaskInstructions';

export default function AppHome() {
  const [challenge, setChallenge] = useState<string | undefined>(undefined);
  const [requirements, setRequirements] = useState<string[] | undefined>(undefined);
  const [hints, setHints] = useState<{ title: string; description: string }[] | undefined>(undefined);
  const [estimatedTime, setEstimatedTime] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<"javascript" | "python" | "rust">("javascript");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");

  const languageChoices = [
    { value: "javascript" as const, label: "JavaScript" },
    { value: "python" as const, label: "Python" },
    { value: "rust" as const, label: "Rust" },
  ];
  const difficultyChoices = [
    { value: "easy" as const, label: "Easy" },
    { value: "medium" as const, label: "Medium" },
    { value: "hard" as const, label: "Hard" },
  ];

  async function handleGenerate() {
    setLoading(true);
    
    // Call the server action directly
    const result = await generateCodingChallenge({ language, difficulty });
    
    if (result.success) {
      setChallenge(result.challenge ?? "No challenge found");
      setRequirements(result.requirements ?? []);
      setHints(result.hints ?? []);
      setEstimatedTime(result.estimatedTime ?? 0);
    } else {
      alert("Error generating challenge");
    }
    
    setLoading(false);
  }
  return (
   <main className=" flex flex-col min-h-screen w-full">
      <div className="flex min-h-[4em] w-full border-b-1 dark:border-accent dark:bg-background dark:text-content items-center justify-start">
        <div className="w-1/3 h-auto flex justify-center items-center flex-row gap-2">
          <div className="w-[90%] h-auto flex justify-between items-center flex-row gap-2">
            <MyButton  onClick={handleGenerate}>
              {loading ? "Generating..." : "Generate"}
            </MyButton>
            <DropdownMenu
              choices={languageChoices}
              value={language}
              onChange={setLanguage}
              placeholder="Language"
            />
            <DropdownMenu
              choices={difficultyChoices}
              value={difficulty}
              onChange={setDifficulty}
              placeholder="Difficulty"
            />
          </div>
        </div>


        

        
      </div>

        <TaskInstructions
          challenge={challenge}
          requirements={requirements}
          hints={hints}
          estimatedTime={estimatedTime}
        />
      
   </main>
  );
}
