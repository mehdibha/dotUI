"use client"

import { defineChart } from "@tanstack/charts"
import { polar, radialBarAngle } from "@tanstack/charts/polar"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { fold } from "@tanstack/charts/transform/fold"
import { stackRowsX } from "@tanstack/charts/transform/stack"

import { Chart, chartSliceTooltip } from "@/registry/ui/chart"

const data = [{ month: "january", desktop: 1260, mobile: 570 }]

const devices = { desktop: "Desktop", mobile: "Mobile" }

// One segment per device, each starting where the one before it ends.
const rows = stackRowsX(
  fold(data, {
    fields: ["desktop", "mobile"],
    as: { key: "device", value: "visitors" },
  }),
  {
    x: "visitors",
    y: "month",
    // `z` names each segment; the row type doesn't flow into accessors here.
    z: (row: { device: keyof typeof devices }) => devices[row.device],
  },
)

const chart = defineChart({
  scales: { x: null, y: null },
  marks: [
    polar({
      scales: {
        angle: { scale: scaleLinear().domain([0, 2200]) },
        radius: {
          scale: scaleBand,
          range: [({ radius }) => radius * 0.7, ({ radius }) => radius * 0.98],
        },
      },
      startAngle: -Math.PI / 2,
      endAngle: Math.PI / 2,
      radiusRatio: 0.9,
      marks: [
        radialBarAngle(rows, {
          angle1: "x1",
          angle2: "x2",
          radius: "month",
          color: "z",
          cornerRadius: 5,
        }),
      ],
    }),
  ],
  focus: "nearest",
  tooltip: chartSliceTooltip("z", "visitors"),
})

export default function ChartRadialStacked() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop and mobile visitors in January, stacked"
    >
      <div className="flex h-full flex-col items-center justify-center pb-6">
        <span className="text-2xl font-bold">1,830</span>
        <span className="text-sm text-fg-muted">Visitors</span>
      </div>
    </Chart>
  )
}
