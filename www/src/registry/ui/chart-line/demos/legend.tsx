"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { lineChart } from "@/registry/ui/chart-line"

const data = [
  { month: "Jan", desktop: 186, mobile: 80, tablet: 45 },
  { month: "Feb", desktop: 305, mobile: 200, tablet: 100 },
  { month: "Mar", desktop: 237, mobile: 120, tablet: 150 },
  { month: "Apr", desktop: 73, mobile: 190, tablet: 50 },
  { month: "May", desktop: 209, mobile: 130, tablet: 100 },
  { month: "Jun", desktop: 214, mobile: 140, tablet: 160 },
]

/* Click a series to hide it; hover one to dim the rest. */
const chart = defineChart(
  lineChart(data, {
    x: "month",
    y: ["desktop", "mobile", "tablet"],
    labels: { desktop: "Desktop", mobile: "Mobile", tablet: "Tablet" },
    legend: "toggle",
  }),
)

export default function ChartLineLegend() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop, mobile and tablet visitors, January through June"
    />
  )
}
