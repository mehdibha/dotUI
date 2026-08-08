import { ScatterChart } from "@/registry/ui/chart-scatter"
import { Example } from "@/modules/create/preview/example"
import { Examples } from "@/modules/create/preview/examples"

const accounts = [
  { id: "a1", plan: "starter", seats: 3, spend: 57 },
  { id: "a2", plan: "starter", seats: 8, spend: 152 },
  { id: "a3", plan: "starter", seats: 11, spend: 209 },
  { id: "b1", plan: "growth", seats: 18, spend: 522 },
  { id: "b2", plan: "growth", seats: 25, spend: 725 },
  { id: "b3", plan: "growth", seats: 31, spend: 899 },
  { id: "c1", plan: "scale", seats: 52, spend: 2028 },
  { id: "c2", plan: "scale", seats: 78, spend: 3042 },
  { id: "c3", plan: "scale", seats: 95, spend: 3705 },
]

export default function ChartScatterExamples() {
  return (
    <Examples>
      <Example title="Scatter Chart" className="lg:max-w-2xl">
        <ScatterChart
          data={accounts}
          x="seats"
          y="spend"
          series="plan"
          seriesOrder={["starter", "growth", "scale"]}
          labels={{ starter: "Starter", growth: "Growth", scale: "Scale" }}
          rowKey="id"
          ariaLabel="Monthly spend by seat count, grouped by plan"
          className="w-full"
        />
      </Example>
    </Examples>
  )
}
