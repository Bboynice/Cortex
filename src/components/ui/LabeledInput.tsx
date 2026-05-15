'use client';

import * as React from "react";

/** Matches contact form field line: underline inputs, transparent dark bg */
const fieldLine =
  "w-full rounded-none border-0 border-b pb-2 pt-3 " +
  "dark:border-border dark:bg-transparent dark:text-content dark:placeholder:text-muted-foreground " +
  "focus-visible:outline-none focus-visible:ring-0 dark:focus-visible:border-primary " +
  "transition-[border-color] duration-150 disabled:cursor-not-allowed";

const fieldMultiline = "min-h-[6rem] resize-y";

type SharedLabeledProps = {
  label?: string;
  helperText?: string;
  errorText?: string;
  containerClassName?: string;
  labelClassName?: string;
};

export type LabeledInputProps = SharedLabeledProps &
  (
    | (Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof SharedLabeledProps | "multiline"> & {
        multiline?: false;
      })
    | (Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof SharedLabeledProps | "multiline"> & {
        multiline: true;
      })
  );

export default function LabeledInput(props: LabeledInputProps) {
  const {
    label,
    helperText,
    errorText,
    containerClassName,
    labelClassName,
    className,
    id,
    multiline,
    ...rest
  } = props;

  const autoId = React.useId();
  const inputId = id ?? autoId;
  const helperId = helperText ? `${inputId}-help` : undefined;
  const errorId = errorText ? `${inputId}-error` : undefined;

  const controlClassName = [
    fieldLine,
    multiline ? fieldMultiline : "",
    errorText ? "dark:!border-red-500/60 dark:focus-visible:!border-red-500/70" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={["flex w-full flex-col gap-2", containerClassName].filter(Boolean).join(" ")}>
      {label ? (
        <label
          htmlFor={inputId}
          className={["text-sm font-semibold text-muted-foreground", labelClassName].filter(Boolean).join(" ")}
        >
          {label}
        </label>
      ) : null}

      {multiline ? (
        <textarea
          id={inputId}
          className={controlClassName}
          aria-invalid={Boolean(errorText) || undefined}
          aria-describedby={describedBy}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={inputId}
          className={controlClassName}
          aria-invalid={Boolean(errorText) || undefined}
          aria-describedby={describedBy}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

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
