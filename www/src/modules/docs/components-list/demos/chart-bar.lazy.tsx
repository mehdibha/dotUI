"use client"

import { defineChart } from "@tanstack/charts"
import { barY } from "@tanstack/charts/bar"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import { Chart, chartBand, chartLook } from "@/registry/ui/chart"

const data = [
  { browser: "Chrome", visitors: 187 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 275 },
  { browser: "Edge", visitors: 173 },
  { browser: "Other", visitors: 90 },
]

const chart = defineChart({
  scales: {
    x: { scale: chartBand },
    y: { scale: scaleLinear, nice: true, axis: false },
  },
  marks: [
    barY(data, {
      x: "browser",
      y: "visitors",
      color: "browser",
      z: "browser",
      radius: chartLook.barRadius,
      maxThickness: chartLook.barMaxThickness,
    }),
  ],
})

export default function ChartBarBrowsers() {
  return (
    <Chart definition={chart} height={96} ariaLabel="Visitors by browser" />
  )
}
