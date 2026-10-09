"use client"

import { defineChart } from "@tanstack/charts"
import { colorLegend } from "@tanstack/charts/legend"
import { cell } from "@tanstack/charts/rect"
import { scaleBand } from "@tanstack/charts/scales/band"
import { tooltip } from "@tanstack/charts/tooltip"
import { scaleQuantize } from "d3-scale"

import { Chart, chartLook } from "@/registry/ui/chart"

/* Sessions per weekday and hour: a daily shape scaled by how busy the day is. */
const hours = [
  { hour: "08", base: 14 },
  { hour: "09", base: 32 },
  { hour: "10", base: 58 },
  { hour: "11", base: 74 },
  { hour: "12", base: 61 },
  { hour: "13", base: 42 },
  { hour: "14", base: 66 },
  { hour: "15", base: 88 },
  { hour: "16", base: 71 },
  { hour: "17", base: 39 },
]

const days = [
  { day: "Mon", weight: 1 },
  { day: "Tue", weight: 0.94 },
  { day: "Wed", weight: 1.06 },
  { day: "Thu", weight: 1.12 },
  { day: "Fri", weight: 0.87 },
  { day: "Sat", weight: 0.42 },
  { day: "Sun", weight: 0.31 },
]

const data = days.flatMap(({ day, weight }) =>
  hours.map(({ hour, base }) => ({
    day,
    hour,
    sessions: Math.round(base * weight),
  })),
)

// Low values fade into the surface, high ones deepen toward the foreground.
const colors = [
  "color-mix(in oklab, var(--chart-1) 20%, var(--surface-bg,var(--color-bg)))",
  "color-mix(in oklab, var(--chart-1) 60%, var(--surface-bg,var(--color-bg)))",
  "var(--chart-1)",
  "color-mix(in oklab, var(--chart-1) 66%, var(--color-fg))",
  "color-mix(in oklab, var(--chart-1) 32%, var(--color-fg))",
]

const chart = defineChart({
  scales: {
    x: { scale: scaleBand, axis: { label: "Hour" } },
    y: { scale: scaleBand, axis: { label: "Day" } },
  },
  // Equal bins over the rounded extent, one per color.
  color: {
    scale: scaleQuantize<string>,
    range: colors,
    nice: true,
    legend: colorLegend({ label: "Sessions" }),
  },
  marks: [
    cell(data, {
      x: "hour",
      y: "day",
      color: "sessions",
      radius: Math.min(chartLook.barRadius, 2),
      inset: 1,
    }),
  ],
  // A cell is read on its own, not against its column.
  focus: "nearest",
  tooltip: {
    use: tooltip,
    anchor: "point",
    content: (points) => ({
      title: points[0] && `${points[0].datum.hour} · ${points[0].datum.day}`,
      rows: points.map((point) => ({
        label: "Sessions",
        value: String(point.datum.sessions),
        color: point.color,
      })),
    }),
  },
})

export default function ChartHeatmapMatrix() {
  return <Chart definition={chart} ariaLabel="Sessions by weekday and hour" />
}
