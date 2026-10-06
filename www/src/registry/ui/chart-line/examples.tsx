import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { lineChart } from "@/registry/ui/chart-line"
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

const labels = { desktop: "Desktop", mobile: "Mobile" }

const single = defineChart(
  lineChart(data, { x: "month", y: "desktop", labels, points: true }),
)

const multiple = defineChart(
  lineChart(data, {
    x: "month",
    y: ["desktop", "mobile"],
    labels,
    curve: "monotone",
  }),
)

export default function ChartLineExamples() {
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
