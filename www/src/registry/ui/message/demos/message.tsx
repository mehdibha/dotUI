"use client"

import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Bubble, BubbleContent, BubbleGroup } from "@/registry/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/registry/ui/message"

export default function Demo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Message>
        <MessageAvatar>
          <Avatar size="sm">
            <AvatarFallback>LN</AvatarFallback>
          </Avatar>
        </MessageAvatar>
        <MessageContent>
          <MessageHeader>Lena · 2:14 PM</MessageHeader>
          <BubbleGroup>
            <Bubble variant="muted">
              <BubbleContent>Did you see the new studio panel?</BubbleContent>
            </Bubble>
            <Bubble variant="muted">
              <BubbleContent>The drill-in feels really smooth.</BubbleContent>
            </Bubble>
          </BubbleGroup>
        </MessageContent>
      </Message>
      <Message align="end">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent>Shipping it this week 🚀</BubbleContent>
          </Bubble>
          <MessageFooter>Seen · 2:16 PM</MessageFooter>
        </MessageContent>
      </Message>
    </div>
  )
}
