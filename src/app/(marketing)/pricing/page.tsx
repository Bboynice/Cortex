import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import MarketingShell from "@/src/components/marketing/MarketingShell";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for trying Cortex and building a lightweight practice habit.",
    cta: "Start Free",
    href: "/dashboard",
    featured: false,
    features: ["3 AI missions per week", "Core editor and code runs", "Basic progress tracking", "Community challenge library"],
  },
  {
    name: "Pro",
    price: "$24",
    description: "For serious developers who want richer feedback and faster improvement.",
    cta: "Go Pro",
    href: "/dashboard",
    featured: true,
    features: ["Unlimited AI missions", "Advanced AI code insights", "Difficulty tuning by stack", "Priority generation speed"],
  },
  {
    name: "Team",
    price: "$79",
    description: "Shared standards and visibility for teams leveling up together.",
    cta: "Talk to Us",
    href: "/about",
    featured: false,
    features: ["Up to 5 seats included", "Shared challenge templates", "Team analytics and streaks", "Private workspace defaults"],
  },
];

const faqs = [
  {
    question: "Can I start without a credit card?",
    answer: "Yes. The Starter plan is free and lets people experience the core Cortex workflow before upgrading.",
  },
  {
    question: "What changes on Pro?",
    answer: "You unlock unlimited generation, deeper AI feedback, and a smoother training loop for consistent practice.",
  },
  {
    question: "Is Team only for large companies?",
    answer: "No. It also fits small product teams, interview groups, and internal mentorship circles.",
  },
];

export default function PricingPage() {
  return (
    <MarketingShell
      title="Pricing that grows with your ambition"
      description="Start free, level up when the feedback loop clicks, and bring your team along when practice becomes part of the culture."
    >
      <section className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={[
              "rounded-[2rem] border p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]",
              plan.featured
                ? "border-orange-400/30 bg-[linear-gradient(180deg,rgba(249,115,22,0.14),rgba(15,23,42,0.72))]"
                : "border-white/8 bg-white/[0.04]",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-2xl font-semibold text-white">{plan.name}</div>
              {plan.featured ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-100">
                  <Sparkles size={13} aria-hidden="true" />
                  Most Popular
                </div>
              ) : null}
            </div>

            <div className="mt-5 flex items-end gap-2">
              <div className="text-5xl font-semibold tracking-tight text-white">{plan.price}</div>
              <div className="pb-1 text-slate-400">/ month</div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300">{plan.description}</p>

            <Link
              href={plan.href}
              className={[
                "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition",
                plan.featured
                  ? "bg-primary text-primary-foreground hover:brightness-110"
                  : "border border-white/10 bg-white/5 text-white hover:bg-white/10",
              ].join(" ")}
            >
              {plan.cta}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>

            <div className="mt-6 space-y-3 border-t border-white/8 pt-6">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm text-slate-200">
                  <Check size={16} className="mt-0.5 shrink-0 text-emerald-300" aria-hidden="true" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/8 bg-white/[0.04] p-6 sm:p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Included everywhere</div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">Every plan keeps the practice loop tight</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            You still get the same core experience: guided missions, a focused interface, and a product built around
            actual improvement rather than noisy dashboards.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            "AI-crafted coding prompts",
            "Fast browser-based editor flow",
            "Progress history and streak tracking",
            "Clean, distraction-light learning UX",
          ].map((item) => (
            <div key={item} className="rounded-[1.75rem] border border-white/8 bg-slate-950/70 p-5 text-base text-slate-200">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-white/8 bg-white/[0.04] p-6 sm:p-8">
        <h2 className="text-3xl font-semibold tracking-tight text-white">Frequently asked questions</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {faqs.map((item) => (
            <div key={item.question} className="rounded-[1.5rem] border border-white/8 bg-slate-950/65 p-5">
              <h3 className="text-lg font-semibold text-white">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}

