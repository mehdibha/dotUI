"use client"

import { LineChart } from "@/registry/ui/chart-line"

const data = [
  { month: "Jan", desktop: 210 },
  { month: "Feb", desktop: 250 },
  { month: "Mar", desktop: 236 },
  { month: "Apr", desktop: 150 },
  { month: "May", desktop: 120 },
  { month: "Jun", desktop: 168 },
  { month: "Jul", desktop: 270 },
  { month: "Aug", desktop: 330 },
]

export default function ChartLineVisitors() {
  return (
    <LineChart
      data={data}
      x="month"
      y="desktop"
      labels={{ desktop: "Desktop" }}
      strokeWidth={2}
      height={92}
      grid={false}
      legend={false}
      ariaLabel="Desktop visitors, January through August"
    />
  )
}
