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
    innerRadius: 0.3,
    track: true,
  }),
)

export default function ChartRadialVisitors() {
  return (
    <Chart definition={chart} height={108} ariaLabel="Visitors by browser" />
  )
}
