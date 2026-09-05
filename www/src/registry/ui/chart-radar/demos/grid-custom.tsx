"use client"

import { RadarChart } from "@/registry/ui/chart-radar"

const data = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 285 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 203 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 264 },
]

export default function ChartRadarGridCustom() {
  return (
    <RadarChart
      data={data}
      x="month"
      y="desktop"
      labels={{ desktop: "Desktop" }}
      legend={false}
      gridShape="circle"
      gridFill={0.2}
      fill={1}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
