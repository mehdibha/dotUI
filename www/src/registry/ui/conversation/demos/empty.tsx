import { MessagesSquareIcon } from 'lucide-react'

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from '@/registry/ui/conversation'

export default function Demo() {
  return (
    <Conversation className="h-80 w-full max-w-md rounded-(--card-radius) border bg-card [--conversation-fade:var(--color-card)]">
      <ConversationContent>
        <ConversationEmptyState
          icon={<MessagesSquareIcon />}
          title="Start the conversation"
          description="Ask anything — your messages will show up here."
        />
      </ConversationContent>
    </Conversation>
  )
}
