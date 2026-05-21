'use client';

import * as React from "react";
import { motion } from "framer-motion";

export type SegmentedControlChoice<T extends string = string> = {
  value: T;
  label: string;
  icon?: React.ReactNode;
};

interface SegmentedControlProps<T extends string = string> {
  choices: SegmentedControlChoice<T>[];
  value?: T; // controlled
  defaultValue?: T; // uncontrolled
  onChange?: (value: T) => void;
  className?: string;
}

export default function SegmentedControl<T extends string = string>({
  choices,
  value,
  defaultValue,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const first = choices[0]?.value;
  const [internal, setInternal] = React.useState<T | undefined>(defaultValue ?? first);

  React.useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  const active = value ?? internal ?? first;

  return (
    <div
      role="tablist"
      className={[
        "theme-sync relative inline-flex w-full items-stretch gap-1 rounded-2xl border border-border bg-card p-1 text-content shadow-sm backdrop-blur",
        className ?? "",
      ].join(" ")}
    >
      {choices.map((choice) => {
        const selected = choice.value === active;

        return (
          <button
            key={choice.value}
            role="tab"
            aria-selected={selected}
            type="button"
            onClick={() => {
              setInternal(choice.value);
              onChange?.(choice.value);
            }}
            className={[
              "relative flex flex-1 items-center justify-center gap-2 rounded-xl bg-transparent px-4 py-2.5",
              "text-sm font-semibold",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35",
              selected ? "text-primary" : "text-muted-foreground hover:text-content",
            ].join(" ")}
          >
            {selected && (
              <motion.span
                layoutId="segmented-active"
                className="absolute inset-0 rounded-xl bg-muted/40 shadow-sm ring-1 ring-border"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}

            <span className="relative z-10 inline-flex items-center gap-2">
              {choice.icon}
              {choice.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}