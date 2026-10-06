"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { areaChart } from "@/registry/ui/chart-area"

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

const chart = defineChart(
  areaChart(data, {
    x: "month",
    y: "desktop",
    labels: { desktop: "Desktop" },
    fill: "gradient",
    strokeWidth: 1.5,
    points: true,
    grid: false,
  }),
)

export default function ChartAreaVisitors() {
  return (
    <Chart
      definition={chart}
      height={96}
      ariaLabel="Desktop visitors, January through August"
    />
  )
}
