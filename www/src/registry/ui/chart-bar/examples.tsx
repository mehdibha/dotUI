import { stackY } from "@/registry/ui/chart"
import { BarChart } from "@/registry/ui/chart-bar"
import { Example } from "@/modules/create/preview/example"
import { Examples } from "@/modules/create/preview/examples"

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const stacked = stackY(data, { x: "month", y: ["desktop", "mobile"] })

const labels = { desktop: "Desktop", mobile: "Mobile" }

export default function ChartBarExamples() {
  return (
    <Examples>
      <Example title="Grouped">
        <BarChart
          className="w-full"
          data={data}
          x="month"
          y={["desktop", "mobile"]}
          labels={labels}
          ariaLabel="Desktop and mobile visitors per month"
        />
      </Example>
      <Example title="Stacked">
        <BarChart
          className="w-full"
          data={stacked}
          x="x"
          y="top"
          y1="base"
          series="series"
          seriesOrder={["desktop", "mobile"]}
          labels={labels}
          radius={2}
          ariaLabel="Visitors per month by device, stacked"
        />
      </Example>
      <Example title="Horizontal">
        <BarChart
          className="w-full"
          data={data}
          x="month"
          y="desktop"
          labels={labels}
          horizontal
          legend={false}
          focus="group-y"
          ariaLabel="Desktop visitors per month, horizontal bars"
        />
      </Example>
    </Examples>
  )
}
