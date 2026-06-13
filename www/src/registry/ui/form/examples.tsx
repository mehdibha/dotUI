import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import Validation from './demos/validation'

export default function FormExamples() {
  return (
    <Examples>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="validation">
        <Validation />
      </Example>
    </Examples>
  )
}
