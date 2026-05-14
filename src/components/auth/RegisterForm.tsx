"use client";

import Link from "next/link";
import { registerAction } from "@/src/app/(auth)/actions";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useRouter } from "next/navigation";
import SocialAuth from "./SocialAuth";

export default function RegisterForm() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = await registerAction(formData);

    if (result.success && result.user) {
      setAuth(result.user);
      router.push("/dashboard");
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
          type="text"
          name="name"
          placeholder="Name"
          className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
          required
        />
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
          type="submit"
          className="w-full rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:opacity-90"
        >
          Create account
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
