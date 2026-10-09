"use client"

import { defineChart } from "@tanstack/charts"
import { lineY } from "@tanstack/charts/line"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"

import { Chart, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "Jan", desktop: 210 },
  { month: "Feb", desktop: 250 },
  { month: "Mar", desktop: 236 },
  { month: "Apr", desktop: 150 },
  { month: "May", desktop: 120 },
  { month: "Jun", desktop: 168 },
  { month: "Jul", desktop: 270 },
  { month: "Aug", desktop: 330 },
]

const chart = defineChart({
  scales: {
    x: { scale: scalePoint },
    y: { scale: scaleLinear, nice: true, axis: false },
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

export default function ChartLineVisitors() {
  return (
    <Chart
      definition={chart}
      height={92}
      ariaLabel="Desktop visitors, January through August"
    />
  )
}
