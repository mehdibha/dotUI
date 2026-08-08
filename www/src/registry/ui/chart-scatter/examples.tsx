import { ScatterChart } from "@/registry/ui/chart-scatter"
import { Example } from "@/modules/create/preview/example"
import { Examples } from "@/modules/create/preview/examples"

const accounts = [
  { id: "a1", plan: "starter", seats: 3, spend: 57, sessions: 210 },
  { id: "a2", plan: "starter", seats: 8, spend: 152, sessions: 480 },
  { id: "a3", plan: "starter", seats: 11, spend: 209, sessions: 640 },
  { id: "b1", plan: "growth", seats: 18, spend: 522, sessions: 1180 },
  { id: "b2", plan: "growth", seats: 25, spend: 725, sessions: 1720 },
  { id: "b3", plan: "growth", seats: 31, spend: 899, sessions: 2260 },
  { id: "c1", plan: "scale", seats: 52, spend: 2028, sessions: 4100 },
  { id: "c2", plan: "scale", seats: 78, spend: 3042, sessions: 6350 },
  { id: "c3", plan: "scale", seats: 95, spend: 3705, sessions: 8020 },
]

const labels = { starter: "Starter", growth: "Growth", scale: "Scale" }

export default function ChartScatterExamples() {
  return (
    <Examples>
      <Example title="Default">
        <ScatterChart
          className="w-full"
          data={accounts}
          x="seats"
          y="spend"
          rowKey="id"
          ariaLabel="Monthly spend by seat count"
        />
      </Example>
      <Example title="Grouped">
        <ScatterChart
          className="w-full"
          data={accounts}
          x="seats"
          y="spend"
          series="plan"
          seriesOrder={["starter", "growth", "scale"]}
          labels={labels}
          rowKey="id"
          ariaLabel="Monthly spend by seat count, grouped by plan"
        />
      </Example>
      <Example title="Bubble">
        <ScatterChart
          className="w-full"
          data={accounts}
          x="seats"
          y="spend"
          r="sessions"
          rowKey="id"
          fillOpacity={0.55}
          ariaLabel="Monthly spend by seat count, sized by sessions"
        />
      </Example>
    </Examples>
  )
}
