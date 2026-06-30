import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import DefaultDemo from './demos/default'
import VariantsDemo from './demos/variants'

export default function MarkerExample() {
  return (
    <Examples className="lg:grid-cols-1">
      <Example title="Status & separator">
        <DefaultDemo />
      </Example>
      <Example title="Variants">
        <VariantsDemo />
      </Example>
    </Examples>
  )
}
