'use client';

import { generateCodingChallenge } from './actions';
import { useState } from 'react';
import MyButton from '@/src/components/ui/GlowButton/GlowButton';
import DropdownMenu from '@/src/components/ui/dropdown';
import { Badge } from '@/src/components/ui/badge';
import TaskInstructions from '@/src/components/platform/editor/TaskInstructions';
import CodeWindow from '@/src/components/platform/editor/CodeWindow';

export default function AppHome() {
  type Language = "javascript" | "python" | "rust";

  const [challenge, setChallenge] = useState<string | undefined>(undefined);
  const [requirements, setRequirements] = useState<string[] | undefined>(undefined);
  const [hints, setHints] = useState<{ title: string; description: string }[] | undefined>(undefined);
  const [estimatedTime, setEstimatedTime] = useState<number | undefined>(undefined);
  const [generatedLanguageLabel, setGeneratedLanguageLabel] = useState<string | undefined>(undefined);
  const [generatedDifficultyLabel, setGeneratedDifficultyLabel] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<Language>("javascript"); // dropdown selection
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [editorLanguage, setEditorLanguage] = useState<Language>("javascript"); // active editor language

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
  const startCode: Record<Language, string> = {
    javascript: `function sumEvenNumbers(arr) {
  // Your code here
  return 0;
}`,
    python: `def sum_even_numbers(arr):
  # Your code here
  return 0`,
    rust: `fn sum_even_numbers(arr: &[i32]) -> i32 {
  // Your code here
  return 0;
}`,
  };
  const [code, setCode] = useState<string>(startCode.javascript);

  async function handleGenerate() {
    // Reset editor only when Generate is clicked (not when dropdown changes)
    setEditorLanguage(language);
    setCode(startCode[language]);

    setLoading(true);
    
    // Call the server action directly
    const result = await generateCodingChallenge({ language, difficulty });
    
    if (result.success) {
      setChallenge(result.challenge ?? "No challenge found");
      setRequirements(result.requirements ?? []);
      setHints(result.hints ?? []);
      setEstimatedTime(result.estimatedTime ?? 0);

      setGeneratedLanguageLabel(languageChoices.find((c) => c.value === language)?.label ?? undefined);
      setGeneratedDifficultyLabel(difficultyChoices.find((c) => c.value === difficulty)?.label ?? undefined);
    } else {
      alert("Error generating challenge");
    }
    
    setLoading(false);
  }
  return (
   <main className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <div className="flex min-h-[4em] w-full shrink-0 items-center justify-start border-b-1 dark:border-accent dark:bg-background dark:text-content">
        <div className="w-1/3 h-auto flex justify-center items-center flex-row gap-2">
          <div className="w-[90%] h-auto flex justify-between items-center flex-row gap-2">
            <MyButton effect="glow" onClick={handleGenerate}>
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
      <div className="flex w-full flex-1 min-h-0 items-stretch overflow-hidden">
          <TaskInstructions
              challenge={challenge}
              requirements={requirements}
              hints={hints}
              estimatedTime={estimatedTime}
              languageLabel={generatedLanguageLabel}
              difficultyLabel={generatedDifficultyLabel}
            />
            <CodeWindow language={editorLanguage} code={code} onChange={setCode} />
      </div>

      
   </main>
  );
}
