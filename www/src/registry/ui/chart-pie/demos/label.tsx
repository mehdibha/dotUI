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

const chart = defineChart(
  pieChart(data, {
    value: "visitors",
    name: "browser",
    labels,
    sliceLabel: "value",
    sliceLabelRadius: 0.72,
  }),
)

export default function ChartPieLabel() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Visitors by browser, with values on the slices"
    />
  )
}
