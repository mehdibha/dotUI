import { ChartLine } from "@/registry/ui/chart-line"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

export default function ChartLineExamples() {
  return (
    <Examples>
      <Example title="Line Chart">
        <ChartLine />
      </Example>
    </Examples>
  )
}
