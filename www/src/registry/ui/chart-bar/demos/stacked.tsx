"use client"

import { defineChart } from "@tanstack/charts"
import { barY } from "@tanstack/charts/bar"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { stack } from "@tanstack/charts/stack"
import { fold } from "@tanstack/charts/transform/fold"

import { Chart, chartBand, chartLegend, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "Jan", desktop: 186, mobile: 80, tablet: 45 },
  { month: "Feb", desktop: 305, mobile: 200, tablet: 90 },
  { month: "Mar", desktop: 237, mobile: 120, tablet: 60 },
  { month: "Apr", desktop: 73, mobile: 190, tablet: 110 },
  { month: "May", desktop: 209, mobile: 130, tablet: 70 },
  { month: "Jun", desktop: 214, mobile: 140, tablet: 85 },
]

const devices = { desktop: "Desktop", mobile: "Mobile", tablet: "Tablet" }

const rows = fold(data, {
  fields: ["desktop", "mobile", "tablet"],
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
  color: { legend: chartLegend },
  marks: [
    barY(rows, {
      x: "month",
      y: "visitors",
      color: (row) => devices[row.device],
      layout: stack(),
      // Only the top of each stack is rounded, so segments meet flush.
      radius: { end: chartLook.barRadius },
      maxThickness: chartLook.barMaxThickness,
    }),
  ],
})

export default function ChartBarStacked() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Visitors per month by device, stacked"
    />
  )
}
