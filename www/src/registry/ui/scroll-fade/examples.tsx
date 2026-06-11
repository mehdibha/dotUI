import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import BothAxes from './demos/both-axes'
import Horizontal from './demos/horizontal'

export default function ScrollFadeExamples() {
  return (
    <Examples>
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="Horizontal">
        <Horizontal />
      </Example>
      <Example title="Both axes">
        <BothAxes />
      </Example>
    </Examples>
  )
}
