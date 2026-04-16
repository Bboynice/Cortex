import Pill from "@/src/components/ui/Pill";
import { Loader2 } from "lucide-react";
import NeonBorder from "@/src/components/ui/NeonBorder";
import CortexLoader from "@/src/components/ui/CortexLoader";

interface TaskInstructionsProps {
  challenge?: string;
  requirements?: string[];
  hints?: { title: string; description: string }[];
  estimatedTime?: number;
  languageLabel?: string;
  difficultyLabel?: string;
  isGenerating?: boolean;
}

export default function TaskInstructions({ 
  challenge = "Generate a new task",
  requirements = ["Follow the instructions", "Here will be the requirements"],
  hints = [{ title: "Here might be some hints", description: "" }],
  estimatedTime = 0,
  languageLabel,
  difficultyLabel,
  isGenerating = false,
}: TaskInstructionsProps) {
  return (
    <div className={`dark:bg-foreground dark:text-content flex h-full w-1/3 shrink-0 flex-col items-center gap-4 overflow-hidden dark:border-r-1 dark:border-border `}>
        <div className={`w-full h-12 flex justify-center items-center border-b-1 dark:border-border `}>
        <div className="w-[90%] flex min-w-0 justify-between items-center gap-2">
          <div className="dark:text-muted-foreground h-auto py-2 shrink-0">AI Task Generator</div>
          <div className="w-auto h-auto flex min-w-0 flex-wrap items-center justify-end gap-2">
            {languageLabel && <Pill text={languageLabel} variant="content" />}
            {difficultyLabel && <Pill text={difficultyLabel} variant="primary" />}
          </div>
        </div>
        </div>
       
        <div className="w-full flex-1 min-h-0 overflow-auto ">
        <div className="mx-auto mt-4 w-[90%] h-auto p-4 rounded-md border border-border bg-cortex-heat text-content">
          <p className="text-lg font-semibold dark:text-white">Challenge:</p>
         {isGenerating ?  <CortexLoader size={3} /> : <p className="dark:text-white/70">{challenge}</p>}
          <p className="text-lg font-semibold dark:text-white mt-3">Requirements:</p>
          <div className="flex flex-col gap-2">
            {isGenerating ? <CortexLoader size={3} /> : 
            <ul className="list-disc list-inside space-y-1 dark:text-white/50">
              {(requirements.length ? requirements : ["No requirements found"]).map((requirement, idx) => (
                <li key={`${idx}-${requirement}`}>{requirement}</li>
              ))}
            </ul>
            }
        </div>
      </div>
      <div className="w-full justify-center items-center flex flex-col w-full h-auto mt-4">
        <div className="h-auto w-[90%] flex justify-center items-center flex-col gap-4 dark:border-b-1 dark:border-border pb-4">
          {hints.map((hint, idx) => (
            <div key={`${idx}-${hint.title}`} className="w-full flex justify-center items-center flex-row gap-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="shrink-0 text-primary"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.18" stroke="none" />
                    <path d="M8.2 12.2l2.3 2.3L15.8 9.7" />
                  </svg>
                  <div className="w-full flex justify-start flex-col">
                    {isGenerating ? (
                      <div className="py-1">
                        <CortexLoader size={3} />
                      </div>
                    ) : (
                      <>
                        <h1 className="text-lg font-semi-bold dark:text-muted-foreground">{hint.title}</h1>
                        <p className="text-sm text-muted">{hint.description}</p>
                      </>
                    )}
                  </div>
            </div>
          ))}
        </div>
        <div className="flex w-[90%] justify-start items-center h-auto items-center flex-row gap-1 py-2">
          <svg
            className="h-[1.15em] w-[1.15em] text-content/70"
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
          >
            {/* soft filled clock face */}
            <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity="0.22" />
            {/* hands (no outer border) */}
            <path
              d="M12 7.5v4.8l3.2 1.9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="1" fill="currentColor" fillOpacity="0.85" />
          </svg>
          <p className="text-sm dark:text-muted">Estimated:</p>
          {isGenerating ? <CortexLoader size={3} /> : <p className="text-sm dark:text-content/50">{estimatedTime} minutes</p>}
        </div>
      </div>
      </div>
    </div>
  );
} 