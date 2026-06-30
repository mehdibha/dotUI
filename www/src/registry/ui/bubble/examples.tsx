import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import DefaultDemo from './demos/default'
import ReactionsDemo from './demos/reactions'
import VariantsDemo from './demos/variants'

export default function BubbleExample() {
  return (
    <Examples className="lg:grid-cols-1">
      <Example title="Conversation">
        <DefaultDemo />
      </Example>
      <Example title="Variants">
        <VariantsDemo />
      </Example>
      <Example title="Reactions">
        <ReactionsDemo />
      </Example>
    </Examples>
  )
}
