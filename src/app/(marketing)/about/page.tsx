import MarketingShell from "@/src/components/marketing/MarketingShell";

const values = [
  {
    title: "Practice over content",
    description:
      "Most coding learners don't need more videos. They need a small problem to solve, today, and feedback on what they wrote.",
  },
  {
    title: "Less interface",
    description:
      "The dashboard, the editor, the feedback panel — all on one screen. Nothing to configure before you start.",
  },
  {
    title: "AI as a coach, not a writer",
    description:
      "Cortex won't write your solution for you. It generates the task, points out what's off, and lets you fix it.",
  },
];

export default function AboutPage() {
  return (
    <MarketingShell
      title="About Cortex"
      description="A small app for developers who want to keep their coding sharp without committing to another course."
    >
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border dark:border-border dark:bg-muted/20 backdrop-blur-lg p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight dark:text-content">Why this exists</h2>
          <p className="mt-4 text-sm leading-7 dark:text-muted-foreground sm:text-base">
            Most people who want to get better at coding already know the bottleneck — they just don&apos;t practice
            enough. The hard part isn&apos;t finding tutorials, it&apos;s opening one every day and writing something
            small.
          </p>
          <p className="mt-4 text-sm leading-7 dark:text-muted-foreground sm:text-base">
            Cortex is built around that. Generate a problem, write the solution, run it, get feedback, repeat. No
            elaborate path, no gamification on top of gamification.
          </p>
        </div>

        <div className="rounded-xl border dark:border-border dark:bg-muted/20 backdrop-blur-lg p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight dark:text-content">What it isn&apos;t</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 dark:text-muted-foreground">
            <li>— Not a Leetcode replacement. Different problems, different goals.</li>
            <li>— Not an AI that writes code for you. You still write the solution.</li>
            <li>— Not a course. There&apos;s no curriculum to finish.</li>
            <li>— Not a productivity dashboard. The metrics are for you, not your boss.</li>
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-2 mb-3 px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider dark:text-muted-foreground">
            What we care about
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-xl border dark:border-border dark:bg-muted/20 backdrop-blur-lg p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold dark:text-content">{value.title}</h3>
              <p className="mt-2 text-sm leading-6 dark:text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
