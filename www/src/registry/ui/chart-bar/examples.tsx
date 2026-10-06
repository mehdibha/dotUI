import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { barChart } from "@/registry/ui/chart-bar"
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

const grouped = defineChart(
  barChart(data, { x: "month", y: ["desktop", "mobile"], labels }),
)

const stacked = defineChart(
  barChart(data, {
    x: "month",
    y: ["desktop", "mobile"],
    labels,
    stacked: true,
  }),
)

const horizontal = defineChart(
  barChart(data, { x: "month", y: "desktop", labels, horizontal: true }),
)

export default function ChartBarExamples() {
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
