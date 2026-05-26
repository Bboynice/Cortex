import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/ month",
    description: "Free, no card. Enough to see if the daily loop works for you.",
    cta: "Start free",
    href: "/dashboard",
    featured: false,
    features: [
      "3 AI challenges per week",
      "Editor with run + feedback",
      "Streak and per-language scores",
    ],
  },
  {
    name: "Pro",
    price: "$8",
    period: "/ month",
    description: "Unlimited challenges and the full feedback loop. For people who actually open it daily.",
    cta: "Go Pro",
    href: "/dashboard",
    featured: true,
    features: [
      "Unlimited challenges",
      "Detailed AI feedback per submission",
      "Topic and difficulty tuning",
      "Faster generation",
    ],
  },
  {
    name: "Team",
    price: "$24",
    period: "/ month per seat",
    description: "Same product, shared. Useful for small teams or interview prep groups.",
    cta: "Contact us",
    href: "/about",
    featured: false,
    features: [
      "Everything in Pro",
      "Shared challenge library",
      "Team-wide streaks and scores",
      "Admin controls for AI defaults",
    ],
  },
];

const faqs = [
  {
    q: "Do I need a card to try it?",
    a: "No. Starter is free and lets you run challenges without entering payment info.",
  },
  {
    q: "What does Pro actually unlock?",
    a: "Unlimited generation, deeper per-submission feedback, and the ability to tune topic and difficulty.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. You keep your account either way — you just drop back to the Starter limits.",
  },
];

export default function PricingPage() {
  return (
    <>
      <section className="mx-auto w-full pb-8 text-start sm:pb-10">
        <h1 className="font-display text-4xl font-semibold tracking-tight dark:text-content sm:text-5xl">
          Choose your plan here.
        </h1>
        <p className="mt-4 text-base leading-7 dark:text-muted-foreground sm:text-lg">
          Simple plans. Start free, upgrade when you're ready.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={[
              "flex flex-col rounded-xl border dark:bg-muted/20 backdrop-blur-lg p-6 shadow-sm",
              plan.featured ? "dark:border-primary/40" : "dark:border-border",
            ].join(" ")}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold dark:text-content">{plan.name}</h3>
              {plan.featured ? (
                <span className="rounded-full border dark:border-primary/40 dark:bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider dark:text-primary">
                  Most popular
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-semibold dark:text-content">{plan.price}</span>
              <span className="text-sm dark:text-muted-foreground">{plan.period}</span>
            </div>

            <p className="mt-3 text-sm leading-6 dark:text-muted-foreground">{plan.description}</p>

            <Link
              href={plan.href}
              className={[
                "mt-6 inline-flex w-full items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition",
                plan.featured
                  ? "dark:bg-primary dark:text-primary-foreground hover:brightness-110 active:brightness-95"
                  : "border dark:border-border dark:bg-muted/20 dark:text-content dark:hover:bg-muted/30",
              ].join(" ")}
            >
              {plan.cta}
            </Link>

            <ul className="mt-6 space-y-2 border-t dark:border-border pt-5 text-sm dark:text-muted-foreground">
              {plan.features.map((f) => (
                <li key={f}>— {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-2 mb-3 px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider dark:text-muted-foreground">
            FAQ
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {faqs.map((item) => (
            <div
              key={item.q}
              className="rounded-xl border dark:border-border dark:bg-muted/20 backdrop-blur-lg p-5 shadow-sm"
            >
              <h3 className="text-base font-semibold dark:text-content">{item.q}</h3>
              <p className="mt-2 text-sm leading-6 dark:text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}