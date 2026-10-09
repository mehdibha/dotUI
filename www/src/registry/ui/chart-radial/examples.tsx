import { useMemo } from "react"
import { defineChart } from "@tanstack/charts"
import { polar, radialBarAngle } from "@tanstack/charts/polar"
import { scaleBand } from "@tanstack/charts/scales/band"
import { scaleLinear } from "@tanstack/charts/scales/linear"

import {
  Chart,
  chartSliceTooltip,
  polarDecorative,
  useChartLook,
} from "@/registry/ui/chart"
import type { ChartLook } from "@/registry/ui/chart"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

const data = [
  { browser: "Chrome", visitors: 275 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 187 },
  { browser: "Edge", visitors: 173 },
  { browser: "Other", visitors: 90 },
]

const max = Math.max(...data.map((row) => row.visitors))

const track = {
  fill: "var(--color-muted)",
  motion: false,
} as const

// Built from the live look, so the studio restyles the rings as it changes.
function ringsChart(look: ChartLook) {
  return defineChart({
    scales: { x: null, y: null },
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
          polarDecorative(
            radialBarAngle(data, {
              ...track,
              angle: () => max,
              radius: "browser",
            }),
          ),
          radialBarAngle(data, {
            angle: "visitors",
            radius: "browser",
            color: "browser",
            cornerRadius: look.barRadius,
          }),
        ],
      }),
    ],
    focus: "nearest",
    tooltip: chartSliceTooltip("browser", "visitors"),
  })
}

const safari = [{ browser: "Safari", visitors: 1260 }]

const progress = defineChart({
  scales: { x: null, y: null },
  marks: [
    polar({
      scales: {
        angle: { scale: scaleLinear().domain([0, 1600]) },
        radius: {
          scale: () => scaleBand().paddingInner(0.2),
          range: [({ radius }) => radius * 0.78, ({ radius }) => radius * 0.95],
        },
      },
      endAngle: (250 * Math.PI) / 180,
      radiusRatio: 0.9,
      marks: [
        polarDecorative(
          radialBarAngle(safari, {
            ...track,
            angle: () => 1600,
            radius: "browser",
          }),
        ),
        radialBarAngle(safari, {
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

export default function ChartRadialExamples() {
  const look = useChartLook()
  const rings = useMemo(() => ringsChart(look), [look])
  return (
    <Examples>
      <Example title="Default">
        <Chart
          className="w-full"
          definition={rings}
          ariaLabel="Visitors by browser"
        />
      </Example>
      <Example title="Progress Ring">
        <Chart
          className="w-full"
          definition={progress}
          ariaLabel="Safari visitors as a progress ring"
        >
          <div className="flex h-full flex-col items-center justify-center">
            <span className="text-2xl font-bold">1,260</span>
            <span className="text-sm text-fg-muted">Visitors</span>
          </div>
        </Chart>
      </Example>
    </Examples>
  )
}
