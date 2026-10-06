"use client"

import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { heatmapChart, heatmapColors } from "@/registry/ui/chart-heatmap"

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

/* The cuts are a policy, not an extent: one incident is already worth
   seeing, ten is an outage week. */
const chart = defineChart(
  heatmapChart(data, {
    x: "week",
    y: "service",
    value: "incidents",
    label: "Incidents",
    colors: heatmapColors("var(--chart-4)", 4),
    thresholds: [1, 4, 10],
  }),
)

export default function ChartHeatmapDiscreteScale() {
  return (
    <Chart
      definition={chart}
      height={200}
      ariaLabel="Incidents per service and week"
    />
  )
}
