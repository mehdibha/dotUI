"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { lineChart } from "@/registry/ui/chart-line"

const data = [
  { month: "January", desktop: 18600 },
  { month: "February", desktop: 30500 },
  { month: "March", desktop: 23700 },
  { month: "April", desktop: 7300 },
  { month: "May", desktop: 20900 },
  { month: "June", desktop: 21400 },
]

const compact = new Intl.NumberFormat("en-US", { notation: "compact" })

/* The axis formats are the tooltip's too. */
const chart = defineChart(
  lineChart(data, {
    x: "month",
    y: "desktop",
    labels: { desktop: "Desktop" },
    axes: true,
    formatX: (value) => String(value).slice(0, 3),
    formatY: (value) => compact.format(Number(value)),
  }),
)

export default function ChartLineAxes() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
