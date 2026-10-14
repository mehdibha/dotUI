"use client"

import { defineChart } from "@tanstack/charts"
import { barY } from "@tanstack/charts/bar"
import { ruleY } from "@tanstack/charts/rule"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import { Chart, chartBand, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "Jan", change: 186, trend: "Gain" },
  { month: "Feb", change: 205, trend: "Gain" },
  { month: "Mar", change: -207, trend: "Loss" },
  { month: "Apr", change: 173, trend: "Gain" },
  { month: "May", change: -209, trend: "Loss" },
  { month: "Jun", change: 214, trend: "Gain" },
]

const chart = defineChart({
  scales: {
    x: { scale: chartBand },
    y: {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: chartLook.valueAxis,
    },
  },
  marks: [
    // A baseline under the bars, so the sign flip reads as a crossing.
    ruleY([0], { stroke: "var(--color-border)" }),
    barY(data, {
      x: "month",
      y: "change",
      color: "trend",
      z: "trend",
      radius: chartLook.barRadius,
      maxThickness: chartLook.barMaxThickness,
    }),
  ],
})

export default function ChartBarNegative() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Monthly change in visitors, gains and losses"
    />
  )
}
