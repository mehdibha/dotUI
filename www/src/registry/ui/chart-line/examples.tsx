import { useMemo } from "react"
import { defineChart } from "@tanstack/charts"
import { lineY } from "@tanstack/charts/line"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { fold } from "@tanstack/charts/transform/fold"

import { Chart, chartCurves, useChartLook } from "@/registry/ui/chart"
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

// Built from the live look, so the studio restyles the lines as it changes.
function charts(look: ChartLook) {
  const scales = {
    x: { scale: scalePoint },
    y: { scale: scaleLinear, nice: true, grid: true, axis: look.valueAxis },
  }
  return {
    single: defineChart({
      scales,
      marks: [
        lineY(data, {
          x: "month",
          y: "desktop",
          z: () => "Desktop",
          curve: look.curve,
          strokeWidth: look.strokeWidth,
          points: true,
        }),
      ],
    }),
    multiple: defineChart({
      scales,
      marks: [
        lineY(rows, {
          x: "month",
          y: "visitors",
          color: (row) => devices[row.device],
          curve: chartCurves.monotone,
          strokeWidth: look.strokeWidth,
        }),
      ],
    }),
  }
}

export default function ChartLineExamples() {
  const look = useChartLook()
  const { single, multiple } = useMemo(() => charts(look), [look])
  return (
    <Examples>
      <Example title="Default">
        <Chart
          className="w-full"
          definition={single}
          ariaLabel="Desktop visitors, January through June"
        />
      </Example>
      <Example title="Multiple Series">
        <Chart
          className="w-full"
          definition={multiple}
          ariaLabel="Desktop and mobile visitors, January through June"
        />
      </Example>
    </Examples>
  )
}
