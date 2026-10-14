"use client"

import { defineChart } from "@tanstack/charts"
import { barY } from "@tanstack/charts/bar"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import { Chart, chartBand, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 214 },
]

const chart = defineChart({
  scales: {
    x: { scale: chartBand },
    y: {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: chartLook.valueAxis,
    },
  },
  marks: [
    barY(data, {
      x: "month",
      y: "desktop",
      // Names the series in the tooltip.
      z: () => "Desktop",
      radius: chartLook.barRadius,
      maxThickness: chartLook.barMaxThickness,
    }),
  ],
})

export default function ChartBarDefault() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors per month, January through June"
    />
  )
}
