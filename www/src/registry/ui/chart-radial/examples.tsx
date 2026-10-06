import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { radialChart } from "@/registry/ui/chart-radial"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

const data = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
]

const rings = defineChart(
  radialChart(data, {
    value: "visitors",
    name: "browser",
    labels: {
      chrome: "Chrome",
      safari: "Safari",
      firefox: "Firefox",
      edge: "Edge",
      other: "Other",
    },
    innerRadius: 0.3,
    radiusRatio: 0.95,
    track: true,
  }),
)

const progress = defineChart(
  radialChart([{ browser: "safari", visitors: 1260 }], {
    value: "visitors",
    name: "browser",
    labels: { safari: "Safari" },
    endAngle: (250 * Math.PI) / 180,
    innerRadius: 0.78,
    outerRadius: 0.95,
    radiusRatio: 0.9,
    cornerRadius: 999,
    track: true,
    max: 1600,
  }),
)

export default function ChartRadialExamples() {
  return (
    <Examples>
      <Example title="Default">
        <Chart
          className="w-full"
          definition={rings}
          ariaLabel="Visitors by browser"
        />
      </Example>
      <Example title="Progress Ring">
        <Chart
          className="w-full"
          definition={progress}
          ariaLabel="Safari visitors as a progress ring"
        >
          <div className="flex h-full flex-col items-center justify-center">
            <span className="text-2xl font-bold">1,260</span>
            <span className="text-sm text-fg-muted">Visitors</span>
          </div>
        </Chart>
      </Example>
    </Examples>
  )
}
