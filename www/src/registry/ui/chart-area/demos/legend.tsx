"use client"

import { defineChart } from "@tanstack/charts"
import { areaY } from "@tanstack/charts/area"
import { lineY } from "@tanstack/charts/line"
import { decorative } from "@tanstack/charts/mark/decorative"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { fold } from "@tanstack/charts/transform/fold"

import { Chart, chartLegend, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const devices = { desktop: "Desktop", mobile: "Mobile" }

const rows = fold(data, {
  fields: ["desktop", "mobile"],
  as: { key: "device", value: "visitors" },
})

const series = {
  x: "month",
  y: "visitors",
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
      axis: chartLook.valueAxis,
    },
  },
  color: { legend: chartLegend },
  marks: [
    // A zero baseline overlaps the series instead of stacking them.
    areaY(rows, { ...series, y1: 0, fillOpacity: chartLook.areaOpacity }),
    decorative(lineY(rows, { ...series, strokeWidth: chartLook.strokeWidth })),
  ],
})

export default function ChartAreaLegend() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop and mobile visitors, January through June"
    />
  )
}
