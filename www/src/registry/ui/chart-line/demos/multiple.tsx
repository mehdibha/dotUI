"use client"

import { LineChart } from "@/registry/ui/chart-line"

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

export default function ChartLineMultiple() {
  return (
    <LineChart
      data={data}
      x="month"
      y={["desktop", "mobile"]}
      labels={{ desktop: "Desktop", mobile: "Mobile" }}
      curve="monotone"
      axes="x"
      ariaLabel="Desktop and mobile visitors, January through June"
    />
  )
}
