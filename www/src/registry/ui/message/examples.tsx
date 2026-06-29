import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import AttachmentDemo from './demos/attachment'
import DefaultDemo from './demos/default'
import MarkersDemo from './demos/markers'
import WithActionsDemo from './demos/with-actions'

export default function MessageExample() {
  return (
    <Examples className="lg:grid-cols-1">
      <Example title="Conversation">
        <DefaultDemo />
      </Example>
      <Example title="Header & actions">
        <WithActionsDemo />
      </Example>
      <Example title="Markers">
        <MarkersDemo />
      </Example>
      <Example title="Attachment">
        <AttachmentDemo />
      </Example>
    </Examples>
  )
}
