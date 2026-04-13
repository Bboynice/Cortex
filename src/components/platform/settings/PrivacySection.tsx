'use client';

import GlowButton from "@/src/components/ui/GlowButton/GlowButton";
import Pill from "@/src/components/ui/Pill";
import { AlertTriangle, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

export default function PrivacySection() {
  return (
    <div className="w-full max-w-none space-y-6">
      <section className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300">
                <ShieldCheck size={18} aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold tracking-tight text-content">Privacy Controls</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Manage visibility, data handling, and account security preferences.
            </p>
          </div>

          <Pill
            text="Protected"
            variant="content"
            icon={<LockKeyhole size={14} className="text-emerald-300" aria-hidden="true" />}
            className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs text-emerald-100"
          />
        </header>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/25 px-4 py-4">
            <div>
              <div className="text-sm font-semibold text-content">Profile Visibility</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Control whether your public profile is visible to other users.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-xl bg-background px-4 py-2 text-sm font-semibold text-muted-foreground ring-1 ring-border hover:text-content active:brightness-95"
            >
              Private
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/25 px-4 py-4">
            <div>
              <div className="text-sm font-semibold text-content">Search Discoverability</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Allow your account to appear in team and workspace search results.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 active:brightness-95"
            >
              Enabled
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/25 px-4 py-4">
            <div>
              <div className="text-sm font-semibold text-content">AI Training Opt-In</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Decide whether anonymized usage can be used to improve future AI features.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-xl bg-background px-4 py-2 text-sm font-semibold text-muted-foreground ring-1 ring-border hover:text-content active:brightness-95"
            >
              Disabled
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <EyeOff size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-content">Data Management</h2>
        </header>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-background/25 p-5">
            <div className="text-sm font-semibold text-content">Export Personal Data</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Request a downloadable archive of your profile, settings, and workspace metadata.
            </p>
            <div className="mt-4">
              <GlowButton
                effect="none"
                color="primary"
                className="w-fit justify-start rounded-xl px-5 py-3 text-sm font-semibold normal-case"
              >
                Request Export
              </GlowButton>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background/25 p-5">
            <div className="text-sm font-semibold text-content">Clear AI Session History</div>
            <p className="mt-2 text-sm text-muted-foreground">
              Remove saved prompts, generated summaries, and assistant session history from this account.
            </p>
            <div className="mt-4">
              <button
                type="button"
                className="inline-flex items-center rounded-xl bg-muted/20 px-5 py-3 text-sm font-semibold text-content hover:bg-muted/25 active:brightness-95"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-red-500/35 bg-card/40 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <AlertTriangle size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-red-400">Sensitive Actions</h2>
        </header>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/15 active:brightness-95"
          >
            <AlertTriangle size={16} aria-hidden="true" />
            Revoke All Sessions
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/25 px-5 py-3 text-sm font-semibold text-content hover:bg-background/35 active:brightness-95"
          >
            Review Account Deletion
          </button>
        </div>
      </section>
    </div>
  );
}

