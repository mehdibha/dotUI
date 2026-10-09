"use client"

import { defineChart } from "@tanstack/charts"
import { areaY } from "@tanstack/charts/area"
import { lineY } from "@tanstack/charts/line"
import { decorative } from "@tanstack/charts/mark/decorative"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"

import { Chart, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "January", desktop: 18600 },
  { month: "February", desktop: 30500 },
  { month: "March", desktop: 23700 },
  { month: "April", desktop: 7300 },
  { month: "May", desktop: 20900 },
  { month: "June", desktop: 21400 },
]

const compact = new Intl.NumberFormat("en-US", { notation: "compact" })

const series = {
  x: "month",
  y: "desktop",
  z: () => "Desktop",
  curve: chartLook.curve,
} as const

const chart = defineChart({
  scales: {
    x: {
      scale: scalePoint,
      axis: { ticks: { format: (value) => String(value).slice(0, 3) } },
    },
    y: {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: { ticks: { format: (value) => compact.format(Number(value)) } },
    },
  },
  marks: [
    areaY(data, { ...series, fillOpacity: chartLook.areaOpacity }),
    decorative(lineY(data, { ...series, strokeWidth: chartLook.strokeWidth })),
  ],
})

export default function ChartAreaAxes() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
