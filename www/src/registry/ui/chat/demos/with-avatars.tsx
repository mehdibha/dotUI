"use client"

import {
  Conversation,
  Message,
  MessageAvatar,
  MessageContent,
} from "@/registry/ui/chat"

export default function Demo() {
  return (
    <Conversation className="max-h-72 w-full max-w-md">
      <Message role="user">
        <MessageAvatar name="Mehdi" />
        <MessageContent>Can you summarize the release notes?</MessageContent>
      </Message>
      <Message role="assistant">
        <MessageAvatar name="AI" />
        <MessageContent>
          Three things shipped: a faster registry build, per-component radius
          roles, and dark-mode fixes for charts.
        </MessageContent>
      </Message>
    </Conversation>
  )
}
