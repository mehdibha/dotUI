"use client"

import React from "react"

import { ArrowUpIcon } from "@/registry/__generated__/icons"
import {
  Conversation,
  Message,
  MessageContent,
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/registry/ui/chat"

const initialMessages = [
  { id: 1, role: "user" as const, text: "What is dotUI?" },
  {
    id: 2,
    role: "assistant" as const,
    text: "A design-system builder: compose colors, typography and per-component styles, preview them live, then export the code you own.",
  },
]

export default function Demo() {
  const [messages, setMessages] = React.useState(initialMessages)
  const [draft, setDraft] = React.useState("")

  return (
    <div className="flex h-80 w-full max-w-md flex-col gap-3">
      <Conversation className="rounded-(--chat-input-radius) border border-border-muted">
        {messages.map((message) => (
          <Message key={message.id} role={message.role}>
            <MessageContent>{message.text}</MessageContent>
          </Message>
        ))}
      </Conversation>
      <PromptInput
        onSubmit={(e) => {
          e.preventDefault()
          if (!draft.trim()) return
          setMessages((current) => [
            ...current,
            { id: current.length + 1, role: "user" as const, text: draft },
          ])
          setDraft("")
        }}
      >
        <PromptInputTextarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask anything…"
          aria-label="Message"
        />
        <PromptInputToolbar className="justify-end">
          <PromptInputSubmit isIconOnly aria-label="Send message">
            <ArrowUpIcon />
          </PromptInputSubmit>
        </PromptInputToolbar>
      </PromptInput>
    </div>
  )
}
