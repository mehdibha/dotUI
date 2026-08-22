"use client"

import {
  ArrowUpIcon,
  GlobeIcon,
  PaperclipIcon,
} from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
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
        <div className="flex items-center gap-1">
          <Button variant="quiet" isIconOnly aria-label="Attach a file">
            <PaperclipIcon />
          </Button>
          <Button variant="quiet" isIconOnly aria-label="Search the web">
            <GlobeIcon />
          </Button>
        </div>
        <PromptInputSubmit isIconOnly aria-label="Send message">
          <ArrowUpIcon />
        </PromptInputSubmit>
      </PromptInputToolbar>
    </PromptInput>
  )
}
