"use client"

import { defineChart } from "@tanstack/charts"
import { pie, polar, radialArc, radialText } from "@tanstack/charts/polar"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import { Chart, chartSliceTooltip, polarDecorative } from "@/registry/ui/chart"

const data = [
  { browser: "Chrome", visitors: 275 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 187 },
  { browser: "Edge", visitors: 173 },
  { browser: "Other", visitors: 90 },
]

const slices = pie(data, { value: "visitors" })

const chart = defineChart({
  scales: { x: null, y: null },
  marks: [
    polar({
      scales: {
        angle: { scale: scaleLinear().domain([0, 2 * Math.PI]) },
        radius: { scale: scaleLinear().domain([0, 1]) },
      },
      radiusRatio: 0.9,
      marks: [
        radialArc(slices, {
          color: "browser",
          stroke: "var(--surface-bg,var(--color-bg))",
          strokeWidth: 2,
        }),
        polarDecorative(
          radialText(slices, {
            angle: "angle",
            radius: 0.6,
            text: "visitors",
            fill: "var(--color-bg)",
            fontSize: 15,
          }),
        ),
      ],
    }),
  ],
  focus: "nearest",
  tooltip: chartSliceTooltip("browser", "visitors"),
})

export default function ChartPieLabelCustom() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Visitors by browser, with values inside the slices"
    />
  )
}
