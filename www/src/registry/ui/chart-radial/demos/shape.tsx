"use client"

import { defineChart } from "@tanstack/charts"
import { polar, radialBarAngle, radialGrid } from "@tanstack/charts/polar"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import {
  Chart,
  chartLook,
  chartSliceTooltip,
  polarDecorative,
} from "@/registry/ui/chart"

const data = [{ browser: "Safari", visitors: 1260 }]

const max = 1600

const chart = defineChart({
  scales: { x: null, y: null },
  marks: [
    polar({
      scales: {
        angle: { scale: scaleLinear().domain([0, max]) },
        radius: {
          scale: () => scaleBand().paddingInner(0.2),
          range: [({ radius }) => radius * 0.66, ({ radius }) => radius * 0.95],
        },
        grid: {
          channel: "radius",
          scale: scaleLinear().domain([0, 1]),
          range: [0, ({ radius }) => radius],
        },
      },
      endAngle: (100 * Math.PI) / 180,
      radiusRatio: 0.9,
      guides: [
        radialGrid({
          scale: "grid",
          strokeDasharray: chartLook.grid.strokeDasharray,
        }),
      ],
      marks: [
        polarDecorative(
          radialBarAngle(data, {
            angle: () => max,
            radius: "browser",
            fill: "var(--color-muted)",
            motion: false,
          }),
        ),
        radialBarAngle(data, {
          angle: "visitors",
          radius: "browser",
          color: "browser",
          cornerRadius: "full",
        }),
      ],
    }),
  ],
  focus: "nearest",
  tooltip: chartSliceTooltip("browser", "visitors"),
})

export default function ChartRadialShape() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Safari visitors against a 1,600 target"
    >
      <div className="flex h-full flex-col items-center justify-center">
        <span className="text-2xl font-bold">1,260</span>
        <span className="text-sm text-fg-muted">Visitors</span>
      </div>
    </Chart>
  )
}
