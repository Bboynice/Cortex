// src/components/platform/editor/CodeEditor.tsx
'use client';

import { useEffect, useRef } from 'react';
import Editor, { OnChange, OnMount } from '@monaco-editor/react';
import type { editor as MonacoEditor } from 'monaco-editor';
import CortexLoader from '@/src/components/ui/CortexLoader';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
  onCursorPositionChange?: (pos: { lineNumber: number; column: number }) => void;
  onMarkersChange?: (markers: MonacoEditor.IMarker[]) => void;
}

const CodeEditor = ({ code, onChange, language = 'javascript', onCursorPositionChange, onMarkersChange }: CodeEditorProps) => {
  const cursorListenerRef = useRef<{ dispose: () => void } | null>(null);

  const handleEditorChange: OnChange = (value) => {
    onChange(value ?? "");
  };

  const handleMount: OnMount = (editor, monaco) => {
    cursorListenerRef.current?.dispose();

    // Ensure Monaco validation decorations (red squiggles) are enabled for JS/TS.
    try {
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });
      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });
    } catch {
      // ignore (in case TS language service isn't available)
    }

    const pos = editor.getPosition();
    if (pos) onCursorPositionChange?.({ lineNumber: pos.lineNumber, column: pos.column });

    cursorListenerRef.current = editor.onDidChangeCursorPosition((e) => {
      onCursorPositionChange?.({ lineNumber: e.position.lineNumber, column: e.position.column });
    });
  };

  useEffect(() => {
    return () => {
      cursorListenerRef.current?.dispose();
      cursorListenerRef.current = null;
    };
  }, []);

  return (
    <div className="h-full w-full overflow-hidden">
      <Editor
        height="100%"
        language={language}
        value={code}
        theme="vs-dark" // Use a dark theme to match your design
        onChange={handleEditorChange}
        onMount={handleMount}
        onValidate={onMarkersChange}
        loading={
          <>
            <CortexLoader size={6} />
          </>
      }
        options={{
          minimap: { enabled: false }, // Hide the minimap like in your design
          fontSize: 14,
          lineNumbers: 'on',
          renderValidationDecorations: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          fontFamily: 'JetBrains Mono, monospace', // Use a nice coding font
        }}
      />
    </div>
  );
};

export default CodeEditor;