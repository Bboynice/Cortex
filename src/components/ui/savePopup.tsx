'use client';
import { useModalStore } from '@/src/hooks/use-modal-store';
import { useToast } from '@/src/hooks/use-toast';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface SavePopUpProps {
  title?: string;
  description?: string;
  submitText?: string;
  cancelText?: string;
  onSubmit?: () => void;
}

export default function SavePopUp({ title, description, submitText, cancelText, onSubmit }: SavePopUpProps) {
    const { isOpen, onClose, type, data } = useModalStore();
    const { addToast } = useToast();

    if(!isOpen || type !== "save-code") return null;

    const modalTitle = (data?.title as string | undefined) ?? title ?? "Submit solution?";
    const modalDescription =
      (data?.description as string | undefined) ?? description ?? "Your code will be run against test cases.";
    const modalSubmitText = (data?.submitText as string | undefined) ?? submitText ?? "Submit";
    const modalCancelText = (data?.cancelText as string | undefined) ?? cancelText ?? "Cancel";

    const handleSubmit = async () => {
      try {
        const action = data?.action as undefined | (() => void | Promise<void>);
        if (action) await action();
        else await onSubmit?.();

        addToast("Submitted.", "success");
      } catch {
        addToast("Failed to submit.", "error");
      } finally {
        onClose();
      }
    };

    return (
      <motion.span 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="fixed inset-0 z-50 select-none bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
      >
        <span
          className="fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={modalTitle}
        >
          <span className="relative flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-accent bg-foreground p-5 shadow-2xl">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-content hover:bg-white/5 hover:text-white active:brightness-95"
              aria-label="Close"
            >
              <X size={16} aria-hidden="true" />
            </button>

            <div className="pr-10">
              <h1 className="text-lg font-semibold text-white">{modalTitle}</h1>
              <p className="mt-1 text-sm text-content/80">{modalDescription}</p>
            </div>

            <div className="mt-2 flex w-full flex-row justify-end gap-2">
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-[10px] bg-accent px-4 text-sm font-semibold text-content hover:brightness-110 active:brightness-95"
                onClick={onClose}
              >
                {modalCancelText}
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-foreground hover:brightness-110 active:brightness-95"
                onClick={handleSubmit}
              >
                {modalSubmitText}
              </button>
            </div>
          </span>
        </span>
      </motion.span>
    );
}
