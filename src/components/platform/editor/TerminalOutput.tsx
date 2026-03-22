import { useTypewriter } from "@/src/hooks/useTypewriter";
import { motion } from "framer-motion";

export default function TerminalOutput({
  logs,
  speedMs,
}: {
  logs: string[];
  speedMs?: number;
}) {
  const fullText = logs.map(log => `> ${log}`).join("\n");
  const typed = useTypewriter(fullText, speedMs);
  return (
    <div className="w-full h-auto bg-slate-950 font-mono text-sm p-4 overflow-y-auto border-t border-border">
      <div className="mb-2 flex items-center gap-2 text-muted">
        <span className="text-xs font-bold uppercase tracking-wider">Terminal</span>
      </div>

      {logs.length === 0 ? (
        <p className="text-slate-600 italic">
          No output yet. Click &quot;Run&quot; to execute your code.
        </p>
      ) : (
        <motion.pre className="whitespace-pre-wrap break-words text-slate-200 m-0">
          {typed}
        </motion.pre>
      )}
    </div>
  );
}