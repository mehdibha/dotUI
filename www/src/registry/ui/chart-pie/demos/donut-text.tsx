"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { pieChart } from "@/registry/ui/chart-pie"

const data = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
]

const labels = {
  chrome: "Chrome",
  safari: "Safari",
  firefox: "Firefox",
  edge: "Edge",
  other: "Other",
}

const total = data.reduce((sum, row) => sum + row.visitors, 0)

const chart = defineChart(
  pieChart(data, {
    value: "visitors",
    name: "browser",
    labels,
    innerRadius: 0.6,
  }),
)

export default function ChartPieDonutText() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Visitors by browser, with the total in the centre"
    >
      {/* Real text, not a mark competing for focus. */}
      <div className="flex h-full flex-col items-center justify-center">
        <span className="text-3xl font-bold">{total}</span>
        <span className="text-sm text-fg-muted">Visitors</span>
      </div>
    </Chart>
  )
}
