export default function SocialAuth() {
  return (
    <div className="grid gap-3">
      <button
        type="button"
        className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-white transition hover:bg-white/5"
      >
        Continue with Google
      </button>
      <button
        type="button"
        className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-white transition hover:bg-white/5"
      >
        Continue with GitHub
      </button>
    </div>
  );
}
