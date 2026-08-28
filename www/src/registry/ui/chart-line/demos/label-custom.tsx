"use client"

import { dot } from "@tanstack/charts/dot"
import { text } from "@tanstack/charts/text"

import { chartDefaults } from "@/registry/ui/chart"
import { LineChart } from "@/registry/ui/chart-line"

interface Row {
  month: string
  desktop: number
}

const SERIES = "Desktop"

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

const markers = dot(extremes, {
  x: "month",
  y: "desktop",
  z: () => SERIES,
  r: chartDefaults.dotRadius,
})

const callouts = text(extremes, {
  x: "month",
  y: "desktop",
  text: (row) => `${row.label} · ${row.desktop}`,
  z: () => SERIES,
  dy: (row) => row.dy,
  fontSize: 12,
  fontWeight: 600,
  fill: "var(--color-fg)",
})

export default function ChartLineLabelCustom() {
  return (
    <LineChart
      data={data}
      x="month"
      y="desktop"
      labels={{ desktop: SERIES }}
      legend={false}
      marks={[markers, callouts]}
      axes="x"
      ariaLabel="Desktop visitors, with the peak and low months annotated"
    />
  )
}
