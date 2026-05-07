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
      className={`flex flex-col rounded-lg bg-muted/20 backdrop-blur-lg p-4 shadow-sm w-full h-full ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between mb-2">
          <h3 className=" text-xl font-bold text-ai-glow">{title}</h3>
        </div>
      )}

      {description && (
        <p className="text-sm font-semibold  tracking-wider text-content mb-3">
          {description}
        </p>
      )}

      <div className="text-xs font-bold text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
