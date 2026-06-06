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

export default function BarChart({ chartData = defaultChartData }: BarChartProps) {
  return (
    <div className="w-full h-[300px] bg-muted/20 rounded-lg shadow-sm backdrop-blur-lg flex justify-center items-center">
      <ResponsiveContainer width="90%" height="90%">
        <RechartsBarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <Tooltip cursor={true} />
          <Bar dataKey={`points`} fill="hsl(24 99% 47%)" radius={8} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}