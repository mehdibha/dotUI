"use client"

import { defineChart } from "@tanstack/charts"
import { areaY } from "@tanstack/charts/area"
import { lineY } from "@tanstack/charts/line"
import { decorative } from "@tanstack/charts/mark/decorative"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"

import { Chart, chartLook } from "@/registry/ui/chart"

/* Long format: one row per series per x value, with the series key in a field. */
const data = [
  { month: "Jan", channel: "organic_search", visitors: 186 },
  { month: "Jan", channel: "paid_social", visitors: 80 },
  { month: "Feb", channel: "organic_search", visitors: 305 },
  { month: "Feb", channel: "paid_social", visitors: 200 },
  { month: "Mar", channel: "organic_search", visitors: 237 },
  { month: "Mar", channel: "paid_social", visitors: 120 },
  { month: "Apr", channel: "organic_search", visitors: 173 },
  { month: "Apr", channel: "paid_social", visitors: 190 },
  { month: "May", channel: "organic_search", visitors: 209 },
  { month: "May", channel: "paid_social", visitors: 130 },
  { month: "Jun", channel: "organic_search", visitors: 214 },
  { month: "Jun", channel: "paid_social", visitors: 140 },
]

const channels: Record<string, string> = {
  organic_search: "Organic search",
  paid_social: "Paid social",
}

const series = {
  x: "month",
  y: "visitors",
  color: (row: (typeof data)[number]) => channels[row.channel],
  curve: chartLook.curve,
} as const

const chart = defineChart({
  scales: {
    x: { scale: scalePoint },
    y: {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: chartLook.valueAxis,
    },
  },
  // The domain orders the colors: paid social takes the first.
  color: { domain: ["Paid social", "Organic search"] },
  marks: [
    areaY(data, { ...series, y1: 0, fillOpacity: chartLook.areaOpacity }),
    decorative(lineY(data, { ...series, strokeWidth: chartLook.strokeWidth })),
  ],
})

export default function ChartAreaLabels() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Visitors by acquisition channel, January through June"
    />
  )
}
