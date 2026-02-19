interface TerminalOutputProps {
    logs: string[];
}

export default function TerminalOutput({ logs }: TerminalOutputProps) {
  return (
    <div className="w-full h-auto bg-slate-950 font-mono text-sm p-4 overflow-y-auto border-t border-border">
      <div className="flex items-center gap-2 mb-2 text-muted">
        <span className="text-xs uppercase font-bold tracking-wider">Terminal</span>
      </div>
      
      {logs.length === 0 ? (
        <p className="text-slate-600 italic">No output yet. Click "Run" to execute your code.</p>
      ) : (
        logs.map((log, index) => (
          <div key={index} className="flex gap-2 mb-1">
            <span className="text-primary select-none opacity-50">&gt;</span>
            <span className="text-slate-200 break-all">{log}</span>
          </div>
        ))
      )}
    </div>
  );
}