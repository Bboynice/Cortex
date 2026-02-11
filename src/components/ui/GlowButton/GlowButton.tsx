import "./GlowButton.css";

type ButtonColor = "primary" | "card" | "foreground" | "background" | "accent";

type ButtonRoundness = 0 | 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32;

type ButtonHeight = 5 | 10 | 15 | 20 | 25 | 30;
type ButtonWidth = 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50;

interface MyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  color?: ButtonColor;
  effect?: "glow" | "none",
  roundness?: ButtonRoundness,
  height?: ButtonHeight,
  width?: ButtonWidth;
}


export default function MyButton({
  children,
  onClick,
  className = "",
  color = "primary",
  effect = "none",
  roundness = 16 as ButtonRoundness,
  height = 10 as ButtonHeight,
  width = 10 as ButtonWidth,
}: MyButtonProps) {
  const colorClass =
    {
      primary: "bg-primary text-primary-foreground",
      card: "bg-card text-content border border-border",
      foreground: "bg-foreground text-content",
      background: "bg-background text-content border border-border",
      accent: "bg-accent text-accent-foreground border border-border",
    }[color] ?? "bg-primary text-primary-foreground";

  // Don't use dynamic Tailwind classes like `rounded-[${roundness}px]`:
  // Tailwind can't generate CSS for runtime-interpolated class names.
  const roundnessPx = `${roundness}px`;

  return (
    <button
      onClick={onClick}
      className={`
        relative
        flex
        items-center
        justify-center
        min-h-${height}
        min-w-[${width}rem]
        rounded-2xl
        uppercase
        font-medium
        text-base
        ${colorClass}
        hover:brightness-110
        active:bg-white/10
        transition
        overflow-hidden
        ${className}
      `}
      style={{
        ["--thickness" as any]: "0.3rem",
        ["--roundness" as any]: roundnessPx,
        ["--color" as any]: "#ffdacc", // Updated to orange glow
        ["--opacity" as any]: "0.65",
        fontSize: "1.2rem",
        borderRadius: roundnessPx,
      }}
    >
      {children}

      {effect === "glow" && (
        <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          className="glow-rect"
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx="var(--roundness)" // Dynamically match button roundness
          ry="var(--roundness)" // Dynamically match button roundness
        />
      </svg>
      )}
    </button>
  );
}