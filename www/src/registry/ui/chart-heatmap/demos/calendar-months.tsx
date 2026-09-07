"use client"

import { HeatmapChart } from "@/registry/ui/chart-heatmap"

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

export default function ChartHeatmapCalendarMonths() {
  return (
    <HeatmapChart
      data={data}
      x="month"
      y="year"
      value="rainfall"
      formatValue={{
        locale: "en-US",
        number: { style: "unit", unit: "millimeter" },
      }}
      label="Rainfall"
      ariaLabel="Monthly rainfall by year"
      height={200}
    />
  )
}
