"use client"

import { RadarChart } from "@/registry/ui/chart-radar"

const data = [
  { month: "Jan", desktop: 186, mobile: 160 },
  { month: "Feb", desktop: 185, mobile: 170 },
  { month: "Mar", desktop: 207, mobile: 180 },
  { month: "Apr", desktop: 173, mobile: 160 },
  { month: "May", desktop: 160, mobile: 190 },
  { month: "Jun", desktop: 174, mobile: 204 },
]

export default function ChartRadarLinesOnly() {
  return (
    <RadarChart
      data={data}
      x="month"
      y={["desktop", "mobile"]}
      labels={{ desktop: "Desktop", mobile: "Mobile" }}
      fill={0}
      spokes={false}
      ariaLabel="Desktop and mobile visitors, January through June"
    />
  )
}
