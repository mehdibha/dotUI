"use client"

import { defineChart } from "@tanstack/charts"
import { pie, polar, radialArc } from "@tanstack/charts/polar"

import { Chart, chartSliceTooltip } from "@/registry/ui/chart"

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
      scales: { angle: null, radius: null },
      radiusRatio: 0.9,
      marks: [
        radialArc(pie(data, { value: "visitors" }), {
          color: "browser",
          // The surface color, so the slices read apart.
          stroke: "var(--surface-bg,var(--color-bg))",
          strokeWidth: 2,
        }),
      ],
    }),
  ],
  // A slice's x and y are its angle and radius: focus the nearest slice.
  focus: "nearest",
  tooltip: chartSliceTooltip("browser", "visitors"),
})

export default function ChartPieSimple() {
  return <Chart definition={chart} ariaLabel="Visitors by browser" />
}
