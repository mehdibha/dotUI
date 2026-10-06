"use client"

import { defineChart } from "@tanstack/charts"
import { dot } from "@tanstack/charts/dot"
import { decorative } from "@tanstack/charts/mark/decorative"

import { Chart } from "@/registry/ui/chart"
import { lineChart } from "@/registry/ui/chart-line"

const data = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 214 },
]

const line = lineChart(data, {
  x: "month",
  y: "desktop",
  labels: { desktop: "Desktop" },
})

// Decorative: the line keeps the focus stops and the tooltip rows.
const rings = decorative(
  dot(data, {
    x: "month",
    y: "desktop",
    r: 5,
    fill: "var(--color-bg)",
    stroke: "var(--chart-1)",
    strokeWidth: 2,
  }),
)

const chart = defineChart({ ...line, marks: [...line.marks, rings] })

export default function ChartLineDotsCustom() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
