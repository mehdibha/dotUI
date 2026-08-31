"use client"

import { Bubble, BubbleContent } from "@/registry/ui/bubble"
import { Message, MessageContent } from "@/registry/ui/message"

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Message>
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>How do I center a div?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>
              Grid on the parent, place-items center.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  )
}
