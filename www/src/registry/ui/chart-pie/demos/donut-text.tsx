"use client"

import { defineChart } from "@tanstack/charts"
import { pie, polar, radialArc } from "@tanstack/charts/polar"

import { Chart, chartSliceTooltip } from "@/registry/ui/chart"

const data = [
  { browser: "Chrome", visitors: 275 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 187 },
  { browser: "Edge", visitors: 173 },
  { browser: "Other", visitors: 90 },
]

const total = data.reduce((sum, row) => sum + row.visitors, 0)

const chart = defineChart({
  scales: { x: null, y: null },
  marks: [
    polar({
      scales: { angle: null, radius: null },
      radiusRatio: 0.9,
      marks: [
        radialArc(pie(data, { value: "visitors" }), {
          color: "browser",
          innerRadius: ({ radius }) => radius * 0.6,
          stroke: "var(--surface-bg,var(--color-bg))",
          strokeWidth: 2,
        }),
      ],
    }),
  ],
  focus: "nearest",
  tooltip: chartSliceTooltip("browser", "visitors"),
})

export default function ChartPieDonutText() {
  return (
    <Chart
      definition={chart}
      ariaLabel="Visitors by browser, with the total in the centre"
    >
      {/* Real text, not a mark competing for focus. */}
      <div className="flex h-full flex-col items-center justify-center">
        <span className="text-3xl font-bold">{total}</span>
        <span className="text-sm text-fg-muted">Visitors</span>
      </div>
    </Chart>
  )
}
