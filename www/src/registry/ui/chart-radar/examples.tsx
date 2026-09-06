import { ChartRadar } from "@/registry/ui/chart-radar"
import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

export default function ChartRadarExamples() {
  return (
    <Examples>
      <Example title="Radar Chart">
        <ChartRadar />
      </Example>
    </Examples>
  )
}
