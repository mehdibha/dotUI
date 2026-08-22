"use client"

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

export function ChatDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Conversation className="p-0">
        <Message role="user">
          <MessageContent>What is dotUI?</MessageContent>
        </Message>
        <Message role="assistant">
          <MessageContent>
            A design-system builder — compose it, preview it live, export the
            code you own.
          </MessageContent>
        </Message>
      </Conversation>
      <PromptInput
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <PromptInputTextarea placeholder="Ask anything…" aria-label="Message" />
        <PromptInputToolbar className="justify-end">
          <PromptInputSubmit isIconOnly aria-label="Send message">
            <ArrowUpIcon />
          </PromptInputSubmit>
        </PromptInputToolbar>
      </PromptInput>
    </div>
  )
}
