import { useMemo } from "react"
import { defineChart } from "@tanstack/charts"
import {
  angleGrid,
  focusGroupAngle,
  polar,
  radialArea,
  radialGrid,
  radialLine,
} from "@tanstack/charts/polar"
import { scaleLinear } from "@tanstack/charts/scales/linear"
import { scalePoint } from "@tanstack/charts/scales/point"
import { fold } from "@tanstack/charts/transform/fold"
import { curveLinearClosed } from "d3-shape"

import { Chart, chartAngleLabels, useChartLook } from "@/registry/ui/chart"
import type { ChartLook } from "@/registry/ui/chart"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 273, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const devices = { desktop: "Desktop", mobile: "Mobile" }

const rows = fold(data, {
  fields: ["desktop", "mobile"],
  as: { key: "device", value: "visitors" },
})

const single = {
  angle: "month",
  radius: "desktop",
  z: () => "Desktop",
} as const

const multiple = {
  angle: "month",
  radius: "visitors",
  color: (row: (typeof rows)[number]) => devices[row.device],
} as const

const area = { curve: curveLinearClosed, fillOpacity: 0.6 }
const line = { curve: curveLinearClosed, strokeWidth: 1.5 }

// Built from the live look, so the studio restyles the grid as it changes.
function charts(look: ChartLook) {
  const frame = {
    scales: {
      angle: { scale: scalePoint },
      radius: { scale: scaleLinear, nice: 4 },
    },
    radiusRatio: 0.78,
    guides: [
      radialGrid({
        ticks: 4,
        shape: "polygon",
        strokeDasharray: look.grid.strokeDasharray,
      }),
      angleGrid({
        ...chartAngleLabels,
        strokeDasharray: look.grid.strokeDasharray,
      }),
    ],
  }
  return {
    single: defineChart({
      scales: { x: null, y: null },
      marks: [
        polar({
          ...frame,
          marks: [
            radialArea(data, { ...single, ...area }),
            radialLine(data, { ...single, ...line }),
          ],
        }),
      ],
      focus: focusGroupAngle,
    }),
    multiple: defineChart({
      scales: { x: null, y: null },
      marks: [
        polar({
          ...frame,
          marks: [
            radialArea(rows, { ...multiple, ...area }),
            radialLine(rows, { ...multiple, ...line }),
          ],
        }),
      ],
      focus: focusGroupAngle,
    }),
  }
}

export default function ChartRadarExamples() {
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
