export default function SocialAuth() {
  return (
    <div className="grid gap-3">
      <button
        type="button"
        className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm text-content transition hover:bg-muted/40 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
      >
        Continue with Google
      </button>
      <button
        type="button"
        className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm text-content transition hover:bg-muted/40 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
      >
        Continue with GitHub
      </button>
    </div>
  );
}
