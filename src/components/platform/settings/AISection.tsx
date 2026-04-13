'use client';

import GlowButton from "@/src/components/ui/GlowButton/GlowButton";
import LabeledInput from "@/src/components/ui/LabeledInput";
import Pill from "@/src/components/ui/Pill";
import { Bot, BrainCircuit, Save, ShieldCheck, Sparkles, Wand2 } from "lucide-react";

export default function AISection() {
  return (
    <div className="w-full max-w-none space-y-6">
      <section className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                <BrainCircuit size={18} aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold tracking-tight text-content">AI Preferences</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Configure how Cortex assists you across chats, code generation, and workspace actions.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Pill
              text="GPT-5.4 Ready"
              variant="content"
              icon={<Sparkles size={14} className="text-violet-200" aria-hidden="true" />}
              className="rounded-lg bg-violet-500/15 px-3 py-1.5 text-xs text-violet-100"
            />
            <Pill
              text="Workspace Aware"
              variant="content"
              icon={<ShieldCheck size={14} className="text-emerald-300" aria-hidden="true" />}
              className="rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs text-emerald-100"
            />
          </div>
        </header>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <LabeledInput
            label="Assistant Name"
            defaultValue="Cortex Copilot"
            className="bg-foreground/40"
            helperText="Used across your AI workspace and assistant headers."
          />
          <LabeledInput
            label="Preferred Model"
            defaultValue="gpt-5.4"
            className="bg-foreground/40"
            helperText="Default model for new sessions."
          />
          <LabeledInput
            label="Response Style"
            defaultValue="Concise, practical, and implementation-first"
            className="bg-foreground/40"
          />
          <LabeledInput
            label="Code Generation Focus"
            defaultValue="Readable, reusable, and production-safe"
            className="bg-foreground/40"
          />
        </div>

        <div className="mt-6 border-t border-border/80 pt-6">
          <GlowButton
            effect="none"
            color="primary"
            className="w-fit justify-start gap-2 rounded-xl px-6 py-3 text-sm font-semibold normal-case"
          >
            <span className="inline-flex items-center gap-2">
              <Save size={16} aria-hidden="true" />
              Save AI Preferences
            </span>
          </GlowButton>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card/40 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
            <Bot size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-content">Assistant Behavior</h2>
        </header>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/25 px-4 py-4">
            <div>
              <div className="text-sm font-semibold text-content">Use Workspace Context</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Lets the assistant read nearby files and open tabs for more relevant answers.
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
              <div className="text-sm font-semibold text-content">Auto Suggestions</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Suggest follow-up prompts and implementation ideas after each response.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-xl bg-muted/20 px-4 py-2 text-sm font-semibold text-content hover:bg-muted/25 active:brightness-95"
            >
              Enabled
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/25 px-4 py-4">
            <div>
              <div className="text-sm font-semibold text-content">Experimental Tools</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Allows early access to new generation and planning capabilities.
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
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
            <Wand2 size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-content">Usage & Limits</h2>
        </header>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-background/25 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-content">Monthly AI Credits</span>
              <span className="text-xs font-medium text-muted-foreground">7,500 / 10,000 used</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-background/70">
              <div className="h-full w-[75%] rounded-full bg-primary" />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background/25 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-content">Context Window Budget</span>
              <span className="text-xs font-medium text-muted-foreground">42% active</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-background/70">
              <div className="h-full w-[42%] rounded-full bg-cyan-400" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
