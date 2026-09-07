"use client"

import { BarChart } from "@/registry/ui/chart-bar"

const data = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 214 },
]

export default function ChartBarDefault() {
  return (
    <BarChart
      data={data}
      x="month"
      y="desktop"
      labels={{ desktop: "Desktop" }}
      legend={false}
      ariaLabel="Desktop visitors per month, January through June"
    />
  )
}
