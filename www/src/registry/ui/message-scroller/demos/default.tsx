import { Avatar, AvatarFallback } from '@/registry/ui/avatar'
import { Bubble, BubbleContent } from '@/registry/ui/bubble'
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

const TURNS = [
  {
    id: '1',
    role: 'user',
    text: "I'm planning a launch. Where should I start?",
  },
  {
    id: '2',
    role: 'assistant',
    text: 'Start with the audience and the one message you want them to remember.',
  },
  { id: '3', role: 'user', text: 'Got it. What about timing?' },
  {
    id: '4',
    role: 'assistant',
    text: 'Ship mid-week, in the morning for your biggest timezone. Avoid Fridays.',
  },
  { id: '5', role: 'user', text: 'And the channels?' },
  {
    id: '6',
    role: 'assistant',
    text: 'Lead with your own — email and your site. Then amplify on social with a short demo.',
  },
] as const

export default function Demo() {
  return (
    <MessageScrollerProvider>
      <MessageScroller className="h-80 w-full max-w-md rounded-(--card-radius) border bg-card [--scroller-fade:var(--color-card)]">
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
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}
