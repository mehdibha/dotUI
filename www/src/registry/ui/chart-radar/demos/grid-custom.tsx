"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { radarChart } from "@/registry/ui/chart-radar"

const data = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 285 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 203 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 264 },
]

const chart = defineChart(
  radarChart(data, {
    x: "month",
    y: "desktop",
    labels: { desktop: "Desktop" },
    gridShape: "circle",
    gridFill: 0.2,
    fill: 1,
  }),
)

export default function ChartRadarGridCustom() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
