import { defineChart } from "@tanstack/charts"
import { pie, polar, radialArc } from "@tanstack/charts/polar"

import { Chart, chartLegend, chartSliceTooltip } from "@/registry/ui/chart"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

const data = [
  { browser: "Chrome", visitors: 275 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 187 },
  { browser: "Edge", visitors: 173 },
  { browser: "Other", visitors: 90 },
]

const slices = pie(data, { value: "visitors" })

const arc = {
  color: "browser",
  stroke: "var(--surface-bg,var(--color-bg))",
  strokeWidth: 2,
} as const

// Slices read nothing from the look: the host applies its legend and motion.
const simple = defineChart({
  scales: { x: null, y: null },
  marks: [
    polar({
      scales: { angle: null, radius: null },
      radiusRatio: 0.9,
      marks: [radialArc(slices, arc)],
    }),
  ],
  focus: "nearest",
  tooltip: chartSliceTooltip("browser", "visitors"),
})

const donut = defineChart({
  scales: { x: null, y: null },
  color: { legend: chartLegend },
  marks: [
    polar({
      scales: { angle: null, radius: null },
      radiusRatio: 0.85,
      marks: [
        radialArc(slices, {
          ...arc,
          innerRadius: ({ radius }) => radius * 0.55,
        }),
      ],
    }),
  ],
  focus: "nearest",
  tooltip: chartSliceTooltip("browser", "visitors"),
})

export default function ChartPieExamples() {
  return (
    <Examples>
      <Example title="Default">
        <Chart
          className="w-full"
          definition={simple}
          ariaLabel="Visitors by browser"
        />
      </Example>
      <Example title="Donut">
        <Chart
          className="w-full"
          definition={donut}
          ariaLabel="Visitors by browser, donut"
        />
      </Example>
    </Examples>
  )
}
