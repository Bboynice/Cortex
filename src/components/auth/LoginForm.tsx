"use client";

import { loginAction } from "@/src/app/(auth)/actions";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SocialAuth from "./SocialAuth";
import Link from "next/link";

export default function LoginFrom() {

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
      setAuth(result.user);
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
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-[0.2em] text-white/40">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
          required
        />
        <button
          disabled={loading}
          type="submit"
          className="w-full rounded-xl bg-white text-black px-4 py-3 text-sm font-medium transition hover:opacity-90"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="text-center text-sm text-white/60">
        <Link href="/" className="underline underline-offset-4">
          Back to home
        </Link>
      </div>
    </div>
  );
}
