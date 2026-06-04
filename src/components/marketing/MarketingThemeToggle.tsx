import ThemeToggle from "@/src/components/ui/ThemeToogle";

type MarketingThemeToggleProps = {
  /** Extra classes on the dark glass shell (toggle component is unchanged). */
  className?: string;
};

/**
 * Wraps ThemeToggle in the same dark glass context as the platform Header
 * so white stroke styling stays visible on the marketing page in light theme.
 */
export default function MarketingThemeToggle({ className = "" }: MarketingThemeToggleProps) {
  return (
    <div
      className={[
        "flex shrink-0 items-stretch rounded-lg border border-white/10 bg-black/40 backdrop-blur-md shadow-sm",
        className,
      ].join(" ")}
    >
      <ThemeToggle />
    </div>
  );
}
