"use client"

import { defineChart } from "@tanstack/charts"
import { areaY } from "@tanstack/charts/area"
import { lineY } from "@tanstack/charts/line"
import { decorative } from "@tanstack/charts/mark/decorative"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"

import { Chart, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 214 },
]

const series = {
  x: "month",
  y: "desktop",
  // Names the series in the tooltip.
  z: () => "Desktop",
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
  marks: [
    areaY(data, { ...series, fillOpacity: chartLook.areaOpacity }),
    // The edge is its own mark: an area's stroke would outline the whole shape.
    decorative(lineY(data, { ...series, strokeWidth: chartLook.strokeWidth })),
  ],
})

export default function ChartAreaDefault() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
