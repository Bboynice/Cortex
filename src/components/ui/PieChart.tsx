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
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="points"
            nameKey="language"
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius="90%"
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
            iconSize={12}
            wrapperStyle={{ fontSize: "11px", color: "#fff" }}
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
