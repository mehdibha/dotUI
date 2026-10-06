"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { lineChart } from "@/registry/ui/chart-line"

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

const chart = defineChart(
  lineChart(data, {
    x: "month",
    y: "desktop",
    labels: { desktop: "Desktop" },
    grid: false,
  }),
)

export default function ChartLineVisitors() {
  return (
    <Chart
      definition={chart}
      height={92}
      ariaLabel="Desktop visitors, January through August"
    />
  )
}
