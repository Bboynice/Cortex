"use client"

// 1. Aliased BarChart to RechartsBarChart to fix the naming collision
import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts"

const defaultChartData = [
  { month: "Friday", points: "+186" },
  { month: "Saturday", points: "+305" },
  { month: "Sunday", points: "+237" },
  { month: "Monday", points: "+730" },
  { month: "Tuesday", points: "+209" },
  { month: "Wednesday", points: "+214" },
  { month: "Thursday", points: "+214" },
]

interface BarChartProps {
  chartData?: {
    month: string;
    points: string;
  }[];
}

export default function BarChart({ chartData = defaultChartData }: BarChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <Tooltip cursor={false} />
          {/* 3. Used a raw hex color instead of a variable */}
          <Bar dataKey={`points`} fill="hsl(24 99% 47%)" radius={8} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}