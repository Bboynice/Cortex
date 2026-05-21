interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export default function Card({
  children,
  className = "",
  title,
  description,
}: CardProps) {
  return (
    <div
      className={`theme-sync flex h-full w-full flex-col rounded-lg bg-muted/20 p-4 shadow-sm backdrop-blur-lg ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ai-glow">{title}</h2>
        </div>
      )}

      {description && (
        <p className="mt-1 text-sm font-semibold tracking-wider text-content">
          {description}
        </p>
      )}

      <div className="text-xs font-bold text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
