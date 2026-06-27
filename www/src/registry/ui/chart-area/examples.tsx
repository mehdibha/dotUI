import { ChartArea } from '@/registry/ui/chart-area'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

export default function ChartAreaExamples() {
  return (
    <Examples>
      <Example title="Area Chart">
        <ChartArea />
      </Example>
    </Examples>
  )
}
