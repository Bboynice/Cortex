import Pill from "@/src/components/ui/Pill";
import { Loader2 } from "lucide-react";
import NeonBorder from "@/src/components/ui/NeonBorder";
import CortexLoader from "@/src/components/ui/CortexLoader";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TaskInstructionsProps {
  challenge?: string;
  requirements?: string[];
  hints?: { title: string; description: string }[];
  estimatedTime?: number;
  languageLabel?: string;
  difficultyLabel?: string;
  isGenerating?: boolean;
  isGenerated?: boolean;
  testCases?: { input: string; output: string }[];
}

export default function TaskInstructions({ 
  challenge = "Generate a new task",
  requirements = ["Follow the instructions", "Here will be the requirements"],
  hints = [{ title: "Here might be some hints", description: "" }],
  estimatedTime = 0,
  languageLabel,
  difficultyLabel,
  isGenerating = false,
  isGenerated = false,
  testCases = [],
}: TaskInstructionsProps) {
  const [showTestCases, setShowTestCases] = useState(false);
  return (
    <div className="m-4 flex w-1/3 shrink-0 self-start h-fit flex-col items-center overflow-hidden rounded-lg border-1 dark:border-border dark:bg-surface dark:text-content">
        <div className={`w-full h-12 flex justify-center items-center pl-4 pr-4 shrink-0`}>
        <div className="w-full flex min-w-0 justify-between items-center gap-2">
          <div className="dark:text-muted-foreground h-auto py-2 shrink-0">AI Task Generator</div>
          <div className="w-auto h-auto flex min-w-0 flex-wrap items-center justify-end gap-2">
            {languageLabel && <Pill text={languageLabel} variant="content" />}
            {difficultyLabel && <Pill text={difficultyLabel} variant="primary" />}
          </div>
        </div>
        </div>
       
        <div className="w-full h-auto p-4">
        <div className="w-full h-auto p-4 rounded-md border dark:border-border bg-cortex-heat dark:text-content ">
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
      <div className="w-full justify-start items-center flex flex-col w-full h-auto p-4">
        <div className="h-auto w-full flex justify-center items-center flex-col gap-4 border-b dark:border-border pb-4">
          {hints.map((hint, idx) => (
            <div key={`${idx}-${hint.title}`} className="w-full flex h-auto justify-center items-center flex-row gap-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    className="shrink-0 dark:text-primary"
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
                        <p className="text-sm dark:text-muted">{hint.description}</p>
                      </>
                    )}
                  </div>
            </div>
          ))}
        </div>
        <div className="flex w-full justify-start items-center h-auto items-center flex-row gap-1 py-2">
          <div className="flex justify-start items-center flex-row gap-1 w-1/2">
          <svg
            className="h-[1.15em] w-[1.15em] dark:text-content/70"
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
            {isGenerating ? <CortexLoader size={3} /> : 
            <p className="text-sm dark:text-content/50">{estimatedTime} minutes</p>
            }
            </div>
            {isGenerated && !isGenerating && (
              <p
                onClick={() => setShowTestCases(!showTestCases)}
                className="text-sm dark:text-content/50 w-1/2 justify-end items-end flex hover:text-primary transition-colors hover:underline cursor-pointer select-none"
              >
                {showTestCases ? "Hide" : "See"} Test Cases
              </p>
            )}
        </div>
      </div>
      <AnimatePresence initial={false}>
        {isGenerated && showTestCases && !isGenerating &&(
          <motion.div
            key="test-cases"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full overflow-hidden"
          >
            <div className="w-[calc(100%-2rem)] mx-4 mb-4 flex flex-col items-start justify-start gap-1 p-4 border dark:border-border rounded-md bg-none dark:text-content">
              <div className="text-lg font-semibold dark:text-white">Test Cases:</div>
              {testCases.map((testCase, idx) => (
                <div key={`${idx}-${testCase.input}`} className="flex flex-row gap-2">
                  <div className="text-sm dark:text-content/50">Input: <b className="text-sm font-mono">{testCase.input}</b></div>
                  <div className="text-sm dark:text-content/50">Output: <b className="text-sm font-mono">{testCase.output}</b></div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
} 