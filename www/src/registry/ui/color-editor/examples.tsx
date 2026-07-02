import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import AlphaChannel from './demos/alpha-channel'
import Composition from './demos/composition'
import Default from './demos/default'

export default function ColorEditorExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="Default">
        <Default />
      </Example>
      <Example title="Alpha channel">
        <AlphaChannel />
      </Example>
      <Example title="Custom composition">
        <Composition />
      </Example>
    </Examples>
  )
}
