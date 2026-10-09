"use client"

import { defineChart } from "@tanstack/charts"
import { dot } from "@tanstack/charts/dot"
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

// Annotate a chosen few rows, picked in data preparation.
const peak = data.reduce((max, row) => (row.desktop > max.desktop ? row : max))
const low = data.reduce((min, row) => (row.desktop < min.desktop ? row : min))
const extremes = [
  { ...peak, label: "Peak", dy: -16 },
  { ...low, label: "Low", dy: 22 },
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
    }),
    decorative(
      dot(extremes, { x: "month", y: "desktop", r: 4, fill: "var(--chart-1)" }),
    ),
    decorative(
      text(extremes, {
        x: "month",
        y: "desktop",
        text: (row) => `${row.label} · ${row.desktop}`,
        dy: (row) => row.dy,
        fontSize: 12,
        fontWeight: 600,
        fill: "var(--color-fg)",
      }),
    ),
  ],
})

export default function ChartLineLabelCustom() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors, with the peak and low months annotated"
    />
  )
}
