import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import Controlled from './demos/controlled'
import CustomTrigger from './demos/custom-trigger'
import Highlighted from './demos/highlighted'
import WithAvatars from './demos/with-avatars'
import WithInput from './demos/with-input'

export default function MentionExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="Highlighted">
        <Highlighted />
      </Example>
      <Example title="With avatars">
        <WithAvatars />
      </Example>
      <Example title="Single-line input">
        <WithInput />
      </Example>
      <Example title="Custom trigger">
        <CustomTrigger />
      </Example>
      <Example title="Controlled">
        <Controlled />
      </Example>
    </Examples>
  )
}
