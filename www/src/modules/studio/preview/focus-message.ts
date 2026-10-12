"use client"

// The panel's focus, posted to the preview iframe; kept off iframe-sync, which every page loads.

import * as React from "react"

import { isInIframe } from "@/modules/studio/preset/iframe-sync"

/** The row the panel is editing, for the board on screen. */
export interface PreviewFocusMessage {
  axis?: string
  /** Every key the row edits, when it edits several. */
  holds?: string[]
  /** A panel popover is open. */
  popover: boolean
}

export function sendPreviewFocus(
  iframe: HTMLIFrameElement | null,
  focus: PreviewFocusMessage,
) {
  iframe?.contentWindow?.postMessage({ type: "preview-focus", ...focus }, "*")
}

/** Inside the preview iframe: the panel's latest focus. */
export function usePreviewFocusMessages(): PreviewFocusMessage {
  const [focus, setFocus] = React.useState<PreviewFocusMessage>({
    popover: false,
  })
  React.useEffect(() => {
    if (!isInIframe()) return
    const handleMessage = (event: MessageEvent) => {
      const data = event.data
      if (data?.type !== "preview-focus") return
      const next: PreviewFocusMessage = {
        axis: data.axis,
        holds: data.holds,
        popover: !!data.popover,
      }
      setFocus((prev) =>
        JSON.stringify(prev) === JSON.stringify(next) ? prev : next,
      )
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])
  return focus
}
