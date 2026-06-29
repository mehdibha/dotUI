import { Message, MessageAvatar, MessageBubble } from '@/registry/ui/message'

export default function Demo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Message from="user">
        <MessageBubble>Can you summarize our last meeting?</MessageBubble>
      </Message>
      <Message from="assistant">
        <MessageAvatar name="dotUI" />
        <MessageBubble>
          Sure — you aligned on the Q3 roadmap and handed the launch checklist
          to the design team.
        </MessageBubble>
      </Message>
    </div>
  )
}
