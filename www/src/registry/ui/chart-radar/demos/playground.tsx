"use client"

import { RadarChart } from "@/registry/ui/chart-radar"

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 273, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

export default function Demo({
  gridShape = "polygon",
  points = false,
  fill = 0.6,
  legend = false,
}: {
  gridShape?: "circle" | "polygon"
  points?: boolean
  fill?: number
  legend?: boolean
} = {}) {
  return (
    <RadarChart
      data={data}
      x="month"
      y={["desktop", "mobile"]}
      labels={{ desktop: "Desktop", mobile: "Mobile" }}
      gridShape={gridShape}
      points={points}
      fill={fill}
      legend={legend}
      ariaLabel="Desktop and mobile visitors, January through June"
    />
  )
}
