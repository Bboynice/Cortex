"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, } from "recharts"

const defaultChartData = [
  { language: "Python", points: 1, },
  { language: "JavaScript", points: 2, },
  { language: "Rust", points: 3, },
]


interface PieChartProps {
  chartData: {
    language: string;
    points: number;
  }[];
}

const COLORS = ["hsl(24 99% 47%)", "hsl(20 98% 39%)", "hsl(20 98% 39%)", "hsl(20 98% 39%)", "hsl(20 98% 39%)", "hsl(20 98% 39%)"]

export default function MyPieChart({ chartData = defaultChartData }: PieChartProps) {

  return (
    <div className="w-full h-full">
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          
          <Pie
            data={chartData}
            dataKey="points"       // The numeric value deciding the size of the slice
            nameKey="language"         // The label for the slice
            cx="50%"                // Centers the pie horizontally
            cy="50%"                // Centers the pie vertically
            outerRadius={100}       // The size of the pie
            fill="#8884d8"
            label                   // Optional: Draws lines with labels pointing to slices
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />

          
        </PieChart>
      </ResponsiveContainer>
      
    </div>
  )
}