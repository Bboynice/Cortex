import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  createdAt: number;
  durationMs: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, durationMs?: number) => void;
  removeToast: (id: string) => void;
}

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'info', durationMs) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    const defaultDuration =
      type === "success" ? 2500 : type === "info" ? 3200 : type === "warning" ? 4000 : 5000;

    const finalDurationMs = durationMs ?? defaultDuration;

    set((state) => ({
      toasts: [...state.toasts, { id, message, type, createdAt: Date.now(), durationMs: finalDurationMs }],
    }));

    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, finalDurationMs);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));