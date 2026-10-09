"use client"

import { defineChart } from "@tanstack/charts"
import { lineY } from "@tanstack/charts/line"
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
    lineY(data, {
      x: "month",
      y: "desktop",
      z: () => "Desktop",
      curve: chartLook.curve,
      strokeWidth: chartLook.strokeWidth,
    }),
  ],
})

export default function ChartLineAxes() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
