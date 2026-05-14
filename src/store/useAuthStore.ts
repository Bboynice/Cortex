import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  heatLevel: number;
}

interface AuthState {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  setAuth: (user: User) => void;
  clearAuth: () => void;
  updateHeatLevel: (delta: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      status: "loading",

      setAuth: (user) => set({ user, status: "authenticated" }),

      clearAuth: () => set({ user: null, status: "unauthenticated" }),

      updateHeatLevel: (delta) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                heatLevel: state.user.heatLevel + delta,
              }
            : null,
        })),
    }),
    { name: "cortex-auth-vault" }
  )
);
