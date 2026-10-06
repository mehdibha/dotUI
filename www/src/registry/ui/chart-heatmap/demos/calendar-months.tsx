"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { heatmapChart } from "@/registry/ui/chart-heatmap"

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

const chart = defineChart(
  heatmapChart(data, {
    x: "month",
    y: "year",
    value: "rainfall",
    label: "Rainfall",
    formatValue: (value) => millimeters.format(Number(value)),
  }),
)

export default function ChartHeatmapCalendarMonths() {
  return (
    <Chart
      definition={chart}
      height={200}
      ariaLabel="Monthly rainfall by year"
    />
  )
}
