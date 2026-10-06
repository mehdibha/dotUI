"use client"

import { defineChart } from "@tanstack/charts"
import { decorative } from "@tanstack/charts/mark/decorative"
import { text } from "@tanstack/charts/text"

import { Chart } from "@/registry/ui/chart"
import { barChart } from "@/registry/ui/chart-bar"

const data = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 173 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const bars = barChart(data, {
  x: "month",
  y: "desktop",
  labels: { desktop: "Desktop" },
  horizontal: true,
  grid: false,
})

/* Both labels ride inside the bar: the category anchors to the value
   baseline, the value to the bar's end. */
const chart = defineChart({
  ...bars,
  marks: [
    ...bars.marks,
    decorative(
      text(data, {
        x: () => 0,
        y: "month",
        text: "month",
        fill: "var(--color-bg)",
        fontSize: 12,
        fontWeight: 500,
        anchor: "start",
        dx: 10,
      }),
    ),
    decorative(
      text(data, {
        x: "desktop",
        y: "month",
        text: "desktop",
        fill: "var(--color-bg)",
        fontSize: 12,
        anchor: "end",
        dx: -10,
      }),
    ),
  ],
})

export default function ChartBarLabelCustom() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors per month, labelled inside each bar"
    />
  )
}
