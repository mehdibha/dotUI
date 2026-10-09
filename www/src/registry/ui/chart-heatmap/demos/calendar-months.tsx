"use client"

import { defineChart } from "@tanstack/charts"
import { colorLegend } from "@tanstack/charts/legend"
import { cell } from "@tanstack/charts/rect"
import { scaleBand } from "@tanstack/charts/scales/band"
import { tooltip } from "@tanstack/charts/tooltip"
import { scaleQuantize } from "d3-scale"

import { Chart, chartLook } from "@/registry/ui/chart"

/* Rainfall by month and year: a seasonal shape scaled by how wet the year was. */
const months = [
  { month: "Jan", normal: 82 },
  { month: "Feb", normal: 64 },
  { month: "Mar", normal: 58 },
  { month: "Apr", normal: 47 },
  { month: "May", normal: 39 },
  { month: "Jun", normal: 21 },
  { month: "Jul", normal: 12 },
  { month: "Aug", normal: 18 },
  { month: "Sep", normal: 44 },
  { month: "Oct", normal: 76 },
  { month: "Nov", normal: 94 },
  { month: "Dec", normal: 88 },
]

const years = [
  { year: "2022", weight: 0.74 },
  { year: "2023", weight: 1.18 },
  { year: "2024", weight: 0.91 },
  { year: "2025", weight: 1.05 },
]

const data = years.flatMap(({ year, weight }) =>
  months.map(({ month, normal }) => ({
    year,
    month,
    rainfall: Math.round(normal * weight),
  })),
)

const millimeters = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "millimeter",
})

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
    x: { scale: scaleBand },
    y: { scale: scaleBand },
  },
  color: {
    scale: scaleQuantize<string>,
    range: colors,
    nice: true,
    legend: colorLegend({
      label: "Rainfall",
      format: (value) => millimeters.format(value),
    }),
  },
  marks: [
    cell(data, {
      x: "month",
      y: "year",
      color: "rainfall",
      radius: Math.min(chartLook.barRadius, 2),
      inset: 1,
    }),
  ],
  focus: "nearest",
  tooltip: {
    use: tooltip,
    anchor: "point",
    content: (points) => ({
      title: points[0] && `${points[0].datum.month} · ${points[0].datum.year}`,
      rows: points.map((point) => ({
        label: "Rainfall",
        value: millimeters.format(point.datum.rainfall),
        color: point.color,
      })),
    }),
  },
})

export default function ChartHeatmapCalendarMonths() {
  return (
    <Chart
      definition={chart}
      height={200}
      ariaLabel="Monthly rainfall by year"
    />
  )
}
