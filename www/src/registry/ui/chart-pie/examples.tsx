import { ChartPie } from '@/registry/ui/chart-pie'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

export default function ChartPieExamples() {
  return (
    <Examples>
      <Example title="Pie Chart">
        <ChartPie />
      </Example>
    </Examples>
  )
}
