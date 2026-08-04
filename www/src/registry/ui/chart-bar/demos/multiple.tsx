"use client"

import { BarChart } from "@/registry/ui/chart-bar"

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

export default function ChartBarMultiple() {
  return (
    <BarChart
      data={data}
      x="month"
      y={["desktop", "mobile"]}
      labels={{ desktop: "Desktop", mobile: "Mobile" }}
      formatY={{ locale: "en-US", number: { notation: "compact" } }}
      ariaLabel="Desktop and mobile visitors per month, side by side"
    />
  )
}
