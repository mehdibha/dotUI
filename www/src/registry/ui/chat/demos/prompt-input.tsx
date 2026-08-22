"use client"

import { ArrowUpIcon } from "@/registry/__generated__/icons"
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/registry/ui/chat"

export default function Demo() {
  return (
    <PromptInput
      className="w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault()
      }}
    >
      <PromptInputTextarea placeholder="Ask anything…" aria-label="Message" />
      <PromptInputToolbar>
        <PromptInputSubmit isIconOnly aria-label="Send message">
          <ArrowUpIcon />
        </PromptInputSubmit>
      </PromptInputToolbar>
    </PromptInput>
  )
}
