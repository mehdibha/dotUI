"use client"

import { Message, MessageContent } from "@/registry/ui/chat"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/registry/ui/message-scroller"

const conversation = [
  { role: "user", text: "How do I center a div?" },
  {
    role: "assistant",
    text: "Give the parent a grid display and center its place-items.",
  },
  { role: "user", text: "And in a flex row?" },
  {
    role: "assistant",
    text: "Center justify-content and align-items — same job, two axes.",
  },
] as const

export function MessageScrollerDemo() {
  return (
    <MessageScrollerProvider defaultScrollPosition="start">
      <MessageScroller className="h-48 w-full max-w-sm">
        <MessageScrollerViewport>
          <MessageScrollerContent className="p-1">
            {conversation.map((message, index) => (
              <MessageScrollerItem key={index}>
                <Message role={message.role}>
                  <MessageContent>{message.text}</MessageContent>
                </Message>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}
