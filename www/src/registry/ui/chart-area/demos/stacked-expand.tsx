"use client"

import { defineChart } from "@tanstack/charts"
import { areaY } from "@tanstack/charts/area"
import { lineY } from "@tanstack/charts/line"
import { decorative } from "@tanstack/charts/mark/decorative"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { fold } from "@tanstack/charts/transform/fold"
import { stackRowsY } from "@tanstack/charts/transform/stack"

import { Chart, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "Jan", desktop: 186, mobile: 80, other: 45 },
  { month: "Feb", desktop: 305, mobile: 200, other: 100 },
  { month: "Mar", desktop: 237, mobile: 120, other: 150 },
  { month: "Apr", desktop: 73, mobile: 190, other: 50 },
  { month: "May", desktop: 209, mobile: 130, other: 100 },
  { month: "Jun", desktop: 214, mobile: 140, other: 160 },
]

const devices = { desktop: "Desktop", mobile: "Mobile", other: "Other" }

const percent = new Intl.NumberFormat("en-US", { style: "percent" })

/* `"normalize"` divides each band by its x-group total, so the stack fills
   the plot and reads as share rather than volume. */
const rows = stackRowsY(
  fold(data, {
    fields: ["desktop", "mobile", "other"],
    as: { key: "device", value: "visitors" },
  }),
  { x: "month", y: "visitors", z: "device", offset: "normalize" },
)

const series = {
  x: "month",
  color: (row: (typeof rows)[number]) => devices[row.device],
  curve: chartLook.curve,
} as const

const chart = defineChart({
  scales: {
    x: { scale: scalePoint },
    y: {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: { ticks: { format: (value) => percent.format(Number(value)) } },
    },
  },
  marks: [
    areaY(rows, {
      ...series,
      y1: "y1",
      y2: "y2",
      fillOpacity: chartLook.areaOpacity,
    }),
    decorative(
      lineY(rows, { ...series, y: "y2", strokeWidth: chartLook.strokeWidth }),
    ),
  ],
})

export default function ChartAreaStackedExpand() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Share of visitors by device, January through June"
    />
  )
}
