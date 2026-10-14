"use client"

import { defineChart } from "@tanstack/charts"
import { pie, polar, radialArc } from "@tanstack/charts/polar"

import { Chart, chartSliceTooltip } from "@/registry/ui/chart"

const desktop = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 173 },
  { month: "May", desktop: 209 },
]

const mobile = [
  { month: "January", mobile: 80 },
  { month: "February", mobile: 200 },
  { month: "March", mobile: 120 },
  { month: "April", mobile: 190 },
  { month: "May", mobile: 130 },
]

const ring = {
  color: "month",
  stroke: "var(--surface-bg,var(--color-bg))",
  strokeWidth: 2,
} as const

/* A second series is a second ring. Both rings color slices by month, so a
   month is one color from the middle out. */
const chart = defineChart({
  scales: { x: null, y: null },
  marks: [
    polar({
      scales: { angle: null, radius: null },
      radiusRatio: 0.9,
      marks: [
        radialArc(pie(desktop, { value: "desktop" }), {
          ...ring,
          outerRadius: ({ radius }) => radius * 0.6,
        }),
        radialArc(pie(mobile, { value: "mobile" }), {
          ...ring,
          innerRadius: ({ radius }) => radius * 0.7,
          outerRadius: ({ radius }) => radius * 0.95,
        }),
      ],
    }),
  ],
  focus: "nearest",
  // `value` is the slice's size, whichever ring it sits in.
  tooltip: chartSliceTooltip("month", "value"),
})

export default function ChartPieStacked() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Desktop and mobile visitors by month, as concentric rings"
    />
  )
}
