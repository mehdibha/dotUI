"use client"

import { defineChart } from "@tanstack/charts"
import { decorative } from "@tanstack/charts/mark/decorative"
import { text } from "@tanstack/charts/text"

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

const bars = barChart(data, {
  x: "month",
  y: "desktop",
  labels: { desktop: "Desktop" },
})

// Decorative, so the labels never become focus stops or tooltip rows.
const chart = defineChart({
  ...bars,
  marks: [
    ...bars.marks,
    decorative(
      text(data, {
        x: "month",
        y: "desktop",
        text: "desktop",
        fill: "var(--color-fg-muted)",
        fontSize: 12,
        dy: -10,
      }),
    ),
  ],
})

export default function ChartBarLabel() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors per month, labelled"
    />
  )
}
