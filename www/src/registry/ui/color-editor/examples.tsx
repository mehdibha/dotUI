import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Default from './demos/default'

export default function ColorEditorExamples() {
  return (
    <Examples>
      <Example title="default">
        <Default />
      </Example>
    </Examples>
  )
}
