import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import LineNumbers from './demos/line-numbers'
import NoHeader from './demos/no-header'
import Plain from './demos/plain'
import Wrap from './demos/wrap'

export default function CodeBlockExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="Line Numbers">
        <LineNumbers />
      </Example>
      <Example title="Without Header">
        <NoHeader />
      </Example>
      <Example title="Word Wrap">
        <Wrap />
      </Example>
      <Example title="Plain">
        <Plain />
      </Example>
    </Examples>
  )
}
