type PillProps = {
  text: string;
  variant?: "content" | "primary";
  className?: string;
};

export default function Pill({ text, variant = "content", className = "" }: PillProps) {
  const variants: Record<NonNullable<PillProps["variant"]>, string> = {
    content: "bg-content/15 text-muted-foreground",
    primary: "bg-primary/15 text-primary",
  };

  return (  
    <span
      className={[
        "inline-flex max-w-full items-center rounded-lg px-4 py-2 text-sm font-semibold leading-none whitespace-nowrap truncate",
        variants[variant],
        className,
      ].join(" ")}
    >
      {text}
    </span>
  );
}

