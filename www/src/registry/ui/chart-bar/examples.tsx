import { useMemo } from "react"
import { defineChart } from "@tanstack/charts"
import { barX, barY } from "@tanstack/charts/bar"
import { group } from "@tanstack/charts/group"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { stack } from "@tanstack/charts/stack"
import { fold } from "@tanstack/charts/transform/fold"

import { Chart, chartBand, useChartLook } from "@/registry/ui/chart"
import type { ChartLook } from "@/registry/ui/chart"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const devices = { desktop: "Desktop", mobile: "Mobile" }

const rows = fold(data, {
  fields: ["desktop", "mobile"],
  as: { key: "device", value: "visitors" },
})

// Built from the live look, so the studio restyles the bars as it changes.
function charts(look: ChartLook) {
  const value = {
    scale: scaleLinear,
    nice: true,
    grid: true,
    axis: look.valueAxis,
  }
  const bar = { radius: look.barRadius, maxThickness: look.barMaxThickness }
  return {
    grouped: defineChart({
      scales: { x: { scale: chartBand }, y: value },
      marks: [
        barY(rows, {
          ...bar,
          x: "month",
          y: "visitors",
          color: (row) => devices[row.device],
          layout: group({ padding: 0.15 }),
        }),
      ],
    }),
    stacked: defineChart({
      scales: { x: { scale: chartBand }, y: value },
      marks: [
        barY(rows, {
          ...bar,
          x: "month",
          y: "visitors",
          color: (row) => devices[row.device],
          layout: stack(),
          radius: { end: look.barRadius },
        }),
      ],
    }),
    horizontal: defineChart({
      scales: { x: value, y: { scale: chartBand } },
      marks: [
        barX(data, { ...bar, x: "desktop", y: "month", z: () => "Desktop" }),
      ],
      focus: "group-y",
    }),
  }
}

export default function ChartBarExamples() {
  const look = useChartLook()
  const { grouped, stacked, horizontal } = useMemo(() => charts(look), [look])
  return (
    <Examples>
      <Example title="Grouped">
        <Chart
          className="w-full"
          definition={grouped}
          ariaLabel="Desktop and mobile visitors per month"
        />
      </Example>
      <Example title="Stacked">
        <Chart
          className="w-full"
          definition={stacked}
          ariaLabel="Visitors per month by device, stacked"
        />
      </Example>
      <Example title="Horizontal">
        <Chart
          className="w-full"
          definition={horizontal}
          ariaLabel="Desktop visitors per month, horizontal bars"
        />
      </Example>
    </Examples>
  )
}
