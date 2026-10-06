"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { heatmapChart } from "@/registry/ui/chart-heatmap"

/* Contributions per day over sixteen weeks: mostly quiet, busier midweek. */
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const weeks = Array.from({ length: 16 }, (_, index) => `W${index + 1}`)

let seed = 7
const random = () => {
  seed = (seed * 48271) % 2147483647
  return seed / 2147483647
}

const data = weeks.flatMap((week) =>
  days.map((day, index) => {
    const weekend = index >= 5
    const roll = random()
    const contributions =
      roll < (weekend ? 0.7 : 0.4)
        ? 0
        : Math.min(4, Math.ceil(random() * (weekend ? 2 : 4)))
    return { week, day, contributions }
  }),
)

const chart = defineChart(
  heatmapChart(data, {
    x: "week",
    y: "day",
    value: "contributions",
    label: "Contributions",
    thresholds: [1, 2, 3, 4],
    axes: false,
  }),
)

export default function ChartHeatmapContributions() {
  return (
    <Chart
      definition={chart}
      height={96}
      ariaLabel="Contributions per day over sixteen weeks"
    />
  )
}
