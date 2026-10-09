"use client"

import { defineChart } from "@tanstack/charts"
import {
  angleGrid,
  focusGroupAngle,
  polar,
  radialGrid,
  radialLine,
} from "@tanstack/charts/polar"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { fold } from "@tanstack/charts/transform/fold"
import { curveLinearClosed } from "d3-shape"

import { Chart, chartAngleLabels, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "Jan", desktop: 186, mobile: 160 },
  { month: "Feb", desktop: 185, mobile: 170 },
  { month: "Mar", desktop: 207, mobile: 180 },
  { month: "Apr", desktop: 173, mobile: 160 },
  { month: "May", desktop: 160, mobile: 190 },
  { month: "Jun", desktop: 174, mobile: 204 },
]

const devices = { desktop: "Desktop", mobile: "Mobile" }

const rows = fold(data, {
  fields: ["desktop", "mobile"],
  as: { key: "device", value: "visitors" },
})

const max = Math.max(...rows.map((row) => row.visitors))

const chart = defineChart({
  scales: { x: null, y: null },
  marks: [
    polar({
      scales: {
        angle: { scale: scalePoint },
        // Lines alone don't pull the radius to zero, as an area does.
        radius: { scale: scaleLinear().domain([0, max]), nice: 4 },
      },
      radiusRatio: 0.78,
      guides: [
        radialGrid({
          ticks: 4,
          shape: "polygon",
          strokeDasharray: chartLook.grid.strokeDasharray,
        }),
        // The month labels without their spokes.
        angleGrid({ ...chartAngleLabels, strokeOpacity: 0 }),
      ],
      marks: [
        radialLine(rows, {
          angle: "month",
          radius: "visitors",
          color: (row) => devices[row.device],
          curve: curveLinearClosed,
          strokeWidth: 1.5,
        }),
      ],
    }),
  ],
  focus: focusGroupAngle,
})

export default function ChartRadarLinesOnly() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop and mobile visitors, January through June"
    />
  )
}
