"use client"

import { LineChart } from "@/registry/ui/chart-line"

const data = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 214 },
]

export default function ChartLineLinear() {
  return (
    <LineChart
      data={data}
      x="month"
      y="desktop"
      labels={{ desktop: "Desktop" }}
      legend={false}
      curve="linear"
      axes="x"
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
