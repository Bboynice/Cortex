// src/components/platform/editor/CodeEditor.tsx
'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import Editor, { loader, OnChange, OnMount } from '@monaco-editor/react';
import type { editor as MonacoEditor } from 'monaco-editor';
import CortexLoader from '@/src/components/ui/CortexLoader';
import { useCortexTheme } from '@/src/components/providers/ThemeProvider';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
  onCursorPositionChange?: (pos: { lineNumber: number; column: number }) => void;
  onMarkersChange?: (markers: MonacoEditor.IMarker[]) => void;
}

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on' as const,
  renderValidationDecorations: 'on' as const,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  padding: { top: 16, bottom: 16 },
  fontFamily: 'JetBrains Mono, monospace',
};

const CodeEditor = ({ code, onChange, language = 'javascript', onCursorPositionChange, onMarkersChange }: CodeEditorProps) => {
  const { theme } = useCortexTheme();
  const monacoTheme = theme === 'dark' ? 'vs-dark' : 'vs';
  const cursorListenerRef = useRef<{ dispose: () => void } | null>(null);

  const handleEditorChange: OnChange = (value) => {
    onChange(value ?? "");
  };

  const handleMount: OnMount = (editor, monaco) => {
    cursorListenerRef.current?.dispose();
    monaco.editor.setTheme(monacoTheme);

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

  // Same monaco instance as <Editor />; setTheme here tracks toggles immediately (see @monaco-editor/react loader).
  useLayoutEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const monaco = await loader.init();
        if (!cancelled) monaco.editor.setTheme(monacoTheme);
      } catch {
        /* loader cancelled on unmount */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [monacoTheme]);

  useEffect(() => {
    return () => {
      cursorListenerRef.current?.dispose();
      cursorListenerRef.current = null;
    };
  }, []);

  return (
    <div className="h-full w-full overflow-hidden">
      <Editor
        key={monacoTheme}
        height="100%"
        language={language}
        value={code}
        theme={monacoTheme}
        onChange={handleEditorChange}
        onMount={handleMount}
        onValidate={onMarkersChange}
        loading={
          <CortexLoader size={6} className="text-content" />
        }
        options={editorOptions}
      />
    </div>
  );
};

export default CodeEditor;
