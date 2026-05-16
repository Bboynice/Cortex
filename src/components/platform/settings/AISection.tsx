'use client';

import GlowButton from "@/src/components/ui/GlowButton/GlowButton";
import LabeledInput from "@/src/components/ui/LabeledInput";
import Pill from "@/src/components/ui/Pill";
import { Bot, BrainCircuit, Save, ShieldCheck, Sparkles, Wand2 } from "lucide-react";
import Dropdown from "@/src/components/ui/Dropdown";
import { useState } from "react";
import { useToast } from "@/src/hooks/use-toast";
import { useModalStore } from "@/src/hooks/use-modal-store";
export default function AISection() {
  const [autoSuggestions, setAutoSuggestions] = useState("enabled");
  const [reportVerbosity, setReportVerbosity] = useState("compact");
  const [architectMode, setArchitectMode] = useState("mentor");
  const [preferredModel, setPreferredModel] = useState("gpt-4o-mini");
  const { addToast } = useToast();
  const { onOpen } = useModalStore();
  return (
    <div className="w-full max-w-none space-y-6">
      <section className="rounded-2xl border dark:border-border dark:bg-card/40 p-6 dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl dark:bg-violet-500/15 dark:text-violet-300">
                <BrainCircuit size={18} aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold tracking-tight dark:text-content">AI Preferences</h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Pill
              text="GPT-5.4 Ready"
              variant="content"
              icon={<Sparkles size={14} className="dark:text-violet-200" aria-hidden="true" />}
              className="rounded-lg dark:bg-violet-500/15 px-3 py-1.5 text-xs dark:text-violet-100"
            />
            <Pill
              text="Workspace Aware"
              variant="content"
              icon={<ShieldCheck size={14} className="dark:text-emerald-300" aria-hidden="true" />}
              className="rounded-lg dark:bg-emerald-500/15 px-3 py-1.5 text-xs dark:text-emerald-100"
            />
          </div>
        </header>

        <div className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2 md:items-start">
          <LabeledInput
            label="Assistant Name"
            defaultValue="Cortex Copilot"
            className="dark:bg-foreground/40"
            helperText="Used across your AI workspace and assistant headers."
          />
          <LabeledInput
            label="Response Style"
            defaultValue="Concise, practical, and implementation-first"
            className="dark:bg-foreground/40"
          />
          <div className="flex w-full flex-col gap-2">
            <span className="text-sm font-semibold dark:text-muted-foreground">Preferred Model</span>
            <div className="inline-flex w-fit max-w-full items-center rounded-xl dark:bg-background/25 px-4 py-3">
              <Dropdown
                choices={[
                  { value: "gpt-5-nano", label: "GPT-5 Nano" },
                  { value: "gpt-5-mini", label: "GPT-5 Mini" },
                  { value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
                  { value: "gpt-4.1-nano", label: "GPT-4.1 Nano" },
                  { value: "gpt-4o-mini", label: "GPT-4o Mini" },
                ]}
           
                value={preferredModel}
                onChange={(value) => setPreferredModel(value)}
              />
            </div>
            <p className="text-xs dark:text-muted-foreground">Default model for new sessions.</p>
          </div>
          <LabeledInput
            label="Code Generation Focus"
            defaultValue="Readable, reusable, and production-safe"
            className="dark:bg-foreground/40"
          />
        </div>

        <div className="mt-6 border-t dark:border-border/80 pt-6">
          <GlowButton
            effect="none"
            color="primary"
            className="w-fit justify-start gap-2 rounded-xl px-6 py-3 text-sm font-semibold normal-case"
            onClick={() => {
              onOpen("user-settings", {
                title: "Confirm Save Changes",
                description: "Are you sure you want to save changes?",
                submitText: "Save",
                cancelText: "Cancel",
                action: async () => {
                  addToast(`AI preferences have been saved.`, "success");
                },
              });
            }}
          >
            <span className="inline-flex items-center gap-2">
              <Save size={16} aria-hidden="true" />
              Save AI Preferences
            </span>
          </GlowButton>
        </div>
      </section>

      <section className="rounded-2xl border dark:border-border dark:bg-card/40 p-6 dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl dark:bg-cyan-500/15 dark:text-cyan-300">
            <Bot size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight dark:text-content">Assistant Behavior</h2>
        </header>

        <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between gap-4 rounded-xl border dark:border-border dark:bg-background/25 px-4 py-4">
            <div>
              <div className="text-sm font-semibold dark:text-content">Auto Suggestions</div>
              <p className="mt-1 text-xs dark:text-muted-foreground">
                Suggest follow-up prompts and implementation ideas after each response.
              </p>
            </div>
            <Dropdown
              choices={[
                { value: "enabled", label: "Enabled" },
                { value: "disabled", label: "Disabled" },
              ]}
              value={autoSuggestions}
              onChange={(value) => {
                setAutoSuggestions(value);
                addToast(`Auto suggestions have been ${value}.`, "success");
              }}
            />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border dark:border-border dark:bg-background/25 px-4 py-4">
            <div>
              <div className="text-sm font-semibold dark:text-content">Report Verbosity</div>
              <p className="mt-1 text-xs dark:text-muted-foreground">
                Determines how big or concise the report generation will be: choose between a compact or a loose style.
           
           
           
           
              </p>
            </div>
            <Dropdown
              choices={[
                { value: "compact", label: "Compact" },
                { value: "loose", label: "Loose" },
              ]}
              value={reportVerbosity}
              onChange={(value) => {
                setReportVerbosity(value);
                addToast(`Report verbosity has been set to ${value}.`, "success");
              }}
            />
          </div>
          
          <div className="flex items-center justify-between gap-4 rounded-xl border dark:border-border dark:bg-background/25 px-4 py-4">
            <div>
              <div className="text-sm font-semibold dark:text-content">The Arhitect Mode</div>
              <p className="mt-1 text-xs dark:text-muted-foreground">
                Determines the style of report generation: choose between an encouraging, friendly tone or a strict, professional format.
           
           
           
              </p>
            </div>
            <Dropdown
              choices={[
                { value: "mentor", label: "Mentor Mode" },
                { value: "brutal", label: "Senior Mode" },
              ]}
              value={architectMode}
              onChange={(value) => {
                setArchitectMode(value);
                addToast(`The Architect mode has been set to ${value}.`, "success");
              }}
            />
          </div>
          

         
        </div>
      </section>

      <section className="rounded-2xl border dark:border-border dark:bg-card/40 p-6 dark:shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
        <header className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl dark:bg-orange-500/15 dark:text-orange-300">
            <Wand2 size={18} aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight dark:text-content">Usage & Limits</h2>
        </header>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border dark:border-border dark:bg-background/25 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold dark:text-content">Monthly AI Credits</span>
              <span className="text-xs font-medium dark:text-muted-foreground">7,500 / 10,000 used</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full dark:bg-background/70">
              <div className="h-full w-[75%] rounded-full dark:bg-primary" />
            </div>
          </div>

          <div className="rounded-xl border dark:border-border dark:bg-background/25 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold dark:text-content">Context Window Budget</span>
              <span className="text-xs font-medium dark:text-muted-foreground">42% active</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full dark:bg-background/70">
              <div className="h-full w-[42%] rounded-full dark:bg-cyan-400" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
