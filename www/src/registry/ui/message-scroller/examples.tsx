import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import DefaultDemo from './demos/default'

export default function MessageScrollerExample() {
  return (
    <Examples className="lg:grid-cols-1">
      <Example title="Transcript">
        <DefaultDemo />
      </Example>
    </Examples>
  )
}
