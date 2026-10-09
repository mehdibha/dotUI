"use client"

import { defineChart } from "@tanstack/charts"
import { barY } from "@tanstack/charts/bar"
import { lineY } from "@tanstack/charts/line"
import { decorative } from "@tanstack/charts/mark/decorative"
import { ruleY } from "@tanstack/charts/rule"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { text } from "@tanstack/charts/text"
import { tooltip } from "@tanstack/charts/tooltip"

import { Chart, chartBand, chartCurves, chartLook } from "@/registry/ui/chart"

const data = [
  { month: "Jan", revenue: 18_600, margin: 0.21 },
  { month: "Feb", revenue: 30_500, margin: 0.28 },
  { month: "Mar", revenue: 23_700, margin: 0.24 },
  { month: "Apr", revenue: 7_300, margin: 0.12 },
  { month: "May", revenue: 20_900, margin: 0.26 },
  { month: "Jun", revenue: 21_400, margin: 0.31 },
]

const TARGET = 25_000
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
})
const percent = new Intl.NumberFormat("en-US", { style: "percent" })

/* Bars, a line on a second y axis, and a dashed target in one definition. */
const chart = defineChart({
  scales: {
    x: { scale: chartBand },
    y: {
      scale: scaleLinear,
      nice: true,
      grid: true,
      axis: { ticks: { format: (value) => usd.format(Number(value)) } },
    },
    margin: {
      scale: scaleLinear,
      channel: "y",
      side: "right",
      nice: true,
      axis: { ticks: { format: (value) => percent.format(value) } },
    },
  },
  marks: [
    barY(data, {
      x: "month",
      y: "revenue",
      color: () => "Revenue",
      z: () => "Revenue",
      radius: chartLook.barRadius,
      maxThickness: chartLook.barMaxThickness,
    }),
    ruleY([TARGET], {
      stroke: "var(--color-fg-muted)",
      strokeDasharray: "4 4",
    }),
    decorative(
      text([TARGET], {
        x: () => "Jan",
        y: (value) => value,
        text: () => "Target",
        anchor: "start",
        dx: -26,
        dy: -6,
        fill: "var(--color-fg-muted)",
        fontSize: 11,
      }),
    ),
    lineY(data, {
      id: "margin",
      x: "month",
      y: "margin",
      yScale: "margin",
      color: () => "Margin",
      curve: chartCurves.monotone,
      strokeWidth: chartLook.strokeWidth,
      points: true,
    }),
  ],
  tooltip: {
    use: tooltip,
    content: (points) => ({
      title: String(points[0]?.xValue ?? ""),
      rows: points.map((point) => ({
        label: point.groupLabel,
        value:
          point.markId === "margin"
            ? percent.format(Number(point.yValue))
            : usd.format(Number(point.yValue)),
        color: point.color,
      })),
    }),
  },
})

export default function ChartComposed() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Monthly revenue against target, with margin on its own axis"
    />
  )
}
