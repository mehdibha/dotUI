import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import DefaultDemo from './demos/default'
import EmptyDemo from './demos/empty'
import StreamingDemo from './demos/streaming'

export default function ConversationExample() {
  return (
    <Examples className="lg:grid-cols-1">
      <Example title="Conversation">
        <DefaultDemo />
      </Example>
      <Example title="Streaming">
        <StreamingDemo />
      </Example>
      <Example title="Empty state">
        <EmptyDemo />
      </Example>
    </Examples>
  )
}
