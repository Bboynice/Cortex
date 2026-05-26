"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/useAuthStore";
import { createClient } from "@/src/lib/supabase/client";
import { mapSupabaseUser } from "@/src/lib/auth";
import SocialAuth from "./SocialAuth";

export default function RegisterForm() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // FIX: Corrected syntax to standard const arrow function
  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    // FIX: Wire directly to Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      setAuth(
        mapSupabaseUser(data.user, {
          email,
          name: name.trim(),
          points: 0,
          username: name.trim().split(/\s+/)[0] || email.split("@")[0] || "user",
        })
      );
      router.push("/dashboard");
    }
  };

  return (
    <div className="space-y-4">
      <SocialAuth />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border dark:bg-white/10" />
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground dark:text-white/40">
          or
        </span>
        <div className="h-px flex-1 bg-border dark:bg-white/10" />
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-content outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-white/10 dark:bg-transparent dark:text-white dark:placeholder:text-white/40"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-content outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-white/10 dark:bg-transparent dark:text-white dark:placeholder:text-white/40"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-content outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 dark:border-white/10 dark:bg-transparent dark:text-white dark:placeholder:text-white/40"
          required
          minLength={6}
        />

        {errorMsg && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm font-medium text-red-500">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:opacity-95"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>

      <div className="text-center text-sm text-muted-foreground dark:text-white/60">
        <Link href="/" className="underline underline-offset-4 hover:text-primary dark:hover:text-white">
          Back to home
        </Link>
      </div>
    </div>
  );
}