'use client';
import { useToast } from '@/src/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col gap-3"
      aria-live="polite"
      aria-relevant="additions removals"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const isCopyToast = toast.type === "copy";
          const isLongMessage = toast.message.length > 120;

          return (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={[
              'pointer-events-auto w-[92vw] max-w-sm overflow-hidden rounded-xl border shadow-2xl',
              'bg-card/95 text-content backdrop-blur-md supports-[backdrop-filter]:bg-card/85',
              'dark:bg-surface/95 dark:text-content dark:supports-[backdrop-filter]:bg-surface/85',
              toast.type === 'success'
                ? 'border-green-500/40 dark:border-green-500/35'
                : toast.type === 'error'
                  ? 'border-red-500/40 dark:border-red-500/35'
                  : toast.type === 'warning'
                    ? 'border-yellow-500/50 dark:border-yellow-500/35'
                    : isCopyToast
                      ? 'border-primary dark:border-primary'
                      : 'border-blue-500/40 dark:border-blue-500/35',
            ].join(' ')}
            role="status"
          >
            <div className="flex items-start gap-2 p-4">
              <div
                className={[
                  "flex min-w-0 flex-1",
                  isCopyToast && isLongMessage ? "items-start" : "h-8 items-center",
                ].join(" ")}
              >
                <div
                  className={[
                    "break-words text-sm font-medium text-content dark:text-content",
                    isCopyToast && isLongMessage
                      ? "max-h-48 w-full overflow-y-auto overscroll-contain whitespace-pre-wrap pr-1"
                      : "",
                  ].join(" ")}
                >
                  {toast.message}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="ml-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-neutral-300 text-neutral-700 transition-colors hover:bg-neutral-100/90 dark:border-white/15 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-400"
                aria-label="Dismiss toast"
              >
                <X className="shrink-0" size={16} strokeWidth={2.25} aria-hidden="true" />
              </button>
            </div>
          </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
