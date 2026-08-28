"use client"

import { Conversation, Message, MessageContent } from "@/registry/ui/chat"

export default function Demo() {
  return (
    <Conversation className="max-h-72 w-full max-w-md">
      <Message role="user">
        <MessageContent>How do I center a div?</MessageContent>
      </Message>
      <Message role="assistant">
        <MessageContent>
          Give the parent a grid display and center its place-items. Two lines,
          no margins to guess at.
        </MessageContent>
      </Message>
      <Message role="user">
        <MessageContent>
          And if the parent is already a flex row?
        </MessageContent>
      </Message>
      <Message role="assistant">
        <MessageContent>
          Then centering justify-content and align-items does the same job along
          the two axes.
        </MessageContent>
      </Message>
    </Conversation>
  )
}
