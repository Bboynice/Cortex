import Link from "next/link";
import { loginAction } from "@/src/app/(auth)/actions";
import SocialAuth from "@/src/components/auth/SocialAuth";
import GlowButton from "@/src/components/ui/GlowButton/GlowButton";

export default function LoginFrom() {
  return (
    <div className="space-y-4">
      <SocialAuth />

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs uppercase tracking-[0.2em] text-white/40">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form action={loginAction} className="space-y-4">
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
          className="w-full rounded-xl bg-white text-black px-4 py-3 text-sm font-medium transition hover:opacity-90"
        >
          Log In
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
