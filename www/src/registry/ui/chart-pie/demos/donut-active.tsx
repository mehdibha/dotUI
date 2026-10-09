"use client"

import { defineChart } from "@tanstack/charts"
import { pie, polar, radialArc } from "@tanstack/charts/polar"

import { Chart, chartSliceTooltip, polarDecorative } from "@/registry/ui/chart"

const data = [
  { browser: "Chrome", visitors: 275 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 187 },
  { browser: "Edge", visitors: 173 },
  { browser: "Other", visitors: 90 },
]

const slices = pie(data, { value: "visitors" })

const ring = {
  color: "browser",
  innerRadius: ({ radius }: { radius: number }) => radius * 0.55,
  stroke: "var(--surface-bg,var(--color-bg))",
  strokeWidth: 2,
} as const

// Static, so the highlighted slice reads without hovering.
const chart = defineChart({
  scales: { x: null, y: null },
  marks: [
    polar({
      scales: { angle: null, radius: null },
      radiusRatio: 0.9,
      marks: [
        radialArc(slices, {
          ...ring,
          outerRadius: ({ radius }) => radius * 0.88,
        }),
        // Chrome again, grown past the ring.
        polarDecorative(
          radialArc(
            slices.filter((slice) => slice.browser === "Chrome"),
            { ...ring, outerRadius: ({ radius }) => radius },
          ),
        ),
      ],
    }),
  ],
  focus: "nearest",
  tooltip: chartSliceTooltip("browser", "visitors"),
})

export default function ChartPieDonutActive() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Visitors by browser, with Chrome highlighted"
    />
  )
}
