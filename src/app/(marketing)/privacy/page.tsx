import { EyeOff, LockKeyhole, ShieldCheck, SlidersHorizontal } from "lucide-react";
import MarketingShell from "@/src/components/marketing/MarketingShell";

const principles = [
  {
    icon: ShieldCheck,
    title: "Security-first infrastructure",
    description: "Encrypted transport, scoped access, and a product posture designed to reduce accidental exposure.",
  },
  {
    icon: EyeOff,
    title: "Respect for user data",
    description: "We aim to collect only what helps operate the product and improve the user experience responsibly.",
  },
  {
    icon: SlidersHorizontal,
    title: "Clear user controls",
    description: "People should be able to manage exports, visibility, and AI preferences without hunting for them.",
  },
  {
    icon: LockKeyhole,
    title: "Private by default",
    description: "Sensitive work should never feel public unless a user intentionally decides to share it.",
  },
];

export default function PrivacyPage() {
  return (
    <MarketingShell
      title="Privacy that supports trust, not just compliance"
      description="Cortex is designed to make AI-assisted coding feel safe, transparent, and respectful of the work developers create."
    >
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-white/8 bg-white/[0.04] p-6 sm:p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-200">How we think</div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">Trust is part of the product experience</h2>
          <p className="mt-4 text-base leading-8 text-slate-300">
            Privacy is not a hidden legal corner for us. It shapes how people feel when they write code, store ideas, and
            use AI-generated workflows inside Cortex.
          </p>
          <p className="mt-4 text-base leading-8 text-slate-300">
            That means clear settings, sensible defaults, and enough transparency that developers understand what is
            happening with their workspace data.
          </p>
        </div>

        <div className="rounded-[2rem] border border-emerald-400/20 bg-[linear-gradient(180deg,rgba(16,185,129,0.12),rgba(15,23,42,0.72))] p-6 sm:p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100">User controls</div>
          <div className="mt-6 space-y-4">
            {[
              "Download your account data when you need a copy.",
              "Adjust visibility and AI preference controls from Settings.",
              "Revoke sessions and clear saved histories with deliberate actions.",
            ].map((item) => (
              <div key={item} className="rounded-[1.5rem] border border-white/8 bg-slate-950/55 px-4 py-4 text-sm leading-7 text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {principles.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="rounded-[1.75rem] border border-white/8 bg-white/[0.04] p-6">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-sky-500/20 text-emerald-100">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-10 rounded-[2rem] border border-white/8 bg-white/[0.04] p-6 sm:p-8">
        <h2 className="text-3xl font-semibold tracking-tight text-white">What you can expect</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Transparent defaults",
              description: "Settings should explain what a control changes and why it matters.",
            },
            {
              title: "Minimal surprise",
              description: "We avoid product behavior that makes users guess how their data is being handled.",
            },
            {
              title: "Practical controls",
              description: "Privacy features should be useful in real workflows, not just present for show.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[1.5rem] border border-white/8 bg-slate-950/70 p-5">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
