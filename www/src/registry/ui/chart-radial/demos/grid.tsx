"use client"

import { defineChart } from "@tanstack/charts"
import { polar, radialBarAngle, radialGrid } from "@tanstack/charts/polar"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import { Chart, chartLook, chartSliceTooltip } from "@/registry/ui/chart"

const data = [
  { browser: "Chrome", visitors: 275 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 187 },
  { browser: "Edge", visitors: 173 },
  { browser: "Other", visitors: 90 },
]

const chart = defineChart({
  scales: { x: null, y: null },
  marks: [
    polar({
      scales: {
        angle: { scale: scaleLinear },
        radius: {
          scale: () => scaleBand().paddingInner(0.2),
          range: [({ radius }) => radius * 0.3, ({ radius }) => radius],
        },
        // The gridlines step through the whole radius, not the rings.
        grid: {
          channel: "radius",
          scale: scaleLinear().domain([0, 1]),
          range: [0, ({ radius }) => radius],
        },
      },
      radiusRatio: 0.95,
      guides: [
        radialGrid({
          scale: "grid",
          strokeDasharray: chartLook.grid.strokeDasharray,
        }),
      ],
      marks: [
        radialBarAngle(data, {
          angle: "visitors",
          radius: "browser",
          color: "browser",
          cornerRadius: chartLook.barRadius,
        }),
      ],
    }),
  ],
  focus: "nearest",
  tooltip: chartSliceTooltip("browser", "visitors"),
})

export default function ChartRadialGrid() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Visitors by browser, over a circular grid"
    />
  )
}
