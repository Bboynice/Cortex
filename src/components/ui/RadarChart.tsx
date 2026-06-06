"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export const description = "A radar chart";

const defaultChartData = [
  { topic: "If/Else", value: 186 },
  { topic: "Loops", value: 305 },
  { topic: "Math", value: 237 },
  { topic: "Arrays", value: 214 },
  { topic: "Sorting", value: 214 },
  { topic: "Recursion", value: 214 },
  { topic: "DP", value: 214 },
];

interface RadarChartProps {
  chartData?: { topic: string; value: number }[];
}

export function ChartRadarDefault({ chartData = defaultChartData }: RadarChartProps) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={0}
        initialDimension={{ width: 280, height: 260 }}
      >
        <RadarChart
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius="65%"
          margin={{ top: 12, right: 20, bottom: 12, left: 20 }}
        >
          <Tooltip
            cursor={true}
            filterNull={false}
            contentStyle={{
              backgroundColor: "hsl(var(--card)/0.9)",
              color: "hsl(var(--text))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              cursor: "hsl(var(--primary))",
            }}
          />
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="topic"
            tick={{ fontSize: 9, fill: "hsl(var(--text))" }}
            tickLine={false}
          />
          <Radar
            dataKey="value"
            fill="hsl(var(--primary))"
            fillOpacity={0.65}
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 2, fill: "hsl(var(--primary))" }}
            activeDot={{
              r: 4,
              fill: "hsl(var(--primary))",
              stroke: "hsl(var(--card))",
              strokeWidth: 2,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
