"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { radialChart } from "@/registry/ui/chart-radial"

const data = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
]

const chart = defineChart(
  radialChart(data, {
    value: "visitors",
    name: "browser",
    labels: {
      chrome: "Chrome",
      safari: "Safari",
      firefox: "Firefox",
      edge: "Edge",
      other: "Other",
    },
    innerRadius: 0.25,
    radiusRatio: 0.95,
    track: true,
    barLabels: true,
  }),
)

export default function ChartRadialLabel() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Visitors by browser, each ring labelled"
    />
  )
}
