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
import { curveLinearClosed } from "d3-shape"

import { Chart, chartAngleLabels, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 273 },
  { month: "May", desktop: 209 },
  { month: "Jun", desktop: 214 },
]

// Names the series in the tooltip.
const series = {
  angle: "month",
  radius: "desktop",
  z: () => "Desktop",
} as const

const chart = defineChart({
  scales: { x: null, y: null },
  marks: [
    polar({
      scales: {
        angle: { scale: scalePoint },
        // Nice to the rings' 4 ticks, so the outer ring is the edge.
        radius: { scale: scaleLinear, nice: 4 },
      },
      // Room outside the circle for the month labels.
      radiusRatio: 0.78,
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
        radialArea(data, {
          ...series,
          curve: curveLinearClosed,
          fillOpacity: 0.6,
        }),
        radialLine(data, {
          ...series,
          curve: curveLinearClosed,
          strokeWidth: 1.5,
        }),
      ],
    }),
  ],
  // Two months can share a screen x: focus the nearest spoke instead.
  focus: focusGroupAngle,
})

export default function ChartRadarDefault() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop visitors, January through June"
    />
  )
}
