import { CopyIcon, RefreshCcwIcon, ThumbsUpIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import {
  Message,
  MessageActions,
  MessageAvatar,
  MessageBody,
  MessageBubble,
  MessageHeader,
} from '@/registry/ui/message'

export default function Demo() {
  return (
    <Message from="assistant" className="w-full max-w-md">
      <MessageAvatar name="dotUI" />
      <MessageBody>
        <MessageHeader>
          <span className="font-medium text-fg">dotUI</span>
          <span>2:34 PM</span>
        </MessageHeader>
        <MessageBubble>
          Here's a draft of the announcement. Want me to make it shorter?
        </MessageBubble>
        <MessageActions>
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
        </MessageActions>
      </MessageBody>
    </Message>
  )
}
