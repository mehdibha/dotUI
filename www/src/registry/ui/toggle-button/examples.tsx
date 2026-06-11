import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Default from './demos/default'
import Disabled from './demos/disabled'
import PrefixAndSuffix from './demos/prefix-and-suffix'
import Shapes from './demos/shapes'
import Sizes from './demos/sizes'
import Variants from './demos/variants'

export default function ToggleButtonExamples() {
  return (
    <Examples className="grid-cols-2">
      <Example title="default">
        <Default />
      </Example>
      <Example title="variants">
        <Variants />
      </Example>
      <Example title="with text">
        <PrefixAndSuffix />
      </Example>
      <Example title="sizes">
        <Sizes />
      </Example>
      <Example title="shapes">
        <Shapes />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
    </Examples>
  )
}
