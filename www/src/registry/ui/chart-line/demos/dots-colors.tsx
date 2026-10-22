"use client"

import { defineChart } from "@tanstack/charts"
import { dot } from "@tanstack/charts/dot"
import { lineY } from "@tanstack/charts/line"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"

import { Chart, chartLook } from "@/registry/ui/chart"

const data = [
  { browser: "Chrome", visitors: 275, color: "var(--chart-1)" },
  { browser: "Safari", visitors: 200, color: "var(--chart-2)" },
  { browser: "Firefox", visitors: 187, color: "var(--chart-3)" },
  { browser: "Edge", visitors: 173, color: "var(--chart-4)" },
  { browser: "Other", visitors: 90, color: "var(--chart-5)" },
]

const series = { x: "browser", y: "visitors", z: () => "Visitors" } as const

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
  marks: [
    lineY(data, {
      ...series,
      curve: chartLook.curve,
      strokeWidth: chartLook.strokeWidth,
    }),
    ...data.map((row) => dot([row], { ...series, r: 4, fill: row.color })),
  ],
})

export default function Demo() {
  return <Chart definition={chart} ariaLabel="Visitors by browser" />
}
