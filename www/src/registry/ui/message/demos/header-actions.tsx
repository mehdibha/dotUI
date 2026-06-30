import { CopyIcon, RefreshCcwIcon, ThumbsUpIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/registry/ui/avatar'
import { Bubble, BubbleContent } from '@/registry/ui/bubble'
import { Button } from '@/registry/ui/button'
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from '@/registry/ui/message'

export default function Demo() {
  return (
    <Message align="start" className="w-full max-w-md">
      <MessageAvatar>
        <Avatar size="sm">
          <AvatarFallback>Q</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <MessageHeader>
          <span className="font-medium text-fg">Quartz</span>
          <span>2:34 PM</span>
        </MessageHeader>
        <Bubble variant="muted" align="start">
          <BubbleContent>
            Here's a draft of the announcement. Want me to make it shorter?
          </BubbleContent>
        </Bubble>
        <MessageFooter className="flex gap-0.5 opacity-0 transition-opacity group-hover/message:opacity-100">
          <Button variant="quiet" size="xs" isIconOnly aria-label="Copy">
            <CopyIcon />
          </Button>
          <Button variant="quiet" size="xs" isIconOnly aria-label="Regenerate">
            <RefreshCcwIcon />
          </Button>
          <Button
            variant="quiet"
            size="xs"
            isIconOnly
            aria-label="Good response"
          >
            <ThumbsUpIcon />
          </Button>
        </MessageFooter>
      </MessageContent>
    </Message>
  )
}
