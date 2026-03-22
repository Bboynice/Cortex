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
        "relative inline-flex w-full items-stretch gap-1 rounded-2xl p-1",
        "border border-border bg-foreground/60 backdrop-blur",
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
              "relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5",
              "text-sm font-semibold transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              selected ? "text-primary" : "text-muted hover:text-content",
            ].join(" ")}
          >
            {selected && (
              <motion.span
                layoutId="segmented-active"
                className="absolute inset-0 rounded-xl bg-white/6 shadow-sm ring-1 ring-white/10"
                transition={{ type: "spring", stiffness: 520, damping: 42 }}
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