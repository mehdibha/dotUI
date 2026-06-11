import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import WithAddons from './demos/addons'
import Basic from './demos/basic'
import ColorChannel from './demos/color-channel'
import Controlled from './demos/controlled'
import Description from './demos/description'
import Disabled from './demos/disabled'
import Invalid from './demos/invalid'
import Label from './demos/label'
import ReadOnly from './demos/read-only'
import Required from './demos/required'
import Sizes from './demos/sizes'

export default function ColorFieldExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="With label">
        <Label />
      </Example>
      <Example title="With description">
        <Description />
      </Example>
      <Example title="disabled">
        <Disabled />
      </Example>
      <Example title="Invalid">
        <Invalid />
      </Example>
      <Example title="read only">
        <ReadOnly />
      </Example>
      <Example title="required">
        <Required />
      </Example>
      <Example title="sizes">
        <Sizes />
      </Example>
      <Example title="color channel">
        <ColorChannel />
      </Example>
      <Example title="controlled">
        <Controlled />
      </Example>
      <Example title="With addons">
        <WithAddons />
      </Example>
    </Examples>
  )
}
