import { useMemo } from "react"
import { defineChart } from "@tanstack/charts"
import { areaY } from "@tanstack/charts/area"
import { lineY } from "@tanstack/charts/line"
import { decorative } from "@tanstack/charts/mark/decorative"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { fold } from "@tanstack/charts/transform/fold"

import { Chart, chartFades, useChartLook } from "@/registry/ui/chart"
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
const fields = ["desktop", "mobile"] as const

const rows = fold(data, {
  fields,
  as: { key: "device", value: "visitors" },
})

// Built from the live look, so the studio restyles the areas as it changes.
function charts(look: ChartLook) {
  const scales = {
    x: { scale: scalePoint },
    y: { scale: scaleLinear, nice: true, grid: true, axis: look.valueAxis },
  }
  const desktop = {
    x: "month",
    y: "desktop",
    z: () => "Desktop",
    curve: look.curve,
  } as const
  const series = {
    x: "month",
    y: "visitors",
    color: (row: (typeof rows)[number]) => devices[row.device],
    curve: look.curve,
  } as const
  return {
    single: defineChart({
      scales,
      marks: [
        areaY(data, { ...desktop, fillOpacity: look.areaOpacity }),
        decorative(lineY(data, { ...desktop, strokeWidth: look.strokeWidth })),
      ],
    }),
    gradient: defineChart({
      scales,
      gradients: chartFades,
      marks: [
        decorative(
          areaY(rows, {
            ...series,
            y1: 0,
            fill: (row) => `url(#chart-fade-${fields.indexOf(row.device)})`,
          }),
        ),
        areaY(rows, { ...series, y1: 0, fillOpacity: 0 }),
        decorative(lineY(rows, { ...series, strokeWidth: look.strokeWidth })),
      ],
    }),
  }
}

export default function ChartAreaExamples() {
  const look = useChartLook()
  const { single, gradient } = useMemo(() => charts(look), [look])
  return (
    <Examples>
      <Example title="Default">
        <Chart
          className="w-full"
          definition={single}
          ariaLabel="Desktop visitors, January through June"
        />
      </Example>
      <Example title="Gradient">
        <Chart
          className="w-full"
          definition={gradient}
          ariaLabel="Desktop and mobile visitors, January through June"
        />
      </Example>
    </Examples>
  )
}
