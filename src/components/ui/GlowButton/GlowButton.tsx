import "./GlowButton.css";

interface MyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}


export default function MyButton({
  children,
  onClick,
  className = "",
}: MyButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative
        flex
        items-center
        justify-center
        min-h-10
        min-w-[10rem]
        rounded-2xl
        text-white
        uppercase
        font-medium
        text-base
        sm:text-2xl
        backdrop-blur-[100px]
        bg-orange-500/100
        hover:brightness-110
        active:bg-white/10
        transition
        overflow-hidden
        ${className}
      `}
      style={{
        ["--thickness" as any]: "0.3rem",
        ["--roundness" as any]: "16px",
        ["--color" as any]: "#ffdacc", // Updated to orange glow
        ["--opacity" as any]: "0.65",
        fontSize: "1.2rem",
      }}
    >
      {children}

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
    </button>
  );
}