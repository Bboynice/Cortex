'use client';

import * as React from "react";

/** Shared underline field chrome */
const fieldBase =
  "cortex-field theme-sync w-full rounded-none border-0 border-b !bg-transparent pb-2 pt-3 " +
  "focus-visible:outline-none focus-visible:ring-0 focus-visible:border-primary " +
  "disabled:cursor-not-allowed";

/** Theme tokens — for settings, dashboard, etc. */
const surfaceDefault =
  "border-border text-content placeholder:text-muted-foreground ";

/**
 * Fixed light-on-dark colors for `bg-cortex-heat` / dark glass forms.
 * Does not use `--text` / `--muted-foreground`, so light app theme cannot wash out placeholders.
 */

const fieldMultiline = "min-h-[6rem] resize-y";

export type LabeledInputSurface = "default" | "heat";

type SharedLabeledProps = {
  label?: string;
  helperText?: string;
  errorText?: string;
  containerClassName?: string;
  labelClassName?: string;
  /** `heat` = contact / cortex-heat (always white field text). `default` = follows :root / .dark tokens. */
  surface?: LabeledInputSurface;
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
    surface = "default",
    ...rest
  } = props;

  const autoId = React.useId();
  const inputId = id ?? autoId;
  const helperId = helperText ? `${inputId}-help` : undefined;
  const errorId = errorText ? `${inputId}-error` : undefined;

  const controlClassName = [
    fieldBase,
    surfaceDefault,
    multiline ? fieldMultiline : "",
    errorText ? "!border-red-500/60 focus-visible:!border-red-500/70" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      className={["theme-sync flex w-full flex-col gap-2", containerClassName].filter(Boolean).join(" ")}
    >
      {label ? (
        <label
          htmlFor={inputId}
          className={[
            "text-sm font-semibold text-muted-foreground",
            labelClassName,
          ]
            .filter(Boolean)
            .join(" ")}
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
        <p id={errorId} className="text-xs font-medium text-red-500">
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