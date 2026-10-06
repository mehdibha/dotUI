"use client"

import { defineChart } from "@tanstack/charts"
import { decorative } from "@tanstack/charts/mark/decorative"
import { text } from "@tanstack/charts/text"

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
  points: true,
})

const labels = decorative(
  text(data, {
    x: "month",
    y: "desktop",
    text: "desktop",
    dy: -12,
    fontSize: 12,
    fill: "var(--color-fg-muted)",
  }),
)

const chart = defineChart({ ...line, marks: [...line.marks, labels] })

export default function ChartLineLabel() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
