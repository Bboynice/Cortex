'use client';

import GlowButton from "@/src/components/ui/GlowButton/GlowButton";
import LabeledInput from "@/src/components/ui/LabeledInput";
import Pill from "@/src/components/ui/Pill";
import { CreditCard, Download, Receipt, Sparkles, Wallet } from "lucide-react";

export default function BillingSection() {
  return (
    <div className="w-full max-w-none space-y-6">
      <section className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                <Wallet size={18} aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold tracking-tight text-content">Current Plan</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Review your subscription, seat limits, and AI usage allocation.
            </p>
          </div>

          <Pill
            text="Pro Monthly"
            variant="content"
            icon={<Sparkles size={14} className="text-orange-200" aria-hidden="true" />}
            className="rounded-lg bg-orange-500/15 px-3 py-1.5 text-xs text-orange-100"
          />
        </header>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-xl border border-border bg-background/25 p-5">
            <div className="text-3xl font-semibold tracking-tight text-content">$24.00</div>
            <p className="mt-1 text-sm text-muted-foreground">Billed monthly. Next renewal on May 13, 2026.</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/80 bg-foreground/30 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Seats</div>
                <div className="mt-1 text-lg font-semibold text-content">1 of 3 used</div>
              </div>
              <div className="rounded-xl border border-border/80 bg-foreground/30 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">AI Credits</div>
                <div className="mt-1 text-lg font-semibold text-content">10,000 monthly</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border bg-background/25 p-5">
            <GlowButton
              effect="none"
              color="primary"
              className="w-full justify-center rounded-xl px-5 py-3 text-sm font-semibold normal-case"
            >
              Manage Subscription
            </GlowButton>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center rounded-xl bg-muted/20 px-5 py-3 text-sm font-semibold text-content hover:bg-muted/25 active:brightness-95"
            >
              Change Plan
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
            <CreditCard size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-content">Payment Method</h2>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-background/25 px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-content">Visa ending in 4242</div>
                <p className="mt-1 text-xs text-muted-foreground">Expires 08/2028</p>
              </div>
              <Pill text="Default" variant="primary" className="rounded-lg px-3 py-1.5 text-xs" />
            </div>
          </div>

          <LabeledInput
            label="Billing Email"
            defaultValue="billing@cortex.dev"
            className="bg-foreground/40"
            autoComplete="email"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
            <Receipt size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-content">Recent Invoices</h2>
        </header>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/25 px-4 py-4">
            <div>
              <div className="text-sm font-semibold text-content">Apr 2026 Subscription</div>
              <p className="mt-1 text-xs text-muted-foreground">$24.00 paid on Apr 13, 2026</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-muted/20 px-4 py-2 text-sm font-semibold text-content hover:bg-muted/25 active:brightness-95"
            >
              <Download size={16} aria-hidden="true" />
              Download
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/25 px-4 py-4">
            <div>
              <div className="text-sm font-semibold text-content">Mar 2026 Subscription</div>
              <p className="mt-1 text-xs text-muted-foreground">$24.00 paid on Mar 13, 2026</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-muted/20 px-4 py-2 text-sm font-semibold text-content hover:bg-muted/25 active:brightness-95"
            >
              <Download size={16} aria-hidden="true" />
              Download
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/25 px-4 py-4">
            <div>
              <div className="text-sm font-semibold text-content">Feb 2026 Subscription</div>
              <p className="mt-1 text-xs text-muted-foreground">$24.00 paid on Feb 13, 2026</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-muted/20 px-4 py-2 text-sm font-semibold text-content hover:bg-muted/25 active:brightness-95"
            >
              <Download size={16} aria-hidden="true" />
              Download
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

