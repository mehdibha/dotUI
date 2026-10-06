"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { radarChart } from "@/registry/ui/chart-radar"

const data = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 273 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 214 },
]

const chart = defineChart(
  radarChart(data, {
    x: "month",
    y: "desktop",
    labels: { desktop: "Desktop" },
    gridShape: "circle",
    gridFill: 0.2,
    fill: 0.5,
  }),
)

export default function ChartRadarGridCircleFill() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
