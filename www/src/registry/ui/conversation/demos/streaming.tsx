import { Conversation, ConversationContent } from '@/registry/ui/conversation'
import {
  Message,
  MessageAvatar,
  MessageBubble,
  MessageMarker,
} from '@/registry/ui/message'

export default function Demo() {
  return (
    <Conversation className="h-80 w-full max-w-md rounded-(--card-radius) border bg-card [--conversation-fade:var(--color-card)]">
      <ConversationContent>
        <Message from="user">
          <MessageBubble>Compare our last two quarters.</MessageBubble>
        </Message>
        <Message from="assistant">
          <MessageAvatar name="dotUI" />
          <MessageBubble>
            Revenue grew 18% quarter over quarter, driven mostly by new
            self-serve signups…
          </MessageBubble>
        </Message>
        <MessageMarker variant="status">Analyzing the data…</MessageMarker>
      </ConversationContent>
    </Conversation>
  )
}
