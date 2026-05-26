"use client";

import { useEffect } from "react";
import { createClient } from "@/src/lib/supabase/client";
import { mapSupabaseUser } from "@/src/lib/auth";
import { useAuthStore } from "@/src/store/useAuthStore";

/** Keeps Zustand auth in sync with Supabase session (source of truth for middleware). */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const supabase = createClient();

    const syncFromSession = (session: { user: Parameters<typeof mapSupabaseUser>[0] } | null) => {
      if (!session?.user) {
        clearAuth();
        return;
      }

      const existing = useAuthStore.getState().user;
      const points =
        existing?.id === session.user.id ? existing.points : 1000;

      setAuth(mapSupabaseUser(session.user, { points }));
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncFromSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncFromSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setAuth, clearAuth]);

  return children;
}
