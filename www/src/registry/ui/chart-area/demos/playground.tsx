"use client"

import { AreaChart, type AreaChartProps } from "@/registry/ui/chart-area"

type Props = AreaChartProps<(typeof data)[number]>

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
  stacked = false,
  points = false,
  grid = true,
  legend = false,
  axes = "x",
}: {
  curve?: Props["curve"]
  stacked?: Props["stacked"]
  points?: boolean
  grid?: boolean
  legend?: boolean
  axes?: Props["axes"]
} = {}) {
  return (
    <AreaChart
      data={data}
      x="month"
      y={["desktop", "mobile"]}
      labels={{ desktop: "Desktop", mobile: "Mobile" }}
      curve={curve}
      stacked={stacked}
      points={points}
      grid={grid}
      legend={legend}
      axes={axes}
      ariaLabel="Desktop and mobile visitors, January through June"
    />
  )
}
