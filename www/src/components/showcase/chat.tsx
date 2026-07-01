import React from 'react'
import { ArrowUpIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Avatar, AvatarFallback } from '@/registry/ui/avatar'
import { Bubble, BubbleContent } from '@/registry/ui/bubble'
import { Button } from '@/registry/ui/button'
import { TextArea } from '@/registry/ui/input'
import { Marker, MarkerContent } from '@/registry/ui/marker'
import { Message, MessageAvatar, MessageContent } from '@/registry/ui/message'
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/registry/ui/message-scroller'
import { TextField } from '@/registry/ui/text-field'

type Turn = { id: string; role: 'user' | 'assistant'; text: string }

const TURNS: Turn[] = [
  { id: '1', role: 'user', text: 'Help me name my new design system.' },
  {
    id: '2',
    role: 'assistant',
    text: 'Tell me the feeling you want — calm and editorial, or bold and technical? The name should set that tone before anyone sees a single screen.',
  },
  { id: '3', role: 'user', text: 'Calm, but confident.' },
  {
    id: '4',
    role: 'assistant',
    text: 'Then keep it short and grounded: Atlas, Slate, Range, Quartz. Each reads steady, and none box you into a single product.',
  },
  {
    id: '5',
    role: 'user',
    text: 'I like Quartz. Can it scale to a dark theme?',
  },
  {
    id: '6',
    role: 'assistant',
    text: 'Easily — Quartz works light or dark. Pick your accent and every token, including these bubbles, re-themes around it.',
  },
]

// A self-contained chat card composed from the registry's chat primitives: a
// MessageScroller transcript of Messages + Bubbles that sticks to the latest
// reply, over a slim composer. Everything goes through design-system tokens, so
// it re-themes live with the rest of the grid in /create.
export function Chat({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex h-[26rem] flex-col overflow-hidden rounded-(--card-radius) border bg-card shadow-sm',
        className,
      )}
      {...props}
    >
      <MessageScrollerProvider>
        <MessageScroller className="flex-1 [--scroller-fade:var(--color-card)]">
          <MessageScrollerViewport>
            <MessageScrollerContent>
              <Marker variant="separator">
                <MarkerContent>Today</MarkerContent>
              </Marker>
              {TURNS.map((turn) => (
                <MessageScrollerItem
                  key={turn.id}
                  messageId={turn.id}
                  scrollAnchor={turn.role === 'user'}
                >
                  <Message align={turn.role === 'user' ? 'end' : 'start'}>
                    {turn.role === 'assistant' ? (
                      <MessageAvatar>
                        <Avatar size="sm">
                          <AvatarFallback>Q</AvatarFallback>
                        </Avatar>
                      </MessageAvatar>
                    ) : null}
                    <MessageContent>
                      <Bubble
                        variant={turn.role === 'user' ? 'default' : 'muted'}
                        align={turn.role === 'user' ? 'end' : 'start'}
                      >
                        <BubbleContent>{turn.text}</BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                </MessageScrollerItem>
              ))}
              <Marker role="status">
                <MarkerContent shimmer>Quartz is typing…</MarkerContent>
              </Marker>
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
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
