import { useTypewriter } from "@/src/hooks/useTypewriter";
import { motion } from "framer-motion";

export default function TerminalOutput({
  logs,
  speedMs,
  height = 112,
}: {
  logs: string[];
  speedMs?: number;
  height?: number;
}) {
  const fullText = logs.map(log => `> ${log}`).join("\n");
  const typed = useTypewriter(fullText, speedMs);
  return (
    <div  style={{ height}} className={`flex  w-full shrink-0 flex-col border-t dark:border-border dark:bg-background font-mono text-sm`}>
      <div className="flex shrink-0 items-center gap-2 px-4 pt-2 dark:text-muted">
        <span className="text-[10px] font-bold uppercase tracking-wider">Terminal</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2">
        {logs.length === 0 ? (
          <p className="m-0 dark:text-slate-600 italic">
            No output yet. Click &quot;Run&quot; to execute your code.
          </p>
        ) : (
          <motion.pre className="m-0 whitespace-pre-wrap break-words leading-5 dark:text-slate-200">
            {typed}
          </motion.pre>
        )}
      </div>
    </div>
  );
}