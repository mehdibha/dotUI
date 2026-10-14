"use client"

import { defineChart } from "@tanstack/charts"
import { barY } from "@tanstack/charts/bar"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import { Chart, chartBand, chartLook } from "@/registry/ui/chart"

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
      scale: chartBand,
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
    barY(data, {
      x: "month",
      y: "desktop",
      z: () => "Desktop",
      radius: chartLook.barRadius,
      maxThickness: chartLook.barMaxThickness,
    }),
  ],
})

export default function ChartBarAxes() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
