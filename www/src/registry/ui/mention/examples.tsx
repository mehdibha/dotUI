import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import Controlled from './demos/controlled'
import CustomTrigger from './demos/custom-trigger'
import MultipleTriggers from './demos/multiple-triggers'
import WithAvatars from './demos/with-avatars'
import WithInput from './demos/with-input'

export default function MentionExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="Multiple triggers">
        <MultipleTriggers />
      </Example>
      <Example title="With avatars">
        <WithAvatars />
      </Example>
      <Example title="Single-line">
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
