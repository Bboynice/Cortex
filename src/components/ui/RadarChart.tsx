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
    <div className="h-full w-full bg-muted/20 rounded-lg shadow-sm backdrop-blur-lg">
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
          <Tooltip cursor={false} />
          <PolarGrid stroke="rgba(255,255,255,0.25)" />
          <PolarAngleAxis
            dataKey="topic"
            tick={{ fontSize: 9, fill: "#fff" }}
            tickLine={false}
          />
          <Radar
            dataKey="value"
            fill="hsl(24 99% 47%)"
            fillOpacity={0.55}
            stroke="hsl(24 99% 47%)"
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
