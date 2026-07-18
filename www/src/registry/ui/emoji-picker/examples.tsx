import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import InPopover from './demos/in-popover'
import SkinTone from './demos/skin-tone'

export default function EmojiPickerExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="Skin tone">
        <SkinTone />
      </Example>
      <Example title="In popover">
        <InPopover />
      </Example>
    </Examples>
  )
}
