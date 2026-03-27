'use client';
import { useToast } from '@/src/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={[
              "pointer-events-auto w-[92vw] max-w-sm overflow-hidden rounded-xl border shadow-2xl",
              "bg-foreground/95 backdrop-blur supports-[backdrop-filter]:bg-foreground/80",
              toast.type === "success"
                ? "border-green-500/35"
                : toast.type === "error"
                  ? "border-red-500/35"
                  : toast.type === "warning"
                    ? "border-yellow-500/35"
                    : "border-blue-500/35",
            ].join(" ")}
            role="status"
          >
            <div className="flex items-start gap-2 p-4">
     

              <div className="min-w-0 flex-1 h-8 flex items-center">
                <div className="text-sm font-medium text-white break-words">{toast.message}</div>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-[8px] text-content hover:bg-white/5 hover:text-white active:brightness-95"
                aria-label="Dismiss toast"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}