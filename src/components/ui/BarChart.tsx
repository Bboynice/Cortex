"use client"

// 1. Aliased BarChart to RechartsBarChart to fix the naming collision
import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts"

const defaultChartData = [
  { date: "Friday", points: "+186" },
  { date: "Saturday", points: "+305" },
  { date: "Sunday", points: "+237" },
  { date: "Monday", points: "+730" },
  { date: "Tuesday", points: "+209" },
  { date: "Wednesday", points: "+214" },
  { date: "Thursday", points: "+214" },
]

interface BarChartProps {
  chartData?: {
    date: string;
    points: string;
  }[];
}

function formatBarDate(value: string): string {
  const parts = value.split("-");
  if (parts.length === 3) {
    const [dd, mm] = parts;
    return `${dd}/${mm}`;
  }
  return value;
}

export default function BarChart({ chartData = defaultChartData }: BarChartProps) {
  return (
    <div className="w-full h-[300px] bg-muted/20 rounded-lg shadow-sm backdrop-blur-lg flex justify-center items-center">
      <ResponsiveContainer width="90%" height="90%">
        <RechartsBarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={8}
            axisLine={false}
            interval={0}
            height={52}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={formatBarDate}
          />
          <Tooltip
            cursor
            filterNull={false}
            contentStyle={{
              backgroundColor: "hsl(var(--card)/0.9)",
              color: "hsl(var(--text))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Bar dataKey="points" fill="hsl(var(--primary))" radius={8} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}