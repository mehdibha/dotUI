"use client"

import { defineChart } from "@tanstack/charts"
import { barY } from "@tanstack/charts/bar"
import { decorative } from "@tanstack/charts/mark/decorative"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { text } from "@tanstack/charts/text"

import { Chart, chartBand, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 214 },
]

const chart = defineChart({
  scales: {
    x: { scale: chartBand },
    y: {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: chartLook.valueAxis,
    },
  },
  marks: [
    barY(data, {
      x: "month",
      y: "desktop",
      z: () => "Desktop",
      radius: chartLook.barRadius,
      maxThickness: chartLook.barMaxThickness,
    }),
    // Decorative, so the labels never become focus stops or tooltip rows.
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
