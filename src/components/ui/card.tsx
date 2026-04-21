interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export default function Card({ children, className, title, description }: CardProps) {
  return (
    <div className={`rounded-lg bg-muted/20 backdrop-blur-lg p-4 shadow-sm w-40 h-40`}>
      {title && <h2 className="text-lg font-semibold text-content">{title}</h2>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {children}
    </div>
  );
}