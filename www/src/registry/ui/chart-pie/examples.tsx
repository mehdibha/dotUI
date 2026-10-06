import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { pieChart } from "@/registry/ui/chart-pie"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

const data = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 187 },
  { browser: "edge", visitors: 173 },
  { browser: "other", visitors: 90 },
]

const labels = {
  chrome: "Chrome",
  safari: "Safari",
  firefox: "Firefox",
  edge: "Edge",
  other: "Other",
}

const pie = defineChart(
  pieChart(data, { value: "visitors", name: "browser", labels }),
)

const donut = defineChart(
  pieChart(data, {
    value: "visitors",
    name: "browser",
    labels,
    innerRadius: 0.55,
    radiusRatio: 0.85,
    legend: true,
  }),
)

export default function ChartPieExamples() {
  return (
    <Examples>
      <Example title="Default">
        <Chart
          className="w-full"
          definition={pie}
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
