import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import DefaultDemo from './demos/default'
import ImageDemo from './demos/image'
import StatesDemo from './demos/states'

export default function AttachmentExample() {
  return (
    <Examples className="lg:grid-cols-1">
      <Example title="File">
        <DefaultDemo />
      </Example>
      <Example title="Upload states">
        <StatesDemo />
      </Example>
      <Example title="Images">
        <ImageDemo />
      </Example>
    </Examples>
  )
}
