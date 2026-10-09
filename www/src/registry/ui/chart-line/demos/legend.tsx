"use client"

import { defineChart } from "@tanstack/charts"
import { lineY } from "@tanstack/charts/line"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { fold } from "@tanstack/charts/transform/fold"

import { Chart, chartLegend, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "Jan", desktop: 186, mobile: 80, tablet: 45 },
  { month: "Feb", desktop: 305, mobile: 200, tablet: 100 },
  { month: "Mar", desktop: 237, mobile: 120, tablet: 150 },
  { month: "Apr", desktop: 73, mobile: 190, tablet: 50 },
  { month: "May", desktop: 209, mobile: 130, tablet: 100 },
  { month: "Jun", desktop: 214, mobile: 140, tablet: 160 },
]

const devices = { desktop: "Desktop", mobile: "Mobile", tablet: "Tablet" }

const rows = fold(data, {
  fields: ["desktop", "mobile", "tablet"],
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
  color: { legend: chartLegend },
  marks: [
    lineY(rows, {
      x: "month",
      y: "visitors",
      color: (row) => devices[row.device],
      curve: chartLook.curve,
      strokeWidth: chartLook.strokeWidth,
    }),
  ],
})

export default function ChartLineLegend() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop, mobile and tablet visitors, January through June"
    />
  )
}
