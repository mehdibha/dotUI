"use client"

import { defineChart } from "@tanstack/charts"
import { polar, radialBarAngle } from "@tanstack/charts/polar"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import { Chart, chartSliceTooltip, polarDecorative } from "@/registry/ui/chart"

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
          range: [({ radius }) => radius * 0.78, ({ radius }) => radius * 0.95],
        },
      },
      endAngle: (250 * Math.PI) / 180,
      radiusRatio: 0.9,
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

export default function ChartRadialText() {
  return (
    <Chart definition={chart} ariaLabel="Safari visitors as a progress ring">
      <div className="flex h-full flex-col items-center justify-center">
        <span className="text-2xl font-bold">1,260</span>
        <span className="text-sm text-fg-muted">Visitors</span>
      </div>
    </Chart>
  )
}
