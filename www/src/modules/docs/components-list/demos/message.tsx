"use client"

import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Bubble, BubbleContent } from "@/registry/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from "@/registry/ui/message"

export function MessageDemo() {
  return (
    <div className="flex w-full max-w-[13.5rem] flex-col gap-3">
      <Message>
        <MessageAvatar>
          <Avatar size="sm">
            <AvatarFallback>LN</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Lena · 2:14 PM</MessageHeader>
          <Bubble variant="muted">
            <BubbleContent>Have you tried the studio?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>Shipping this week 🚀</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </div>
  )
}
