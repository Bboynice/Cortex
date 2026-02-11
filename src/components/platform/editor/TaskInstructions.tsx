interface TaskInstructionsProps {
  challenge?: string;
  requirements?: string[];
  hints?: { title: string; description: string }[];
  estimatedTime?: number;
}

export default function TaskInstructions({ 
  challenge = "No challenge found",
  requirements = [],
  hints = [],
  estimatedTime = 0,
}: TaskInstructionsProps) {

  return (
    <div className="dark:bg-foreground dark:text-content w-1/3 h-auto flex flex-col items-center gap-4 dark:border-r-1 dark:border-accent">
        <div className="w-full flex border-b-1 dark:border-accent justify-center items-center">
          <div className="dark:text-muted-foreground w-[90%] h-auto py-2 ">AI Task Generator</div>
        </div>
        <div className=" p-4 rounded-md border-1 dark:border-accent dark:bg-background text-content w-[90%] h-auto">
          <p className="text-lg font-semi-bold dark:text-primary">Challenge:</p>
          <p className="dark:text-muted-foreground">{challenge}</p>
          <p className="text-lg font-semi-bold dark:text-primary">Requirements:</p>
          <div className="flex flex-col gap-2">
            <ul className="list-disc list-inside space-y-1 dark:text-muted">
              {(requirements.length ? requirements : ["No requirements found"]).map((requirement, idx) => (
                <li key={`${idx}-${requirement}`}>{requirement}</li>
              ))}
            </ul>
        </div>
      </div>
      <div className="w-full justify-center items-center flex flex-col w-full h-auto">
        <div className="h-auto w-[90%] flex justify-center items-center flex-col gap-4 dark:border-b-1 dark:border-border pb-4">
          {hints.map((hint, idx) => (
            <div className="w-full flex justify-center items-center flex-row gap-4">
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
                <div key={`${idx}-${hint.title}`} className="w-full flex justify-center flex-col">
                  <h1 className="text-lg font-semi-bold dark:text-muted-foreground">{hint.title}</h1>
                  <p className="text-sm text-muted">{hint.description}</p>
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
          <p className="text-sm dark:text-muted">{estimatedTime} minutes</p>
        </div>
      </div>
    </div>
  );
}