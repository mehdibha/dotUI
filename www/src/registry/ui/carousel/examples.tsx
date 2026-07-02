import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Default from './demos/default'

export default function CarouselExamples() {
  return (
    <Examples className="md:grid-cols-1">
      <Example title="default">
        <Default />
      </Example>
    </Examples>
  )
}
