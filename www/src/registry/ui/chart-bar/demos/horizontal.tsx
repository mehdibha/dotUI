"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { barChart } from "@/registry/ui/chart-bar"

const data = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 214 },
]

const chart = defineChart(
  barChart(data, {
    x: "month",
    y: "desktop",
    labels: { desktop: "Desktop" },
    horizontal: true,
  }),
)

export default function ChartBarHorizontal() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors per month, horizontal bars"
    />
  )
}
