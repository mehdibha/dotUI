"use client"

import { AreaChart } from "@/registry/ui/chart-area"

const data = [
  { month: "Jan", desktop: 96 },
  { month: "Feb", desktop: 142 },
  { month: "Mar", desktop: 204 },
  { month: "Apr", desktop: 188 },
  { month: "May", desktop: 236 },
  { month: "Jun", desktop: 304 },
  { month: "Jul", desktop: 290 },
  { month: "Aug", desktop: 352 },
]

export default function ChartAreaVisitors() {
  return (
    <AreaChart
      data={data}
      x="month"
      y="desktop"
      labels={{ desktop: "Desktop" }}
      fill="gradient"
      strokeWidth={1.5}
      points
      height={96}
      grid={false}
      legend={false}
      ariaLabel="Desktop visitors, January through August"
    />
  )
}
