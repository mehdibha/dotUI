"use client"

import { defineChart } from "@tanstack/charts"
import { lineY } from "@tanstack/charts/line"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { fold } from "@tanstack/charts/transform/fold"

import { Chart, chartCurves, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const devices = { desktop: "Desktop", mobile: "Mobile" }

// One row per point.
const rows = fold(data, {
  fields: ["desktop", "mobile"],
  as: { key: "device", value: "visitors" },
})

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
    lineY(rows, {
      x: "month",
      y: "visitors",
      color: (row) => devices[row.device],
      curve: chartCurves.monotone,
      strokeWidth: chartLook.strokeWidth,
    }),
  ],
})

export default function ChartLineMultiple() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop and mobile visitors, January through June"
    />
  )
}
