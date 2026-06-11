import { Example } from '@/modules/create/preview/example'
import { Examples } from '@/modules/create/preview/examples'

import ChatSettings from './demos/chat-settings'
import NoCloseButton from './demos/no-close-button'
import ScrollableContent from './demos/scrollable-content'
import WithForm from './demos/with-form'

export default function ModalExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="with form">
        <WithForm />
      </Example>
      <Example title="scrollable content">
        <ScrollableContent />
      </Example>
      <Example title="no close button">
        <NoCloseButton />
      </Example>
      <Example title="chat settings">
        <ChatSettings />
      </Example>
    </Examples>
  )
}
