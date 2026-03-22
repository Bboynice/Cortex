'use client';
import { useModalStore } from '@/src/hooks/use-modal-store';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface SavePopUpProps {
    title: string;
    description: string;
    submitText: string;
    cancelText: string;
    onSubmit?: () => void;
}

export default function SavePopUp({ title, description, submitText, cancelText, onSubmit }: SavePopUpProps) {
    const { isOpen, onClose, type, data } = useModalStore();

    const open = isOpen && type === "save-code";

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 select-none"
          >
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              className="relative w-[92vw] max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-muted/15 hover:text-content active:brightness-95"
              >
                <X size={18} aria-hidden="true" />
              </button>

              <div className="flex flex-col gap-1 pr-10">
                <h2 className="text-lg font-semibold text-content tracking-tight">{title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>

              <div className="mt-6 flex w-full items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-9 items-center justify-center rounded-[8px] border border-border bg-background px-4 text-sm font-semibold text-content hover:brightness-110 active:brightness-95"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSubmit?.();
                    onClose();
                  }}
                  className="inline-flex h-9 items-center justify-center rounded-[8px] bg-primary px-4 text-sm font-semibold text-primary-foreground hover:brightness-110 active:brightness-95"
                >
                  {submitText}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
}
