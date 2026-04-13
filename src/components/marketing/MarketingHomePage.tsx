'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Check,
  CodeXml,
  Gauge,
  Play,
  ShieldCheck,
  Sparkles,
  Stars,
  Workflow,
} from "lucide-react";
import MarketingShell from "@/src/components/marketing/MarketingShell";

const trustedBy = ["Google", "Microsoft", "Meta", "Amazon", "Apple", "GitHub"];

const features = [
  {
    icon: BrainCircuit,
    title: "Adaptive missions",
    description: "Challenges adjust to your stack, skill level, and the habits you want to build next.",
  },
  {
    icon: CodeXml,
    title: "Real editor flow",
    description: "Practice in a focused coding environment with generation, execution, and AI feedback in one place.",
  },
  {
    icon: Gauge,
    title: "Visible improvement",
    description: "Track completion, reasoning quality, and consistency so progress feels concrete instead of vague.",
  },
  {
    icon: Workflow,
    title: "From prompt to mastery",
    description: "Move from one-off curiosity to a repeatable system for sharpening implementation speed and judgment.",
  },
  {
    icon: ShieldCheck,
    title: "Built for teams too",
    description: "Shared standards, private workspaces, and safer AI defaults make it useful beyond solo practice.",
  },
  {
    icon: Stars,
    title: "Actually fun to return to",
    description: "Short, high-quality exercises keep the loop tight enough to use daily without burning out.",
  },
];

const steps = [
  {
    title: "Pick your lane",
    description: "Choose language, difficulty, and what kind of challenge you want to sharpen today.",
  },
  {
    title: "Build with feedback",
    description: "Write code, run it, and let Cortex highlight weak spots, edge cases, and better trade-offs.",
  },
  {
    title: "Repeat with intent",
    description: "Use insights from every session to stack wins and steadily increase complexity.",
  },
];

const testimonials = [
  {
    quote: "It feels like the missing layer between tutorials and real interviews. I actually practice every day now.",
    author: "Maya K.",
    role: "Frontend Engineer",
  },
  {
    quote: "The challenge quality is high and the feedback is opinionated in a good way. It pushes better decisions.",
    author: "Tobias R.",
    role: "Full-Stack Developer",
  },
  {
    quote: "Cortex turned our team practice sessions into something structured, measurable, and much more motivating.",
    author: "Leila S.",
    role: "Engineering Manager",
  },
];

export default function MarketingHomePage() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(249,115,22,0.16),rgba(15,23,42,0.18)_35%,rgba(59,130,246,0.12))] px-6 py-12 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:px-8 sm:py-16 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_28%)]" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-orange-100">
              <Sparkles size={14} aria-hidden="true" />
              AI-generated coding missions
            </div>

            <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-none tracking-tight text-white sm:text-6xl">
              Master your craft with{" "}
              <span className="bg-gradient-to-r from-orange-200 via-orange-300 to-orange-500 bg-clip-text text-transparent">
                deliberate AI practice
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Cortex turns vague learning goals into focused coding missions, instant feedback, and visible progress you
              can actually feel week after week.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition hover:brightness-110 active:brightness-95"
              >
                Start Free Challenge
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white/10"
              >
                <Play size={16} aria-hidden="true" />
                View Plans
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-300">
              {["Free to start", "No credit card required", "Designed for daily practice"].map((item) => (
                <div key={item} className="inline-flex items-center gap-2">
                  <Check size={16} className="text-emerald-300" aria-hidden="true" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -left-8 top-8 h-32 w-32 rounded-full bg-orange-500/20 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-slate-950/85 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-slate-400">
                <span>challenge.js</span>
                <span className="rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs text-orange-100">
                  AI Generated
                </span>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
                <div className="rounded-2xl border border-white/8 bg-[#090f1f] p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Mission</div>
                  <h2 className="mt-3 text-xl font-semibold text-white">Reverse a string without built-ins</h2>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Solve the problem, explain your approach, and improve it after the first run using AI hints.
                  </p>

                  <div className="mt-4 space-y-2 text-sm text-slate-300">
                    <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">JavaScript</div>
                    <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">Medium difficulty</div>
                    <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">15 min estimate</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-[#060b18] p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Live Preview</div>
                  <pre className="mt-4 overflow-x-auto text-sm leading-7 text-slate-200">
                    <code>{`function reverseString(value) {
  let output = "";

  for (let index = value.length - 1; index >= 0; index--) {
    output += value[index];
  }

  return output;
}

console.log(reverseString("cortex"));`}</code>
                  </pre>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Challenges completed", value: "18.4k" },
                  { label: "Average weekly streak", value: "11 days" },
                  { label: "Saved review time", value: "6.2 hrs" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div className="text-xs text-slate-500">{item.label}</div>
                    <div className="mt-1 text-lg font-semibold text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Trusted by developers at</div>
          <div className="mt-8 grid grid-cols-2 gap-4 text-center text-lg font-semibold text-slate-500 sm:grid-cols-3 lg:grid-cols-6">
            {trustedBy.map((company) => (
              <div key={company} className="rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-4">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-8 sm:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">
            <BadgeCheck size={14} aria-hidden="true" />
            Why Cortex stands out
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built to make practice feel intentional, measurable, and addictive
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Every screen is designed to remove friction between curiosity, execution, and real skill growth.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="rounded-[1.75rem] border border-white/8 bg-white/[0.04] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)]"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/25 to-sky-500/25 text-orange-100">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-8 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-white/8 bg-white/[0.04] p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-orange-100">
              <Sparkles size={14} aria-hidden="true" />
              A better loop
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white">From one session to compounding skill</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              Cortex shortens the feedback loop so you spend less time deciding what to practice and more time getting
              sharper at the work that matters.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-[1.75rem] border border-white/8 bg-slate-950/70 p-6">
                <div className="text-sm font-semibold text-orange-200">0{index + 1}</div>
                <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Loved by developers who care about getting better</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Cortex is designed for people who want a cleaner, more motivating path from effort to actual progress.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.author} className="rounded-[1.75rem] border border-white/8 bg-white/[0.04] p-6">
              <div className="text-orange-200">★★★★★</div>
              <p className="mt-4 text-base leading-8 text-slate-200">“{item.quote}”</p>
              <div className="mt-6 border-t border-white/8 pt-4">
                <div className="font-semibold text-white">{item.author}</div>
                <div className="text-sm text-slate-400">{item.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-4 pt-8 sm:pb-8 sm:pt-14">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(249,115,22,0.15),rgba(59,130,246,0.12))] px-6 py-10 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:px-10 sm:py-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-slate-950/35 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-slate-200">
            <Sparkles size={14} aria-hidden="true" />
            Ready to level up your coding?
          </div>
          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Start building stronger engineering instincts with every session
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-200">
            Generate your first mission in seconds, learn from the feedback loop, and build a practice habit that
            finally sticks.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Start Free Challenge
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-2xl border border-white/12 bg-slate-950/30 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-slate-950/45"
            >
              Compare Plans
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
