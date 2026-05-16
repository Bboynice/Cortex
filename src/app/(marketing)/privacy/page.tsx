const principles = [
  {
    title: "Your code is yours",
    description: "What you write in the editor stays in your account. We don't train external models on it and we don't sell it.",
  },
  {
    title: "Minimal collection",
    description: "We collect what's needed to run the product: account, code submissions, AI feedback. Nothing extra for ads or analytics resale.",
  },
  {
    title: "Easy to leave",
    description: "Delete your account from Settings and your data goes with it. No retention games, no email loops to escape.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl py-8 text-center sm:py-12">
        <h1 className="font-display text-4xl font-semibold tracking-tight dark:text-content sm:text-5xl">
          Privacy
        </h1>
        <p className="mt-4 text-base leading-7 dark:text-muted-foreground sm:text-lg">
          A short page about what we collect, why, and what you can do about it.
        </p>
      </section>

      <section className="rounded-xl border dark:border-border dark:bg-muted/20 backdrop-blur-lg p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight dark:text-content">The short version</h2>
        <p className="mt-4 text-sm leading-7 dark:text-muted-foreground sm:text-base">
          Cortex stores your account and the code you write so the product can work. The AI feedback is generated
          per request and isn&apos;t used to train any external model. You can export or delete your data from
          Settings whenever you want.
        </p>
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-2 mb-3 px-1">
          <h2 className="text-sm font-semibold uppercase tracking-wider dark:text-muted-foreground">
            Principles
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border dark:border-border dark:bg-muted/20 backdrop-blur-lg p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold dark:text-content">{p.title}</h3>
              <p className="mt-2 text-sm leading-6 dark:text-muted-foreground">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl border dark:border-border dark:bg-muted/20 backdrop-blur-lg p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight dark:text-content">Your controls</h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 dark:text-muted-foreground">
          <li>— Export your account data from Settings.</li>
          <li>— Adjust AI and visibility preferences from Settings.</li>
          <li>— Delete your account at any time. Removal is permanent.</li>
        </ul>
      </section>
    </>
  );
}