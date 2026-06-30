import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import DefaultDemo from './demos/default'
import HeaderActionsDemo from './demos/header-actions'

export default function MessageExample() {
  return (
    <Examples className="lg:grid-cols-1">
      <Example title="Conversation">
        <DefaultDemo />
      </Example>
      <Example title="Header & actions">
        <HeaderActionsDemo />
      </Example>
    </Examples>
  )
}
