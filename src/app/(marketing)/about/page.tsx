// Page content only — `app/(marketing)/layout.tsx` wraps the whole segment in <MarketingShell>.

export default function AboutPage() {
  return (
    <>
      {/* Page Title Context Header */}
      <section className="mx-auto max-w-3xl pb-8 text-center sm:pb-10">
        <h1 className="font-display text-4xl font-semibold tracking-tight dark:text-content sm:text-5xl">
          About Cortex
        </h1>
        <p className="mt-4 text-base leading-7 dark:text-muted-foreground sm:text-lg">
          A small app for developers who want to keep their coding sharp without committing to another course.
        </p>
      </section>

      {/* Main Grid Content */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Your cards content here ... */}
      </section>
    </>
  );
}