// src/components/platform/editor/CodeWindow.tsx
'use client';

import React, { useState, useRef } from 'react';
import CodeEditor from '@/src/components/platform/editor/CodeEditor';
import { ErrorIndicator } from '@/src/components/ui/ErrorIndicator';
import TerminalOutput from '@/src/components/platform/editor/TerminalOutput';
import { useModalStore } from '@/src/hooks/use-modal-store';

type SupportedLanguage = 'javascript' | 'python' | 'rust';

interface CodeWindowProps {
  language: SupportedLanguage;
  code: string;
  onChange: (code: string) => void;
  onRun?: (code: string) => void;
  // Should resolve with { passed, total } so the submit modal can display the result.
  onSubmit?: (code: string) => Promise<{ passed: number; total: number } | undefined | void>;
  logs: string[];
}

const languageToExtension = {
  javascript: 'js',
  python: 'py',
  rust: 'rs',
};



const CodeWindow = ({ language, code, onChange, onRun, onSubmit, logs }: CodeWindowProps) => {
  const [cursorPos, setCursorPos] = useState<{ lineNumber: number; column: number }>({ lineNumber: 1, column: 1 });
  const [issueCounts, setIssueCounts] = useState<{ errors: number; warnings: number }>({ errors: 0, warnings: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const [terminalHeight, setTerminalHeight] = useState(112); // h-28 in pixels
  

  const footerStatus =
    issueCounts.errors > 0
      ? { color: 'red-500' as const, label: `${issueCounts.errors} error${issueCounts.errors === 1 ? '' : 's'}` }
      : issueCounts.warnings > 0
        ? { color: 'yellow-500' as const, label: `${issueCounts.warnings} warning${issueCounts.warnings === 1 ? '' : 's'}` }
        : { color: 'green-500' as const, label: 'No issues' };

  const {onOpen} = useModalStore();

  const handleSubmit = () => {
    onOpen("save-code", {
      title: "Submit Solution?",
      description: "Your code will be run against the test cases.",
      submitText: "Submit",
      cancelText: "Cancel",
      currentCode: code,
      // The modal awaits this and, if it resolves with { passed, total }, switches
      // to a results view that shows how many cases were done out of total.
      action: () => onSubmit?.(code),
    });
  };

  function startResize(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    const startY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const startHeight = terminalHeight;
  
    const HEADER = 48,
      FOOTER = 36,
      HANDLE = 6,
      EDITOR_MIN = 120,
      TERMINAL_MIN = 60;

    function onMove(ev: MouseEvent | TouchEvent) {
      const y = "touches" in ev ? ev.touches[0].clientY : ev.clientY;
      const containerH = containerRef.current?.getBoundingClientRect().height ?? 0;
      const maxTerminal = Math.max(
        TERMINAL_MIN,
        containerH - HEADER - FOOTER - HANDLE - EDITOR_MIN,
      );
      // Dragging up makes the terminal taller, so invert the delta.
      const next = Math.min(maxTerminal, Math.max(TERMINAL_MIN, startHeight + (startY - y)));
      setTerminalHeight(next);
    }
    function onUp() {
      window.removeEventListener("mousemove", onMove as any);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove as any);
      window.removeEventListener("touchend", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  
    window.addEventListener("mousemove", onMove as any);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove as any, { passive: false });
    window.addEventListener("touchend", onUp);
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  }

  return (
    <div
      ref={containerRef}
      className="theme-sync flex h-full min-h-0 min-w-0 flex-1 self-stretch flex-col overflow-hidden rounded-lg border border-border bg-card text-content"
    >
      <div className="flex h-12 w-full shrink-0 items-center justify-center border-b border-border">
        <div className="flex h-12 w-full min-w-0 items-center justify-between px-4">
          <div className="flex items-center gap-2 ">
            <div className="flex gap-1.5">
              <ErrorIndicator color="red-500" size={3} />
              <ErrorIndicator color="yellow-500" size={3} />
              <ErrorIndicator color="green-500" size={3} />
            </div>
            <span className="ml-2 rounded-md border border-border bg-muted/30 p-2 font-mono text-sm font-semibold text-content">
              solution.{languageToExtension[language]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onRun?.(code)}
              className="inline-flex h-8 items-center justify-center gap-2 rounded-[8px] bg-accent px-4 text-sm font-semibold text-primary-foreground hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Run</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
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
      <div className="relative flex-1 min-h-0 overflow-hidden ">
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
      <div
        role="separator"
        aria-orientation="horizontal"
        onMouseDown={startResize}
        onTouchStart={startResize}
        className="h-1.5 shrink-0 cursor-row-resize bg-border hover:bg-primary/60"
      />

      <TerminalOutput logs={logs} height={terminalHeight} />

      {/* Window Footer */}
      <div className="flex w-full shrink-0 items-center justify-between border-t border-border px-4 py-2 font-mono text-xs text-content">
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