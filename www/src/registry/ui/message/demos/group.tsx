"use client"

import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Bubble, BubbleContent, BubbleGroup } from "@/registry/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageGroup,
} from "@/registry/ui/message"

export default function Demo() {
  return (
    <MessageGroup className="w-full max-w-sm">
      <Message>
        <MessageAvatar>
          <Avatar size="sm">
            <AvatarFallback>SM</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <BubbleGroup>
            <Bubble variant="muted">
              <BubbleContent>Three messages,</BubbleContent>
            </Bubble>
            <Bubble variant="muted">
              <BubbleContent>one sender,</BubbleContent>
            </Bubble>
            <Bubble variant="muted">
              <BubbleContent>one tight stack.</BubbleContent>
            </Bubble>
          </BubbleGroup>
        </MessageContent>
      </Message>
    </MessageGroup>
  )
}
