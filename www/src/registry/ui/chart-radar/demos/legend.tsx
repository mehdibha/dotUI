"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { radarChart } from "@/registry/ui/chart-radar"

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 273, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const chart = defineChart(
  radarChart(data, {
    x: "month",
    y: ["desktop", "mobile"],
    labels: { desktop: "Desktop", mobile: "Mobile" },
    legend: true,
  }),
)

export default function ChartRadarLegend() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop and mobile visitors, January through June"
    />
  )
}
