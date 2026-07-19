import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import Controlled from './demos/controlled'
import Hashtags from './demos/hashtags'
import Tags from './demos/tags'

export default function TokenFieldExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="Automatic tokenization">
        <Hashtags />
      </Example>
      <Example title="Tag input">
        <Tags />
      </Example>
      <Example title="Controlled">
        <Controlled />
      </Example>
    </Examples>
  )
}
