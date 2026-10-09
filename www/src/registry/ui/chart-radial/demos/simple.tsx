"use client"

import { defineChart } from "@tanstack/charts"
import { polar, radialBarAngle } from "@tanstack/charts/polar"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import {
  Chart,
  chartLegend,
  chartLook,
  chartSliceTooltip,
  polarDecorative,
} from "@/registry/ui/chart"

const data = [
  { browser: "Chrome", visitors: 275 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 187 },
  { browser: "Edge", visitors: 173 },
  { browser: "Other", visitors: 90 },
]

const max = Math.max(...data.map((row) => row.visitors))

// One ring per browser, innermost first.
const chart = defineChart({
  scales: { x: null, y: null },
  color: { legend: chartLegend },
  marks: [
    polar({
      scales: {
        angle: { scale: scaleLinear().domain([0, max]) },
        radius: {
          scale: () => scaleBand().paddingInner(0.2),
          range: [({ radius }) => radius * 0.3, ({ radius }) => radius],
        },
      },
      radiusRatio: 0.95,
      marks: [
        // The track behind each ring stays put while the rings sweep in.
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
          cornerRadius: chartLook.barRadius,
        }),
      ],
    }),
  ],
  focus: "nearest",
  tooltip: chartSliceTooltip("browser", "visitors"),
})

export default function ChartRadialSimple() {
  return <Chart definition={chart} ariaLabel="Visitors by browser" />
}
