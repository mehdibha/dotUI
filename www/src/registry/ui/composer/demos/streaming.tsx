"use client"

import * as React from "react"

import {
  Composer,
  ComposerSubmit,
  ComposerTextArea,
  ComposerToolbar,
} from "@/registry/ui/composer"

export default function Demo() {
  const [status, setStatus] = React.useState<"idle" | "streaming">("idle")
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  return (
    <Composer
      className="max-w-md"
      status={status}
      onSubmit={() => {
        setStatus("streaming")
        timer.current = setTimeout(() => setStatus("idle"), 3000)
      }}
      onStop={() => {
        clearTimeout(timer.current)
        setStatus("idle")
      }}
    >
      <ComposerTextArea aria-label="Message" placeholder="Send, then stop" />
      <ComposerToolbar>
        <ComposerSubmit />
      </ComposerToolbar>
    </Composer>
  )
}
