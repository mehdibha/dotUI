import { defineChart } from "@tanstack/charts"

import { Chart } from "@/registry/ui/chart"
import { radarChart } from "@/registry/ui/chart-radar"
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

const labels = { desktop: "Desktop", mobile: "Mobile" }

const single = defineChart(
  radarChart(data, { x: "month", y: "desktop", labels }),
)

const multiple = defineChart(
  radarChart(data, { x: "month", y: ["desktop", "mobile"], labels }),
)

export default function ChartRadarExamples() {
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
