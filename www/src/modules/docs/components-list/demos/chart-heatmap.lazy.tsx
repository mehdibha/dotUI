"use client"

import { defineChart } from "@tanstack/charts"
import { colorLegend } from "@tanstack/charts/legend"
import { cell } from "@tanstack/charts/rect"
import { scaleBand } from "@tanstack/charts/scales/band"
import { tooltip } from "@tanstack/charts/tooltip"
import { scaleThreshold } from "d3-scale"

import { Chart, chartLook } from "@/registry/ui/chart"

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

const colors = [
  "color-mix(in oklab, var(--chart-1) 20%, var(--surface-bg,var(--color-bg)))",
  "color-mix(in oklab, var(--chart-1) 60%, var(--surface-bg,var(--color-bg)))",
  "var(--chart-1)",
  "color-mix(in oklab, var(--chart-1) 66%, var(--color-fg))",
  "color-mix(in oklab, var(--chart-1) 32%, var(--color-fg))",
]

const chart = defineChart({
  scales: {
    x: { scale: scaleBand, axis: false },
    y: { scale: scaleBand, axis: false },
  },
  color: {
    scale: scaleThreshold<number, string>,
    domain: [1, 2, 3, 4],
    range: colors,
    legend: colorLegend({ label: "Contributions" }),
  },
  marks: [
    cell(data, {
      x: "week",
      y: "day",
      color: "contributions",
      radius: Math.min(chartLook.barRadius, 2),
      inset: 1,
    }),
  ],
  focus: "nearest",
  tooltip: {
    use: tooltip,
    anchor: "point",
    content: (points) => ({
      title: points[0] && `${points[0].datum.week} · ${points[0].datum.day}`,
      rows: points.map((point) => ({
        label: "Contributions",
        value: String(point.datum.contributions),
        color: point.color,
      })),
    }),
  },
})

export default function ChartHeatmapContributions() {
  return (
    <Chart
      definition={chart}
      height={96}
      ariaLabel="Contributions per day over sixteen weeks"
    />
  )
}
