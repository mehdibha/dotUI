"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { areaChart } from "@/registry/ui/chart-area"

const data = [
  { month: "Jan", desktop: 186, mobile: 80, other: 45 },
  { month: "Feb", desktop: 305, mobile: 200, other: 100 },
  { month: "Mar", desktop: 237, mobile: 120, other: 150 },
  { month: "Apr", desktop: 73, mobile: 190, other: 50 },
  { month: "May", desktop: 209, mobile: 130, other: 100 },
  { month: "Jun", desktop: 214, mobile: 140, other: 160 },
]

const chart = defineChart(
  areaChart(data, {
    x: "month",
    y: ["desktop", "mobile", "other"],
    labels: { desktop: "Desktop", mobile: "Mobile", other: "Other" },
    stacked: true,
  }),
)

export default function ChartAreaStacked() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Visitors by device, stacked, January through June"
    />
  )
}
