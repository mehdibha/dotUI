"use client"

import { Bubble, BubbleContent } from "@/registry/ui/bubble"
import { Message, MessageContent } from "@/registry/ui/message"
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
    text: "Give the parent a grid display and center its place-items. Two lines, no margins to guess at.",
  },
  { role: "user", text: "And if the parent is already a flex row?" },
  {
    role: "assistant",
    text: "Then centering justify-content and align-items does the same job along the two axes.",
  },
  { role: "user", text: "What about absolutely positioned children?" },
  {
    role: "assistant",
    text: "Inset all four sides to zero and give the child auto margins — it centers in both dimensions.",
  },
] as const

export default function Demo() {
  return (
    <MessageScrollerProvider>
      <MessageScroller className="h-64 w-full max-w-md">
        <MessageScrollerViewport>
          <MessageScrollerContent className="p-4">
            {conversation.map((message, index) => (
              <MessageScrollerItem key={index}>
                <Message align={message.role === "user" ? "end" : "start"}>
                  <MessageContent>
                    {message.role === "user" ? (
                      <Bubble align="end" variant="muted">
                        <BubbleContent>{message.text}</BubbleContent>
                      </Bubble>
                    ) : (
                      message.text
                    )}
                  </MessageContent>
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
