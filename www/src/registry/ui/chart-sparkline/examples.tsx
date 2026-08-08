import { Sparkline } from "@/registry/ui/chart-sparkline"
import { Example } from "@/modules/create/preview/example"
import { Examples } from "@/modules/create/preview/examples"

const data = [
  { day: "Mon", visitors: 186 },
  { day: "Tue", visitors: 205 },
  { day: "Wed", visitors: 173 },
  { day: "Thu", visitors: 241 },
  { day: "Fri", visitors: 209 },
  { day: "Sat", visitors: 264 },
  { day: "Sun", visitors: 312 },
]

export default function ChartSparklineExamples() {
  return (
    <Examples>
      <Example title="Default">
        <Sparkline
          className="w-full"
          data={data}
          x="day"
          y="visitors"
          ariaLabel="Visitors over the last seven days"
        />
      </Example>
      <Example title="Area">
        <Sparkline
          className="w-full"
          data={data}
          x="day"
          y="visitors"
          mode="area"
          fill="gradient"
          ariaLabel="Visitors over the last seven days"
        />
      </Example>
      <Example title="Colored">
        <Sparkline
          className="w-full"
          data={data}
          x="day"
          y="visitors"
          mode="area"
          color="var(--color-success)"
          ariaLabel="Visitors over the last seven days, trending up"
        />
      </Example>
    </Examples>
  )
}
