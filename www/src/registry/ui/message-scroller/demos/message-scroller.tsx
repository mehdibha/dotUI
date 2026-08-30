"use client"

import React from "react"

import { Bubble, BubbleContent } from "@/registry/ui/bubble"
import { Button } from "@/registry/ui/button"
import { Message, MessageContent } from "@/registry/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/registry/ui/message-scroller"

const replies = [
  "Autoscroll only follows while you're at the bottom.",
  "Scroll up and it stays put — no rubber-banding back down.",
  "The button brings you back to the newest message.",
  "Each item renders lazily as it nears the viewport.",
]

interface Turn {
  id: number
  role: "user" | "assistant"
  text: string
}

export default function Demo() {
  const [messages, setMessages] = React.useState<Turn[]>([
    { id: 0, role: "user", text: "How does the message scroller behave?" },
    { id: 1, role: "assistant", text: replies[0]! },
  ])

  const addMessage = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length,
        role: prev.length % 2 === 0 ? "user" : "assistant",
        text:
          prev.length % 2 === 0
            ? "Tell me more."
            : replies[Math.floor(prev.length / 2) % replies.length]!,
      },
    ])
  }

  return (
    <div className="flex h-72 w-full max-w-md flex-col gap-3">
      <MessageScrollerProvider autoScroll>
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent className="p-4">
              {messages.map((message) => (
                <MessageScrollerItem key={message.id}>
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
      <Button onPress={addMessage} className="self-center">
        Add message
      </Button>
    </div>
  )
}
