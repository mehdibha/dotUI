"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { barChart } from "@/registry/ui/chart-bar"

const data = [
  { browser: "chrome", visitors: 187 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 275 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
]

const chart = defineChart(
  barChart(data, {
    x: "browser",
    y: "visitors",
    series: "browser",
    labels: {
      chrome: "Chrome",
      safari: "Safari",
      firefox: "Firefox",
      edge: "Edge",
      other: "Other",
    },
    grid: false,
  }),
)

export default function ChartBarBrowsers() {
  return (
    <Chart definition={chart} height={96} ariaLabel="Visitors by browser" />
  )
}
