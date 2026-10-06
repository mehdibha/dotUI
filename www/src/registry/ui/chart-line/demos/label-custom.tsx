"use client"

import { defineChart } from "@tanstack/charts"
import { dot } from "@tanstack/charts/dot"
import { decorative } from "@tanstack/charts/mark/decorative"
import { text } from "@tanstack/charts/text"

import { Chart } from "@/registry/ui/chart"
import { lineChart } from "@/registry/ui/chart-line"

interface Row {
  month: string
  desktop: number
}

const data: Row[] = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 214 },
]

const pick = (rows: readonly Row[], best: (a: Row, b: Row) => boolean) =>
  rows.reduce((winner, row) => (best(row, winner) ? row : winner))

/* Annotate a chosen few rows, not every point: pick them in data preparation
   so the intent stays auditable. */
const extremes = [
  {
    ...pick(data, (a, b) => a.desktop > b.desktop),
    label: "Peak",
    dy: -16,
  },
  { ...pick(data, (a, b) => a.desktop < b.desktop), label: "Low", dy: 22 },
]

const line = lineChart(data, {
  x: "month",
  y: "desktop",
  labels: { desktop: "Desktop" },
})

const markers = decorative(
  dot(extremes, { x: "month", y: "desktop", r: 4, fill: "var(--chart-1)" }),
)

const callouts = decorative(
  text(extremes, {
    x: "month",
    y: "desktop",
    text: (row) => `${row.label} · ${row.desktop}`,
    dy: (row) => row.dy,
    fontSize: 12,
    fontWeight: 600,
    fill: "var(--color-fg)",
  }),
)

const chart = defineChart({
  ...line,
  marks: [...line.marks, markers, callouts],
})

export default function ChartLineLabelCustom() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors, with the peak and low months annotated"
    />
  )
}
