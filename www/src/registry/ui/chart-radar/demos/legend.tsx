"use client"

import { defineChart } from "@tanstack/charts"
import {
  angleGrid,
  focusGroupAngle,
  polar,
  radialArea,
  radialGrid,
  radialLine,
} from "@tanstack/charts/polar"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { fold } from "@tanstack/charts/transform/fold"
import { curveLinearClosed } from "d3-shape"

import {
  Chart,
  chartAngleLabels,
  chartLegend,
  chartLook,
} from "@/registry/ui/chart"

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 273, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const devices = { desktop: "Desktop", mobile: "Mobile" }

const rows = fold(data, {
  fields: ["desktop", "mobile"],
  as: { key: "device", value: "visitors" },
})

const series = {
  angle: "month",
  radius: "visitors",
  color: (row: (typeof rows)[number]) => devices[row.device],
} as const

const chart = defineChart({
  scales: { x: null, y: null },
  color: { legend: chartLegend },
  marks: [
    polar({
      scales: {
        angle: { scale: scalePoint },
        radius: { scale: scaleLinear, nice: 4 },
      },
      // Smaller, so the month labels clear the legend.
      radiusRatio: 0.68,
      guides: [
        radialGrid({
          ticks: 4,
          shape: "polygon",
          strokeDasharray: chartLook.grid.strokeDasharray,
        }),
        angleGrid({
          ...chartAngleLabels,
          strokeDasharray: chartLook.grid.strokeDasharray,
        }),
      ],
      marks: [
        radialArea(rows, {
          ...series,
          curve: curveLinearClosed,
          fillOpacity: 0.6,
        }),
        radialLine(rows, {
          ...series,
          curve: curveLinearClosed,
          strokeWidth: 1.5,
        }),
      ],
    }),
  ],
  focus: focusGroupAngle,
})

export default function ChartRadarLegend() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop and mobile visitors, January through June"
    />
  )
}
