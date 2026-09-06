import { ChartPie } from "@/registry/ui/chart-pie"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

export default function ChartPieExamples() {
  return (
    <Examples>
      <Example title="Pie Chart">
        <ChartPie />
      </Example>
    </Examples>
  )
}
