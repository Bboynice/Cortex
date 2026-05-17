"use client";

import { loginAction } from "@/src/app/(auth)/actions";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SocialAuth from "./SocialAuth";
import Link from "next/link";

export default function LoginForm() {

  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await loginAction(formData);

    if (result?.success && result.user) {
      // Update Client State
      setAuth({
        ...result.user,
        points: 1000,
        username: result.user.email.split("@")[0],
      });
      // Navigate to Dashboard
      router.push("/dashboard");
    } else {
      alert(result?.error || "Login failed");
      setLoading(false);
    }
  }
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

      <form onSubmit={handleSubmit} className="space-y-4">
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
        />
        <button
          disabled={loading}
          type="submit"
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:opacity-95"
        >
          {loading ? "Logging in..." : "Log In"}
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
