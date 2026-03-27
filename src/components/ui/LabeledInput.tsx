'use client';

import * as React from "react";

export type LabeledInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  errorText?: string;
  containerClassName?: string;
};

export default function LabeledInput({
  label,
  helperText,
  errorText,
  containerClassName,
  className,
  id,
  ...props
}: LabeledInputProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  const helperId = helperText ? `${inputId}-help` : undefined;
  const errorId = errorText ? `${inputId}-error` : undefined;

  return (
    <div className={["flex w-full flex-col gap-2", containerClassName].filter(Boolean).join(" ")}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-muted-foreground">
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={[
          "h-12 w-full rounded-xl border border-border bg-background/40 px-4 text-sm text-content shadow-sm",
          "outline-none ring-0 transition focus:border-primary/60 focus:bg-background/55",
          errorText ? "border-red-500/50 focus:border-red-500/60" : "",
          className ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-invalid={Boolean(errorText) || undefined}
        aria-describedby={[helperId, errorId].filter(Boolean).join(" ") || undefined}
        {...props}
      />

      {errorText ? (
        <p id={errorId} className="text-xs font-medium text-red-400">
          {errorText}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}