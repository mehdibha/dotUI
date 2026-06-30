import { Avatar, AvatarFallback } from '@/registry/ui/avatar'
import { Bubble, BubbleContent } from '@/registry/ui/bubble'
import { Message, MessageAvatar, MessageContent } from '@/registry/ui/message'

export default function Demo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Message align="end">
        <MessageContent>
          <Bubble variant="default" align="end">
            <BubbleContent>Can you summarize our last meeting?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="start">
        <MessageAvatar>
          <Avatar size="sm">
            <AvatarFallback>Q</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <Bubble variant="muted" align="start">
            <BubbleContent>
              Sure — you aligned on the Q3 roadmap and handed the launch
              checklist to the design team.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  )
}
