"use client"

import { defineChart } from "@tanstack/charts"
import { areaY } from "@tanstack/charts/area"
import { lineY } from "@tanstack/charts/line"
import { decorative } from "@tanstack/charts/mark/decorative"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"

import { Chart, chartFades, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "Jan", desktop: 96 },
  { month: "Feb", desktop: 142 },
  { month: "Mar", desktop: 204 },
  { month: "Apr", desktop: 188 },
  { month: "May", desktop: 236 },
  { month: "Jun", desktop: 304 },
  { month: "Jul", desktop: 290 },
  { month: "Aug", desktop: 352 },
]

const series = {
  x: "month",
  y: "desktop",
  z: () => "Desktop",
  curve: chartLook.curve,
} as const

const chart = defineChart({
  scales: {
    x: { scale: scalePoint },
    y: { scale: scaleLinear, nice: true, axis: false },
  },
  gradients: chartFades,
  marks: [
    decorative(areaY(data, { ...series, fill: "url(#chart-fade-0)" })),
    areaY(data, { ...series, fillOpacity: 0 }),
    decorative(lineY(data, { ...series, strokeWidth: 1.5, points: true })),
  ],
})

export default function ChartAreaVisitors() {
  return (
    <Chart
      definition={chart}
      height={96}
      ariaLabel="Desktop visitors, January through August"
    />
  )
}
