import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Compact from './demos/compact'
import Controlled from './demos/controlled'
import Default from './demos/default'
import Links from './demos/links'
import Sizes from './demos/sizes'

export default function PaginationExamples() {
  return (
    <Examples>
      <Example title="default">
        <Default />
      </Example>
      <Example title="links">
        <Links />
      </Example>
      <Example title="sizes">
        <Sizes />
      </Example>
      <Example title="compact">
        <Compact />
      </Example>
      <Example title="controlled">
        <Controlled />
      </Example>
    </Examples>
  )
}
