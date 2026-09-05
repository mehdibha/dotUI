"use client"

import { ruleY } from "@tanstack/charts/rule"

import { BarChart } from "@/registry/ui/chart-bar"

const data = [
  { month: "Jan", change: 186, trend: "gain" },
  { month: "Feb", change: 205, trend: "gain" },
  { month: "Mar", change: -207, trend: "loss" },
  { month: "Apr", change: 173, trend: "gain" },
  { month: "May", change: -209, trend: "loss" },
  { month: "Jun", change: 214, trend: "gain" },
]

// A baseline under the bars, so the sign flip reads as a crossing.
const baseline = [ruleY([0], { stroke: "var(--color-border)" })]

export default function ChartBarNegative() {
  return (
    <BarChart
      data={data}
      x="month"
      y="change"
      series="trend"
      seriesOrder={["gain", "loss"]}
      labels={{ gain: "Gain", loss: "Loss" }}
      marksBefore={baseline}
      axes="x"
      ariaLabel="Monthly change in visitors, gains and losses"
    />
  )
}
