type IndicatorColor = 'green-500' | 'yellow-500' | 'red-500';

type ErrorIndicatorProps = {
  color: IndicatorColor;
  /**
   * Size in "tailwind units" (2 => 8px, 3 => 12px, etc.)
   */
  size: number;
};

const colorClass: Record<IndicatorColor, string> = {
  'green-500': 'bg-green-500',
  'yellow-500': 'bg-yellow-500',
  'red-500': 'bg-red-500',
};

export const ErrorIndicator = ({ color, size }: ErrorIndicatorProps) => {
  const px = Math.max(0, size) * 4;
  return <div className={`rounded-full ${colorClass[color]}`} style={{ width: px, height: px }} />;
};