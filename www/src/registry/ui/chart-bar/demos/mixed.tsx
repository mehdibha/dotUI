"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { barChart } from "@/registry/ui/chart-bar"

const data = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
]

// One series per category: every bar lands on its own palette slot.
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
    horizontal: true,
  }),
)

export default function ChartBarMixed() {
  return <Chart definition={chart} ariaLabel="Visitors by browser" />
}
