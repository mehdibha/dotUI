"use client"

import { defineChart } from "@tanstack/charts"
import { colorLegend } from "@tanstack/charts/legend"
import { cell } from "@tanstack/charts/rect"
import { scaleBand } from "@tanstack/charts/scales/band"
import { tooltip } from "@tanstack/charts/tooltip"
import { scaleThreshold } from "d3-scale"

import { Chart, chartLook } from "@/registry/ui/chart"

const services = [
  { service: "api", counts: [0, 1, 0, 3, 12, 4, 1, 0] },
  { service: "auth", counts: [1, 0, 0, 0, 2, 1, 0, 0] },
  { service: "billing", counts: [4, 2, 6, 1, 0, 0, 3, 11] },
  { service: "search", counts: [0, 0, 1, 0, 1, 0, 0, 2] },
  { service: "workers", counts: [7, 5, 2, 9, 14, 6, 3, 1] },
]

const data = services.flatMap(({ service, counts }) =>
  counts.map((incidents, index) => ({
    service,
    week: `W${index + 1}`,
    incidents,
  })),
)

const colors = [
  "color-mix(in oklab, var(--chart-4) 20%, var(--surface-bg,var(--color-bg)))",
  "color-mix(in oklab, var(--chart-4) 73%, var(--surface-bg,var(--color-bg)))",
  "color-mix(in oklab, var(--chart-4) 77%, var(--color-fg))",
  "color-mix(in oklab, var(--chart-4) 32%, var(--color-fg))",
]

const chart = defineChart({
  scales: {
    x: { scale: scaleBand },
    y: { scale: scaleBand },
  },
  /* The cuts are a policy, not an extent: one incident is already worth
     seeing, ten is an outage week. */
  color: {
    scale: scaleThreshold<number, string>,
    domain: [1, 4, 10],
    range: colors,
    legend: colorLegend({ label: "Incidents" }),
  },
  marks: [
    cell(data, {
      x: "week",
      y: "service",
      color: "incidents",
      radius: Math.min(chartLook.barRadius, 2),
      inset: 1,
    }),
  ],
  focus: "nearest",
  tooltip: {
    use: tooltip,
    anchor: "point",
    content: (points) => ({
      title:
        points[0] && `${points[0].datum.week} · ${points[0].datum.service}`,
      rows: points.map((point) => ({
        label: "Incidents",
        value: String(point.datum.incidents),
        color: point.color,
      })),
    }),
  },
})

export default function ChartHeatmapDiscreteScale() {
  return (
    <Chart
      definition={chart}
      height={200}
      ariaLabel="Incidents per service and week"
    />
  )
}
