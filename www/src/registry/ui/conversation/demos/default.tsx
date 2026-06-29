import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/registry/ui/conversation'
import {
  Message,
  MessageAvatar,
  MessageBubble,
  MessageMarker,
} from '@/registry/ui/message'

const TURNS = [
  { from: 'user', text: "I'm planning a launch. Where should I start?" },
  {
    from: 'assistant',
    text: 'Start with the audience and the one message you want them to remember. Everything else follows from that.',
  },
  { from: 'user', text: 'Got it. What about timing?' },
  {
    from: 'assistant',
    text: 'Ship the announcement mid-week, in the morning for your biggest timezone. Avoid Fridays.',
  },
  { from: 'user', text: 'And the channels?' },
  {
    from: 'assistant',
    text: 'Lead with your own — email and your site. Then amplify on social with a short demo video.',
  },
] as const

export default function Demo() {
  return (
    <Conversation className="h-80 w-full max-w-md rounded-(--card-radius) border bg-card [--conversation-fade:var(--color-card)]">
      <ConversationContent>
        <MessageMarker variant="separator">Today</MessageMarker>
        {TURNS.map((turn, i) => (
          <Message key={i} from={turn.from}>
            {turn.from === 'assistant' ? <MessageAvatar name="dotUI" /> : null}
            <MessageBubble>{turn.text}</MessageBubble>
          </Message>
        ))}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  )
}
