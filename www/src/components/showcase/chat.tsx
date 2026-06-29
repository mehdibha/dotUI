import React from 'react'
import { ArrowUpIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/registry/ui/conversation'
import { TextArea } from '@/registry/ui/input'
import {
  Message,
  MessageAvatar,
  MessageBubble,
  MessageMarker,
} from '@/registry/ui/message'
import { TextField } from '@/registry/ui/text-field'

type Turn = { from: 'user' | 'assistant'; text: string }

const TURNS: Turn[] = [
  { from: 'user', text: 'Help me name my new design system.' },
  {
    from: 'assistant',
    text: 'Tell me the feeling you want — calm and editorial, or bold and technical? The name should set that tone before anyone sees a single screen.',
  },
  { from: 'user', text: 'Calm, but confident.' },
  {
    from: 'assistant',
    text: 'Then keep it short and grounded: Atlas, Slate, Range, Quartz. Each reads steady, and none box you into a single product.',
  },
  { from: 'user', text: 'I like Quartz. Can it scale to a dark theme?' },
  {
    from: 'assistant',
    text: 'Easily — Quartz works light or dark. Pick your accent and every token, including these bubbles, re-themes around it.',
  },
]

// A self-contained chat card: a live Conversation of Messages that sticks to the
// latest reply, over a slim composer. Like the rest of the grid it goes entirely
// through design-system tokens (--card-radius, bg-card, the message + bubble
// surfaces), so it re-themes live with every change in /create.
export function Chat({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex h-[26rem] flex-col overflow-hidden rounded-(--card-radius) border bg-card shadow-sm',
        className,
      )}
      {...props}
    >
      <Conversation className="flex-1 [--conversation-fade:var(--color-card)]">
        <ConversationContent>
          <MessageMarker variant="separator">Today</MessageMarker>
          {TURNS.map((turn, i) => (
            <Message key={i} from={turn.from}>
              {turn.from === 'assistant' ? (
                <MessageAvatar name="Quartz" />
              ) : null}
              <MessageBubble>{turn.text}</MessageBubble>
            </Message>
          ))}
          <MessageMarker variant="status">Quartz is typing…</MessageMarker>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="flex items-end gap-2 border-t p-2">
        <TextField aria-label="Message" className="flex-1">
          <TextArea
            placeholder="Message Quartz…"
            rows={1}
            className="max-h-24 min-h-9 resize-none border-0 bg-transparent shadow-none focus:border-0 focus:ring-0"
          />
        </TextField>
        <Button isIconOnly aria-label="Send message" className="shrink-0">
          <ArrowUpIcon />
        </Button>
      </div>
    </div>
  )
}
