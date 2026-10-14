import { useMemo } from "react"
import type { ChartPoint } from "@tanstack/charts"
import { defineChart } from "@tanstack/charts"
import { colorLegend } from "@tanstack/charts/legend"
import { cell } from "@tanstack/charts/rect"
import { scaleBand } from "@tanstack/charts/scales/band"
import { tooltip } from "@tanstack/charts/tooltip"
import { scaleQuantize, scaleThreshold } from "d3-scale"

import { Chart, useChartLook } from "@/registry/ui/chart"
import type { ChartLook } from "@/registry/ui/chart"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

const hours = [
  { hour: "09", base: 32 },
  { hour: "10", base: 58 },
  { hour: "11", base: 74 },
  { hour: "12", base: 61 },
  { hour: "13", base: 42 },
  { hour: "14", base: 66 },
  { hour: "15", base: 88 },
  { hour: "16", base: 71 },
]

const days = [
  { day: "Mon", weight: 1 },
  { day: "Tue", weight: 0.94 },
  { day: "Wed", weight: 1.06 },
  { day: "Thu", weight: 1.12 },
  { day: "Fri", weight: 0.87 },
]

const data = days.flatMap(({ day, weight }) =>
  hours.map(({ hour, base }) => ({
    day,
    hour,
    sessions: Math.round(base * weight),
  })),
)

// Built from the live look, so the studio restyles the cells as it changes.
function charts(look: ChartLook) {
  const scales = { x: { scale: scaleBand }, y: { scale: scaleBand } }
  const cells = {
    x: "hour",
    y: "day",
    color: "sessions",
    radius: Math.min(look.barRadius, 2),
    inset: 1,
  } as const
  const sessions = {
    use: tooltip,
    anchor: "point",
    content: (points: readonly ChartPoint<(typeof data)[number]>[]) => ({
      title: points[0] && `${points[0].datum.hour} · ${points[0].datum.day}`,
      rows: points.map((point) => ({
        label: "Sessions",
        value: String(point.datum.sessions),
        color: point.color,
      })),
    }),
  } as const
  return {
    ramp: defineChart({
      scales,
      color: {
        scale: scaleQuantize<string>,
        range: [
          "color-mix(in oklab, var(--chart-1) 20%, var(--surface-bg,var(--color-bg)))",
          "color-mix(in oklab, var(--chart-1) 60%, var(--surface-bg,var(--color-bg)))",
          "var(--chart-1)",
          "color-mix(in oklab, var(--chart-1) 66%, var(--color-fg))",
          "color-mix(in oklab, var(--chart-1) 32%, var(--color-fg))",
        ],
        nice: true,
        legend: colorLegend({ label: "Sessions" }),
      },
      marks: [cell(data, cells)],
      focus: "nearest",
      tooltip: sessions,
    }),
    banded: defineChart({
      scales,
      color: {
        scale: scaleThreshold<number, string>,
        domain: [40, 60, 80],
        range: [
          "color-mix(in oklab, var(--chart-4) 20%, var(--surface-bg,var(--color-bg)))",
          "color-mix(in oklab, var(--chart-4) 73%, var(--surface-bg,var(--color-bg)))",
          "color-mix(in oklab, var(--chart-4) 77%, var(--color-fg))",
          "color-mix(in oklab, var(--chart-4) 32%, var(--color-fg))",
        ],
        legend: colorLegend({ label: "Sessions" }),
      },
      marks: [cell(data, cells)],
      focus: "nearest",
      tooltip: sessions,
    }),
  }
}

export default function ChartHeatmapExamples() {
  const look = useChartLook()
  const { ramp, banded } = useMemo(() => charts(look), [look])
  return (
    <Examples>
      <Example title="Default">
        <Chart
          className="w-full"
          definition={ramp}
          ariaLabel="Sessions by weekday and hour"
        />
      </Example>
      <Example title="Thresholds">
        <Chart
          className="w-full"
          definition={banded}
          ariaLabel="Sessions by weekday and hour, banded"
        />
      </Example>
    </Examples>
  )
}
