"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts"



export const description = "A radar chart"

const chartData = [
  { topic: "If/Else", value: 186 },
  { topic: "Loops", value: 305 },
  { topic: "Math", value: 237 },
  { topic: "Bitwise", value: 273 },
  { topic: "Strings", value: 209 },
  { topic: "Mathcing", value: 214 },
  { topic: "Parsing", value: 214 },
  { topic: "Arrays", value: 214 },
  { topic: "Matrices", value: 214 },
  { topic: "Hash Maps", value: 214 },
  { topic: "Sets", value: 214 },
  { topic: "Stacks", value: 214 },
  { topic: "Queues", value: 214 },
  { topic: "Sorting", value: 214 },
  { topic: "Binary Search", value: 214 },
  { topic: "Two Pointers", value: 214 },
  { topic: "Sliding Window", value: 214 },
  { topic: "Recursion", value: 214 },
  { topic: "Dynamic Programming", value: 214 },
  { topic: "State Machines", value: 214 },
  { topic: "Date/Time", value: 214 },
  { topic: "Classes & Structs", value: 214 },
]







export function ChartRadarDefault() {
  return (
    <div className="w-full h-full"> 
    <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <Tooltip cursor={false} />
            <PolarAngleAxis dataKey="topic" />
            <PolarGrid />
            <Radar
              dataKey="value"
              fill="hsl(24 99% 47%)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
  )
}
