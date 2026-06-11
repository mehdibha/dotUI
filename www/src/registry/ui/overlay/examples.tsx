import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import Type from './demos/type'

export default function OverlayExamples() {
  return (
    <Examples>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="type">
        <Type />
      </Example>
    </Examples>
  )
}
