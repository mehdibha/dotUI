"use client"

import { defineChart } from "@tanstack/charts"
import { ruleY } from "@tanstack/charts/rule"

import { Chart } from "@/registry/ui/chart"
import { barChart } from "@/registry/ui/chart-bar"

const data = [
  { month: "Jan", change: 186, trend: "gain" },
  { month: "Feb", change: 205, trend: "gain" },
  { month: "Mar", change: -207, trend: "loss" },
  { month: "Apr", change: 173, trend: "gain" },
  { month: "May", change: -209, trend: "loss" },
  { month: "Jun", change: 214, trend: "gain" },
]

const bars = barChart(data, {
  x: "month",
  y: "change",
  series: "trend",
  labels: { gain: "Gain", loss: "Loss" },
})

// A baseline under the bars, so the sign flip reads as a crossing.
const chart = defineChart({
  ...bars,
  marks: [ruleY([0], { stroke: "var(--color-border)" }), ...bars.marks],
})

export default function ChartBarNegative() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Monthly change in visitors, gains and losses"
    />
  )
}
