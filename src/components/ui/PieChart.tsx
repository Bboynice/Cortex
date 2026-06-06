"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const defaultChartData = [
  { language: "Python", points: 45 },
  { language: "JavaScript", points: 30 },
  { language: "Rust", points: 15 },
];

interface PieChartProps {
  chartData?: { language: string; points: number }[];
}

const COLORS = ["#ef4444", "#f97316", "#a855f7"];

export default function MyPieChart({ chartData = defaultChartData }: PieChartProps) {
  return (
    <div className="h-full w-full bg-muted/20 rounded-lg shadow-sm backdrop-blur-lg">
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 280, height: 200 }}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="points"
            nameKey="language"
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius="78%"
            paddingAngle={0}
            stroke="#fff"
            strokeWidth={1}
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.language} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", color: "#fff" }}
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
