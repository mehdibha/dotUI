import { ChartLine } from '@/registry/ui/chart-line'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

export default function ChartLineExamples() {
  return (
    <Examples>
      <Example title="Line Chart">
        <ChartLine />
      </Example>
    </Examples>
  )
}
