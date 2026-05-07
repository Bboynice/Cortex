'use client';

import Link from "next/link";
import MarketingShell from "@/src/components/marketing/MarketingShell";

const features = [
  {
    title: "Practice that adapts",
    description:
      "Pick a language and difficulty. You get a fresh challenge every time, scoped to standard library only — no random framework rabbit holes.",
  },
  {
    title: "Editor and feedback in one place",
    description:
      "Write your solution, run it, and read AI feedback inline. No tab juggling, no context switching.",
  },
  {
    title: "Visible progress",
    description:
      "Streaks, points, and per-language scores. You can tell what's actually improving instead of guessing.",
  },
];

const steps = [
  {
    title: "Pick a topic",
    description: "Choose a language and difficulty, or jump straight into a daily mission.",
  },
  {
    title: "Solve and run",
    description: "Write your solution in the editor, run it, and get feedback on the spot.",
  },
  {
    title: "Come back tomorrow",
    description: "The dashboard tracks the streak. The scores tell you where to focus next.",
  },
];

export default function MarketingHomePage() {
  return (
    <MarketingShell>
      <section className="rounded-xl border dark:border-border dark:bg-muted/20 backdrop-blur-lg p-6 shadow-sm sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight dark:text-content sm:text-5xl">
              Daily coding practice with{" "}
              <span className="dark:text-primary">AI-generated</span> challenges.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 dark:text-muted-foreground sm:text-lg">
              Cortex picks problems for the language you&apos;re working on, runs your code, and tells
              you what to improve. Built to be opened every day, not bookmarked once.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md dark:bg-primary px-5 py-3 text-sm font-semibold dark:text-primary-foreground hover:brightness-110 active:brightness-95 transition"
              >
                Start a challenge
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-md border dark:border-border dark:bg-muted/20 px-5 py-3 text-sm font-semibold dark:text-content dark:hover:bg-muted/30 transition-colors"
              >
                See pricing
              </Link>
            </div>
          </div>

          <div className="rounded-xl border dark:border-border dark:bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs dark:text-muted-foreground">
              <span className="font-mono">solution.js</span>
              <span className="rounded-full border dark:border-border dark:bg-muted/20 px-2 py-0.5 dark:text-content">
                AI generated
              </span>
            </div>
            <pre className="mt-4 overflow-x-auto rounded-md dark:bg-foreground p-4 text-sm leading-6 dark:text-content">
              <code>{`function reverseString(value) {
  let output = "";
  for (let i = value.length - 1; i >= 0; i--) {
    output += value[i];
  }
  return output;
}`}</code>
            </pre>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs dark:text-muted-foreground">
              <div className="rounded-md border dark:border-border dark:bg-muted/20 px-3 py-2">
                JavaScript
              </div>
              <div className="rounded-md border dark:border-border dark:bg-muted/20 px-3 py-2">
                Medium
              </div>
              <div className="rounded-md border dark:border-border dark:bg-muted/20 px-3 py-2">
                ~15 min
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mt-10">
        <div className="flex items-center gap-2 mb-3 px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider dark:text-muted-foreground">
            What you get
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border dark:border-border dark:bg-muted/20 backdrop-blur-lg p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold dark:text-content">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 dark:text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-2 mb-3 px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider dark:text-muted-foreground">
            How it works
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-xl border dark:border-border dark:bg-muted/20 backdrop-blur-lg p-5 shadow-sm"
            >
              <div className="text-xs font-semibold dark:text-primary">0{index + 1}</div>
              <h3 className="mt-2 text-lg font-semibold dark:text-content">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 dark:text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl border dark:border-border dark:bg-muted/20 backdrop-blur-lg p-6 shadow-sm sm:p-10 text-center">
        <h2 className="text-2xl font-semibold tracking-tight dark:text-content sm:text-3xl">
          Try it. The first challenge is free.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 dark:text-muted-foreground sm:text-base">
          No credit card. No long onboarding. Pick a language, run a problem, see if the loop fits.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md dark:bg-primary px-5 py-3 text-sm font-semibold dark:text-primary-foreground hover:brightness-110 active:brightness-95 transition"
          >
            Start a challenge
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-md border dark:border-border dark:bg-muted/20 px-5 py-3 text-sm font-semibold dark:text-content dark:hover:bg-muted/30 transition-colors"
          >
            See pricing
          </Link>
        </div>
      </section>
    </MarketingShell>
  );
}
