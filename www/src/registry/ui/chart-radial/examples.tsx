import { ChartRadial } from '@/registry/ui/chart-radial'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

export default function ChartRadialExamples() {
  return (
    <Examples>
      <Example title="Radial Chart">
        <ChartRadial />
      </Example>
    </Examples>
  )
}
