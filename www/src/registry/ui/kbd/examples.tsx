import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import ArrowKeys from './demos/arrow-keys'
import Basic from './demos/basic'
import Group from './demos/group'
import InInputGroup from './demos/in-input-group'
import InTooltip from './demos/in-tooltip'
import ModifierKeys from './demos/modifier-keys'
import WithIcons from './demos/with-icons'
import WithIconsAndText from './demos/with-icons-and-text'
import WithSamp from './demos/with-samp'

export default function KbdExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="Modifier Keys">
        <ModifierKeys />
      </Example>
      <Example title="KbdGroup">
        <Group />
      </Example>
      <Example title="Arrow Keys">
        <ArrowKeys />
      </Example>
      <Example title="With Icons">
        <WithIcons />
      </Example>
      <Example title="With Icons and Text">
        <WithIconsAndText />
      </Example>
      <Example title="InputGroup">
        <InInputGroup />
      </Example>
      <Example title="Tooltip">
        <InTooltip />
      </Example>
      <Example title="With samp">
        <WithSamp />
      </Example>
    </Examples>
  )
}
