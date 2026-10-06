"use client"

import { defineChart } from "@tanstack/charts"
import { dot } from "@tanstack/charts/dot"

import { Chart } from "@/registry/ui/chart"
import { lineChart } from "@/registry/ui/chart-line"

const SERIES = "Visitors"

const data = [
  { browser: "Chrome", visitors: 275, color: "var(--chart-1)" },
  { browser: "Safari", visitors: 200, color: "var(--chart-2)" },
  { browser: "Firefox", visitors: 187, color: "var(--chart-3)" },
  { browser: "Edge", visitors: 173, color: "var(--chart-4)" },
  { browser: "Other", visitors: 90, color: "var(--chart-5)" },
]

const line = lineChart(data, {
  x: "browser",
  y: "visitors",
  labels: { visitors: SERIES },
})

/* `dot.fill` is a constant, so per-point color means one mark per color. The
   line's series name as `z` keeps each dot in the line's focus group. */
const dots = data.map((row) =>
  dot([row], {
    x: "browser",
    y: "visitors",
    z: () => SERIES,
    r: 4,
    fill: row.color,
  }),
)

const chart = defineChart({ ...line, marks: [...line.marks, ...dots] })

export default function ChartLineDotsColors() {
  return <Chart definition={chart} ariaLabel="Visitors by browser" />
}
