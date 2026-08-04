import { PieChart } from "@/registry/ui/chart-pie"
import { Example } from "@/modules/create/preview/example"
import { Examples } from "@/modules/create/preview/examples"

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

export default function ChartPieExamples() {
  return (
    <Examples className="lg:grid-cols-1">
      <Example title="Pie Chart">
        <PieChart
          data={data}
          value="visitors"
          name="browser"
          labels={labels}
          stroke="var(--color-bg)"
          strokeWidth={2}
          ariaLabel="Visitors by browser"
        />
      </Example>
      <Example title="Donut">
        <PieChart
          data={data}
          value="visitors"
          name="browser"
          labels={labels}
          innerRadius={0.55}
          legend
          radiusRatio={0.85}
          stroke="var(--color-bg)"
          strokeWidth={2}
          ariaLabel="Visitors by browser, donut"
        />
      </Example>
    </Examples>
  )
}
