"use client"

import { defineChart } from "@tanstack/charts"
import { barY } from "@tanstack/charts/bar"
import { group } from "@tanstack/charts/group"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { fold } from "@tanstack/charts/transform/fold"

import { Chart, chartBand, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const devices = { desktop: "Desktop", mobile: "Mobile" }

// One row per bar.
const rows = fold(data, {
  fields: ["desktop", "mobile"],
  as: { key: "device", value: "visitors" },
})

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
    barY(rows, {
      x: "month",
      y: "visitors",
      color: (row) => devices[row.device],
      layout: group({ padding: 0.15 }),
      radius: chartLook.barRadius,
      maxThickness: chartLook.barMaxThickness,
    }),
  ],
})

export default function ChartBarMultiple() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop and mobile visitors per month, side by side"
    />
  )
}
