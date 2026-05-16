import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  points: number;
  username: string;
}

interface AuthState {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  setAuth: (user: User) => void;
  clearAuth: () => void;
  updatePoints: (delta: number) => void;
  updateProfile: (data: Partial<Pick<User, "name" | "email" | "username">>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      status: "loading",

      setAuth: (user) => set({ user, status: "authenticated" }),

      clearAuth: () => set({ user: null, status: "unauthenticated" }),

      updatePoints: (delta) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                points: state.user.points + delta,
              }
            : null,
        })),
      updateProfile: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
    }),
    { name: "cortex-auth-vault" }
  )
);
