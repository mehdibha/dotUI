import { heatmapColors, HeatmapChart } from "@/registry/ui/chart-heatmap"
import { Example } from "@/modules/create/preview/example"
import { Examples } from "@/modules/create/preview/examples"

const hours = [
  { hour: "09", base: 32 },
  { hour: "10", base: 58 },
  { hour: "11", base: 74 },
  { hour: "12", base: 61 },
  { hour: "13", base: 42 },
  { hour: "14", base: 66 },
  { hour: "15", base: 88 },
  { hour: "16", base: 71 },
]

const days = [
  { day: "Mon", weight: 1 },
  { day: "Tue", weight: 0.94 },
  { day: "Wed", weight: 1.06 },
  { day: "Thu", weight: 1.12 },
  { day: "Fri", weight: 0.87 },
]

const data = days.flatMap(({ day, weight }) =>
  hours.map(({ hour, base }) => ({
    day,
    hour,
    sessions: Math.round(base * weight),
  })),
)

export default function ChartHeatmapExamples() {
  return (
    <Examples>
      <Example title="Default">
        <HeatmapChart
          className="w-full"
          data={data}
          x="hour"
          y="day"
          value="sessions"
          label="Sessions"
          ariaLabel="Sessions by weekday and hour"
        />
      </Example>
      <Example title="Thresholds">
        <HeatmapChart
          className="w-full"
          data={data}
          x="hour"
          y="day"
          value="sessions"
          colors={heatmapColors("var(--chart-4)", 4)}
          thresholds={[40, 60, 80]}
          label="Sessions"
          ariaLabel="Sessions by weekday and hour, banded"
        />
      </Example>
    </Examples>
  )
}
