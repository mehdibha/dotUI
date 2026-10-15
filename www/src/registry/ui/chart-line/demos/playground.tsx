"use client"

import type { ChartCurve } from "@/registry/ui/chart"
import { LineChart } from "@/registry/ui/chart-line"

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

export default function Demo({
  curve = "natural",
  points = false,
  strokeWidth = 2,
  grid = true,
  legend = false,
}: {
  curve?: ChartCurve
  points?: boolean
  strokeWidth?: number
  grid?: boolean
  legend?: boolean
} = {}) {
  return (
    <LineChart
      data={data}
      x="month"
      y={["desktop", "mobile"]}
      labels={{ desktop: "Desktop", mobile: "Mobile" }}
      curve={curve}
      points={points}
      strokeWidth={strokeWidth}
      grid={grid}
      legend={legend}
      ariaLabel="Desktop and mobile visitors, January through June"
    />
  )
}
