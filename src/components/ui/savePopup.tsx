'use client';
import { useEffect, useState } from 'react';
import { useModalStore } from '@/src/hooks/use-modal-store';
import { useToast } from '@/src/hooks/use-toast';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, X, XCircle } from 'lucide-react';

interface SavePopUpProps {
  title?: string;
  description?: string;
  submitText?: string;
  cancelText?: string;
  onSubmit?: () => void;
}

type SubmissionResult = { passed: number; total: number };

export default function SavePopUp({ title, description, submitText, cancelText, onSubmit }: SavePopUpProps) {
    const { isOpen, onClose, type, data } = useModalStore();
    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<SubmissionResult | null>(null);

    // Reset local UI state every time the modal closes so the next open is fresh.
    useEffect(() => {
      if (!isOpen) {
        setIsSubmitting(false);
        setResult(null);
      }
    }, [isOpen]);

    const isSaveCodeDialog = type === "save-code";
    const isConfirmDialog = type === "confirm-delete";
    const isProfileDialog = type === "save-profile";
    const isUserSettingsDialog = type === "user-settings";

    if (
      !isOpen ||
      (!isSaveCodeDialog && !isConfirmDialog && !isProfileDialog && !isUserSettingsDialog)
    ) {
      return null;
    }

    const modalTitle = (data?.title as string | undefined) ?? title ?? "Submit solution?";
    const modalDescription =
      (data?.description as string | undefined) ?? description ?? "Your code will be run against test cases.";
    const modalSubmitText = (data?.submitText as string | undefined) ?? submitText ?? "Submit";
    const modalCancelText = (data?.cancelText as string | undefined) ?? cancelText ?? "Cancel";

    const handleSubmit = async () => {
      setIsSubmitting(true);
      try {
        const action = data?.action as
          | undefined
          | (() => void | Promise<void | SubmissionResult | undefined>);

        if (isConfirmDialog || isProfileDialog || isUserSettingsDialog) {
          if (action) await action();
          onClose();
          return;
        }

        const ret = action ? await action() : await onSubmit?.();

        // If the submit action ran tests and reported a count, keep the modal
        // open and switch to the results view so the user sees X / total.
        if (
          ret &&
          typeof ret === "object" &&
          typeof (ret as any).passed === "number" &&
          typeof (ret as any).total === "number"
        ) {
          setResult(ret as SubmissionResult);
          return;
        }

        addToast("Submitted.", "success");
        onClose();
      } catch {
        addToast(
          isConfirmDialog || isProfileDialog || isUserSettingsDialog
            ? "Something went wrong."
            : "Failed to submit.",
          "error",
        );
        onClose();
      } finally {
        setIsSubmitting(false);
      }
    };

    const allPassed = result !== null && result.passed === result.total && result.total > 0;

    return (
      <motion.span 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="fixed inset-0 z-50 select-none bg-black/50 backdrop-blur-sm"
      onClick={isSubmitting ? undefined : onClose}
      role="presentation"
      >
        <span
          className="fixed left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={modalTitle}
        >
          <span className="relative flex w-full flex-col gap-3 overflow-hidden rounded-lg border border-border/80 bg-foreground p-5 shadow-2xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-content hover:bg-white/5 hover:text-white active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Close"
            >
              <X size={16} aria-hidden="true" />
            </button>

            {isSaveCodeDialog && result ? (
              <>
                <div className="pr-10">
                  <div className="flex items-center gap-2">
                    {allPassed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <h1 className="text-lg font-semibold text-content">
                      {allPassed ? "Solution accepted" : "Some test cases failed"}
                    </h1>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span
                      className={`font-mono font-semibold ${
                        allPassed ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {result.passed} / {result.total}
                    </span>{" "}
                    test cases passed.
                  </p>
                  {!allPassed && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Open the test cases panel to see which ones failed.
                    </p>
                  )}
                </div>

                <div className="mt-2 flex w-full flex-row justify-end gap-2">
                  {!allPassed && (
                    <button
                      type="button"
                      className="inline-flex h-9 items-center justify-center rounded-md bg-surface px-4 text-sm font-semibold text-content hover:brightness-110 active:brightness-95"
                      onClick={() => {
                        addToast(
                          `Submitted with ${result.total - result.passed} failing case${
                            result.total - result.passed === 1 ? "" : "s"
                          }.`,
                          "warning",
                        );
                        onClose();
                      }}
                    >
                      Submit anyway
                    </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:brightness-110 active:brightness-95"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="pr-10">
                  <h1 className="text-lg font-semibold text-content">{modalTitle}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">{modalDescription}</p>
                </div>

                <div className="mt-2 flex w-full flex-row justify-end gap-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-surface px-4 text-sm font-semibold text-content hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={onClose}
                  >
                    {modalCancelText}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:brightness-110 active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={handleSubmit}
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isSubmitting
                      ? isSaveCodeDialog
                        ? "Running tests..."
                        : "Please wait…"
                      : modalSubmitText}
                  </button>
                </div>
              </>
            )}
          </span>
        </span>
      </motion.span>
    );
}
