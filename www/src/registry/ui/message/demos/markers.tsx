import { Message, MessageBubble, MessageMarker } from '@/registry/ui/message'

export default function Demo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <MessageMarker variant="separator">Today</MessageMarker>
      <Message from="user">
        <MessageBubble>What's the weather like in Paris?</MessageBubble>
      </Message>
      <MessageMarker variant="status">Searching the web…</MessageMarker>
      <MessageMarker variant="note">Switched to Opus 4.8</MessageMarker>
    </div>
  )
}
