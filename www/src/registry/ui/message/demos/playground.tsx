"use client"

import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Bubble, BubbleContent } from "@/registry/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
  type MessageProps,
} from "@/registry/ui/message"

export default function Demo({
  align = "start",
  avatar = true,
  header = true,
  footer = true,
}: {
  align?: MessageProps["align"]
  avatar?: boolean
  header?: boolean
  footer?: boolean
} = {}) {
  return (
    <Message align={align}>
      {avatar && (
        <MessageAvatar>
          <Avatar size="sm">
            <AvatarFallback>LN</AvatarFallback>
          </Avatar>
        </MessageAvatar>
      )}
      <MessageContent>
        {header && <MessageHeader>Lena · 2:14 PM</MessageHeader>}
        <Bubble variant="muted">
          <BubbleContent>Did you see the new studio panel?</BubbleContent>
        </Bubble>
        {footer && <MessageFooter>Seen · 2:16 PM</MessageFooter>}
      </MessageContent>
    </Message>
  )
}
