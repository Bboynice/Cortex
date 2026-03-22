// src/components/platform/editor/CodeWindow.tsx
'use client';

import React, { useState } from 'react';
import CodeEditor from '@/src/components/platform/editor/CodeEditor';
import { ErrorIndicator } from '@/src/components/ui/errorIndicator';
import TerminalOutput from '@/src/components/platform/editor/TerminalOutput';
import { useModalStore } from '@/src/hooks/use-modal-store';

type SupportedLanguage = 'javascript' | 'python' | 'rust';

interface CodeWindowProps {
  language: SupportedLanguage;
  code: string;
  onChange: (code: string) => void;
  onRun?: (code: string) => void;
  logs: string[];
}

const languageToExtension = {
  javascript: 'js',
  python: 'py',
  rust: 'rs',
};

const CodeWindow = ({ language, code, onChange, onRun, logs}: CodeWindowProps) => {
  const [cursorPos, setCursorPos] = useState<{ lineNumber: number; column: number }>({ lineNumber: 1, column: 1 });
  const [issueCounts, setIssueCounts] = useState<{ errors: number; warnings: number }>({ errors: 0, warnings: 0 });
  const [modal, setModal] = useState<{ errors: number; warnings: number }>({ errors: 0, warnings: 0 });
  

  const footerStatus =
    issueCounts.errors > 0
      ? { color: 'red-500' as const, label: `${issueCounts.errors} error${issueCounts.errors === 1 ? '' : 's'}` }
      : issueCounts.warnings > 0
        ? { color: 'yellow-500' as const, label: `${issueCounts.warnings} warning${issueCounts.warnings === 1 ? '' : 's'}` }
        : { color: 'green-500' as const, label: 'No issues' };

  const {onOpen} = useModalStore();

  return (
    <div className="flex h-full min-h-0 flex-1 min-w-0 flex-col overflow-hidden dark:bg-foreground text-content">
      <div className="flex w-full shrink-0 items-center justify-center border-b-1 dark:border-accent">
        <div className="flex w-full min-w-0 items-center justify-between gap-2 py-2 px-8">
          <div className="flex items-center gap-2 ">
            <div className="flex gap-1.5">
              <ErrorIndicator color="red-500" size={3} />
              <ErrorIndicator color="yellow-500" size={3} />
              <ErrorIndicator color="green-500" size={3} />
            </div>
            <span className="ml-2 font-mono text-sm font-semibold text-white">solution.{languageToExtension[language]}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onRun?.(code)}
              disabled={!onRun}
              className="inline-flex h-8 items-center justify-center gap-2 rounded-[8px] bg-accent px-4 text-sm font-semibold text-content hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Run</span>
            </button>
            <button
              type="button"
              onClick={() => onOpen("save-code", { currentCode: code })}
              className="inline-flex h-8 items-center justify-center gap-2 rounded-[8px] bg-primary px-4 text-sm font-semibold text-primary-foreground hover:brightness-110 active:brightness-95"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span>Submit</span>
            </button>
          </div>

        </div>
      </div>

      {/* Main Editor Area */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
         <CodeEditor
           code={code}
           onChange={onChange}
           language={language}
           onCursorPositionChange={setCursorPos}
           onMarkersChange={(markers) => {
             const errors = markers.filter((m) => m.severity === 8).length; // MarkerSeverity.Error
             const warnings = markers.filter((m) => m.severity === 4).length; // MarkerSeverity.Warning
             setIssueCounts({ errors, warnings });
           }}
         />
      </div>

      <TerminalOutput logs={logs} />

      {/* Window Footer */}
      <div className="flex w-full shrink-0 items-center justify-between border-t-1 dark:border-accent px-4 py-2 font-mono text-xs">
        <div className="flex items-center gap-2">
          <ErrorIndicator color={footerStatus.color} size={2} />
          <span>{footerStatus.label}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{language.charAt(0).toUpperCase() + language.slice(1).toLowerCase()}</span>
          <span>Ln {cursorPos.lineNumber}, Col {cursorPos.column}</span>
        </div>
      </div>
    </div>
  );
};

export default CodeWindow;