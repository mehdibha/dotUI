"use client"

import { defineChart } from "@tanstack/charts"
import { barX } from "@tanstack/charts/bar"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import { Chart, chartBand, chartLook } from "@/registry/ui/chart"

const data = [
  { browser: "Chrome", visitors: 275 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 187 },
  { browser: "Edge", visitors: 173 },
  { browser: "Other", visitors: 90 },
]

// One series per category: every bar lands on its own palette slot.
const chart = defineChart({
  scales: {
    x: {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: chartLook.valueAxis,
    },
    y: { scale: chartBand },
  },
  marks: [
    barX(data, {
      x: "visitors",
      y: "browser",
      color: "browser",
      z: "browser",
      radius: chartLook.barRadius,
      maxThickness: chartLook.barMaxThickness,
    }),
  ],
  focus: "group-y",
})

export default function ChartBarMixed() {
  return <Chart definition={chart} ariaLabel="Visitors by browser" />
}
