type BadgeProps = { variant: 'success' | 'warning' | 'error' | 'neutral', children: React.ReactNode };

export const Badge = ({ variant, children }: BadgeProps) => {
  const styles = {
    success: "bg-green-100 text-green-700 border-green-200",
    warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
    error: "bg-red-100 text-red-700 border-red-200",
    neutral: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return <span className={`px-4 py-2 text-md font-bold rounded-full border ${styles[variant]}`}>{children}</span>;
};