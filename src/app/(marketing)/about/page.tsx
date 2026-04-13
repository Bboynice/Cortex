import { BrainCircuit, Compass, Rocket, ShieldCheck } from "lucide-react";
import MarketingShell from "@/src/components/marketing/MarketingShell";

const values = [
  {
    icon: BrainCircuit,
    title: "Practice over posturing",
    description: "We care more about helping people get better than making learning look impressive from a distance.",
  },
  {
    icon: Compass,
    title: "Clarity over clutter",
    description: "Every interaction should reduce uncertainty and make the next step obvious for the user.",
  },
  {
    icon: Rocket,
    title: "Momentum over intensity",
    description: "Consistent, well-designed repetition beats occasional bursts of effort that do not stick.",
  },
  {
    icon: ShieldCheck,
    title: "Trust by default",
    description: "AI products should be transparent, privacy-aware, and respectful of the work people put into them.",
  },
];

export default function AboutPage() {
  return (
    <MarketingShell
      title="Built for developers who want real progress"
      description="Cortex exists to make technical growth feel structured, motivating, and worth returning to every day."
    >
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-white/8 bg-white/[0.04] p-6 sm:p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-200">Our story</div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white">Learning to code rarely fails because of ambition</h2>
          <p className="mt-4 text-base leading-8 text-slate-300">
            It usually fails because the path from “I want to improve” to “I know exactly what to do next” is too messy.
            Cortex was created to close that gap with AI-generated practice that feels focused, modern, and repeatable.
          </p>
          <p className="mt-4 text-base leading-8 text-slate-300">
            Instead of endless content and vague productivity promises, we want to give developers a sharper loop:
            generate a challenge, ship a solution, get feedback, reflect, and keep going.
          </p>
        </div>

        <div className="rounded-[2rem] border border-orange-400/20 bg-[linear-gradient(180deg,rgba(249,115,22,0.12),rgba(15,23,42,0.72))] p-6 sm:p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-100">What we believe</div>
          <div className="mt-6 space-y-4">
            {[
              "Great tooling should make disciplined practice easier, not noisier.",
              "AI is most useful when it accelerates judgment, not just output.",
              "The best developer products create confidence through repetition and clarity.",
            ].map((belief) => (
              <div key={belief} className="rounded-[1.5rem] border border-white/8 bg-slate-950/55 px-4 py-4 text-sm leading-7 text-slate-200">
                {belief}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white">The principles shaping Cortex</h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            The product should feel as intentional as the practice habits it is trying to build.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;

            return (
              <div key={value.title} className="rounded-[1.75rem] border border-white/8 bg-white/[0.04] p-6">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/25 to-sky-500/25 text-orange-100">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-white">{value.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{value.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10 rounded-[2rem] border border-white/8 bg-white/[0.04] p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { value: "18k+", label: "missions completed in early usage" },
            { value: "92%", label: "of active users return for another session" },
            { value: "1 goal", label: "make developer growth more deliberate" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[1.5rem] border border-white/8 bg-slate-950/70 p-5">
              <div className="text-3xl font-semibold text-white">{stat.value}</div>
              <div className="mt-2 text-sm text-slate-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}

