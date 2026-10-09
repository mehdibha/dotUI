"use client"

import { defineChart } from "@tanstack/charts"
import { lineY } from "@tanstack/charts/line"
import { decorative } from "@tanstack/charts/mark/decorative"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { text } from "@tanstack/charts/text"

import { Chart, chartLook } from "@/registry/ui/chart"

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
    x: { scale: scalePoint },
    y: {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: chartLook.valueAxis,
    },
  },
  marks: [
    lineY(data, {
      x: "month",
      y: "desktop",
      z: () => "Desktop",
      curve: chartLook.curve,
      strokeWidth: chartLook.strokeWidth,
      points: true,
    }),
    decorative(
      text(data, {
        x: "month",
        y: "desktop",
        text: "desktop",
        dy: -12,
        fontSize: 12,
        fill: "var(--color-fg-muted)",
      }),
    ),
  ],
})

export default function ChartLineLabel() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
