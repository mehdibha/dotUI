import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import Basic from './demos/basic'
import Controlled from './demos/controlled'
import Disabled from './demos/disabled'
import Nested from './demos/nested'
import WithIcons from './demos/with-icons'
import WithSubmenu from './demos/with-submenu'

export default function ContextMenuExamples() {
  return (
    <Examples>
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="With icons">
        <WithIcons />
      </Example>
      <Example title="With submenu">
        <WithSubmenu />
      </Example>
      <Example title="Controlled">
        <Controlled />
      </Example>
      <Example title="Nested">
        <Nested />
      </Example>
      <Example title="Disabled">
        <Disabled />
      </Example>
    </Examples>
  )
}
