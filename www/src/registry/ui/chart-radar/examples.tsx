import { ChartRadar } from '@/registry/ui/chart-radar'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

export default function ChartRadarExamples() {
  return (
    <Examples>
      <Example title="Radar Chart">
        <ChartRadar />
      </Example>
    </Examples>
  )
}
