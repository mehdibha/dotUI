"use client"

import { defineChart } from "@tanstack/charts"
import { polar, radialBarAngle, radialText } from "@tanstack/charts/polar"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import {
  Chart,
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

const chart = defineChart({
  scales: { x: null, y: null },
  marks: [
    polar({
      scales: {
        angle: { scale: scaleLinear().domain([0, max]) },
        radius: {
          scale: () => scaleBand().paddingInner(0.2),
          range: [({ radius }) => radius * 0.25, ({ radius }) => radius],
        },
      },
      radiusRatio: 0.95,
      marks: [
        polarDecorative(
          radialBarAngle(data, {
            angle: () => max,
            fill: "var(--color-muted)",
            motion: false,
          }),
        ),
        radialBarAngle(data, {
          angle: "visitors",
          color: "browser",
          cornerRadius: chartLook.barRadius,
        }),
        /* Rings sit at their row index, the default, so the names can find
           them: a text radius must be a number. */
        polarDecorative(
          radialText(data, {
            angle: 0,
            radius: (_row, { index }) => index,
            text: "browser",
            anchor: "start",
            dx: 8,
            fill: "var(--color-fg)",
            fontSize: 11,
          }),
        ),
      ],
    }),
  ],
  focus: "nearest",
  tooltip: chartSliceTooltip("browser", "visitors"),
})

export default function ChartRadialLabel() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Visitors by browser, each ring labelled"
    />
  )
}
