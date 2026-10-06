"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { barChart } from "@/registry/ui/chart-bar"

const data = [
  { month: "Jan", desktop: 186, mobile: 80, tablet: 45 },
  { month: "Feb", desktop: 305, mobile: 200, tablet: 90 },
  { month: "Mar", desktop: 237, mobile: 120, tablet: 60 },
  { month: "Apr", desktop: 73, mobile: 190, tablet: 110 },
  { month: "May", desktop: 209, mobile: 130, tablet: 70 },
  { month: "Jun", desktop: 214, mobile: 140, tablet: 85 },
]

const chart = defineChart(
  barChart(data, {
    x: "month",
    y: ["desktop", "mobile", "tablet"],
    labels: { desktop: "Desktop", mobile: "Mobile", tablet: "Tablet" },
    stacked: true,
    legend: true,
  }),
)

export default function ChartBarStacked() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Visitors per month by device, stacked"
    />
  )
}
