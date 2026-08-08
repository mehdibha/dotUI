import { LineChart } from "@/registry/ui/chart-line"
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

const labels = { desktop: "Desktop", mobile: "Mobile" }

export default function ChartLineExamples() {
  return (
    <Examples>
      <Example title="Default">
        <LineChart
          className="w-full"
          data={data}
          x="month"
          y="desktop"
          labels={labels}
          legend={false}
          points
          ariaLabel="Desktop visitors, January through June"
        />
      </Example>
      <Example title="Multiple Series">
        <LineChart
          className="w-full"
          data={data}
          x="month"
          y={["desktop", "mobile"]}
          labels={labels}
          curve="monotone"
          ariaLabel="Desktop and mobile visitors, January through June"
        />
      </Example>
    </Examples>
  )
}
