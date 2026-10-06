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

// Static, so the highlighted slice reads without hovering.
const chart = defineChart(
  pieChart(data, {
    value: "visitors",
    name: "browser",
    labels,
    innerRadius: 0.55,
    outerRadius: 0.88,
    activeIndex: 0,
    activeOffset: 0.12,
  }),
)

export default function ChartPieDonutActive() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Visitors by browser, with Chrome highlighted"
    />
  )
}
