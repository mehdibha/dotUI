import { ChartBar } from "@/registry/ui/chart-bar"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

export default function ChartBarExamples() {
  return (
    <Examples>
      <Example title="Bar Chart">
        <ChartBar />
      </Example>
    </Examples>
  )
}
