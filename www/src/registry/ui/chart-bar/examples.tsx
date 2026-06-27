import { ChartBar } from '@/registry/ui/chart-bar'
import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

export default function ChartBarExamples() {
  return (
    <Examples>
      <Example title="Bar Chart">
        <ChartBar />
      </Example>
    </Examples>
  )
}
