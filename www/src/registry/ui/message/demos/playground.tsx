import { Message, MessageBubble } from '@/registry/ui/message'

export default function Demo({
  from = 'assistant',
  children = 'Hey! How can I help you today?',
}: {
  from?: 'user' | 'assistant'
  children?: string
} = {}) {
  return (
    <Message from={from}>
      <MessageBubble>{children}</MessageBubble>
    </Message>
  )
}
