import {
  Message,
  MessageAttachment,
  MessageBody,
  MessageBubble,
} from '@/registry/ui/message'

export default function Demo() {
  return (
    <Message from="user" className="w-full max-w-md">
      <MessageBody>
        <MessageAttachment name="roadmap.pdf" meta="2.4 MB · PDF" />
        <MessageBubble>Can you review this before the call?</MessageBubble>
      </MessageBody>
    </Message>
  )
}
