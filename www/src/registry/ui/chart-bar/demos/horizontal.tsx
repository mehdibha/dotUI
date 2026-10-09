"use client"

import { defineChart } from "@tanstack/charts"
import { barX } from "@tanstack/charts/bar"
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
    x: {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: chartLook.valueAxis,
    },
    y: { scale: chartBand },
  },
  marks: [
    barX(data, {
      x: "desktop",
      y: "month",
      z: () => "Desktop",
      radius: chartLook.barRadius,
      maxThickness: chartLook.barMaxThickness,
    }),
  ],
  focus: "group-y",
})

export default function ChartBarHorizontal() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors per month, horizontal bars"
    />
  )
}
