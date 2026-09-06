import { ChartArea } from "@/registry/ui/chart-area"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

export default function ChartAreaExamples() {
  return (
    <Examples>
      <Example title="Area Chart">
        <ChartArea />
      </Example>
    </Examples>
  )
}
