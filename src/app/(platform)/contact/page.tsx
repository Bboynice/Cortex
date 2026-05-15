'use client';

import GlowButton from "@/src/components/ui/GlowButton/GlowButton";
import LabeledInput from "@/src/components/ui/LabeledInput";

export default function ContactPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto pb-14 pt-24 md:pb-16 md:pt-28 bg-cortex-heat ">
      <div className="mx-auto w-full  shrink-0 px-6">
        <header className="space-y-4 border-b pb-10 dark:border-white ">
          <h1 className="font-display text-3xl font-semibold tracking-tight dark:text-content">
            Contact
          </h1>
          <p className="text-base dark:text-muted-foreground">
            Do not hesitate to contact us if you have any questions or feedback.
          </p>
          <div className="flex flex-row gap-x-10 text-sm dark:text-muted-foreground justify-between w-full">
            <div>
              <div className="font-medium dark:text-content/80">Response time</div>
              <div className="mt-0.5">Admin is a student, so it make it a while to respond!</div>
            </div>
            <div>
              <div className="font-medium dark:text-content/80">Direct email</div>
              <div className="mt-0.5">
                <a
                  href="mailto:hello@cortex.sh"
                  className="underline underline-offset-4 transition-colors dark:text-content dark:hover:text-primary"
                >
                  hello@cortex.sh
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-10 flex w-full justify-center">
          <form
            className="flex w-full flex-col gap-6 rounded-lg border p-6 dark:border-border dark:bg-surface md:p-8"
            action="#"
            onSubmit={(e) => e.preventDefault()}
          >
            <LabeledInput type="text" name="name" placeholder="Name" autoComplete="name" />
            <LabeledInput type="email" name="email" placeholder="Email" autoComplete="email" />
            <LabeledInput type="text" name="topic" placeholder="Topic" />
            <LabeledInput multiline name="message" placeholder="Message" rows={4} />
            <div className="pt-2">
              <GlowButton effect="glow" roundness={16} onClick={() => {}}>
                Submit
              </GlowButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
