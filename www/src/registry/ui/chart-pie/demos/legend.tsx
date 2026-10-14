"use client"

import { defineChart } from "@tanstack/charts"
import { pie, polar, radialArc } from "@tanstack/charts/polar"

import { Chart, chartLegend, chartSliceTooltip } from "@/registry/ui/chart"

const data = [
  { browser: "Chrome", visitors: 275 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 187 },
  { browser: "Edge", visitors: 173 },
  { browser: "Other", visitors: 90 },
]

const chart = defineChart({
  scales: { x: null, y: null },
  color: { legend: chartLegend },
  marks: [
    polar({
      scales: { angle: null, radius: null },
      radiusRatio: 0.85,
      marks: [
        radialArc(pie(data, { value: "visitors" }), {
          color: "browser",
          stroke: "var(--surface-bg,var(--color-bg))",
          strokeWidth: 2,
        }),
      ],
    }),
  ],
  focus: "nearest",
  tooltip: chartSliceTooltip("browser", "visitors"),
})

export default function ChartPieLegend() {
  return <Chart definition={chart} ariaLabel="Visitors by browser" />
}
