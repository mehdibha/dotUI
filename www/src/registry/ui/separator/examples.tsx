import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Card from './demos/card'
import Orientation from './demos/orientation'

export default function SeparatorExamples() {
  return (
    <Examples>
      <Example title="card">
        <Card />
      </Example>
      <Example title="orientation">
        <Orientation />
      </Example>
    </Examples>
  )
}
