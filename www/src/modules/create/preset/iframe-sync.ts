"use client"

import * as React from "react"

import type { DesignSystem } from "./types"

/* --------------------------------- Types --------------------------------- */

export type PreviewMode = "light" | "dark"

type ParentToIframeMessage =
  | { type: "design-system"; data: DesignSystem }
  | { type: "preview-mode"; mode: PreviewMode }
  | { type: "preview-ping" }
  | { type: "inspector-mode"; enabled: boolean }

type IframeToParentMessage =
  | { type: "preview-ready" }
  | { type: "preview-inspect"; panel: string }
  | { type: "inspector-exit" }

/* ------------------------------ Send (parent) ------------------------------ */

export function sendToIframe(
  iframe: HTMLIFrameElement | null,
  data: DesignSystem,
) {
  if (!iframe?.contentWindow) return
  iframe.contentWindow.postMessage(
    { type: "design-system", data } satisfies ParentToIframeMessage,
    "*",
  )
}

export function sendPreviewMode(
  iframe: HTMLIFrameElement | null,
  mode: PreviewMode,
) {
  if (!iframe?.contentWindow) return
  iframe.contentWindow.postMessage(
    { type: "preview-mode", mode } satisfies ParentToIframeMessage,
    "*",
  )
}

export function sendInspectorMode(
  iframe: HTMLIFrameElement | null,
  enabled: boolean,
) {
  if (!iframe?.contentWindow) return
  iframe.contentWindow.postMessage(
    { type: "inspector-mode", enabled } satisfies ParentToIframeMessage,
    "*",
  )
}

/**
 * Ask the iframe to re-announce readiness. The iframe's unprompted `preview-ready`
 * is fire-and-forget: it often mounts before the server-rendered parent hydrates,
 * so that message lands with no listener attached and is lost forever. Polling this
 * until it answers makes readiness robust to either side winning the race.
 */
export function pingIframe(iframe: HTMLIFrameElement | null) {
  if (!iframe?.contentWindow) return
  iframe.contentWindow.postMessage(
    { type: "preview-ping" } satisfies ParentToIframeMessage,
    "*",
  )
}

/* ----------------------------- Listen (iframe) ----------------------------- */

function isInIframe(): boolean {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

export function useIframeMessageListener(
  onMessage: (data: DesignSystem) => void,
) {
  const onMessageRef = React.useRef(onMessage)

  React.useEffect(() => {
    onMessageRef.current = onMessage
  }, [onMessage])

  React.useEffect(() => {
    if (!isInIframe()) return

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "design-system") {
        onMessageRef.current(event.data.data)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])
}

/**
 * Inside the preview iframe: the display mode (light / dark) the customizer has chosen, or
 * `undefined` when not in an iframe (the main app owns its own theme). Returned so the root
 * `ThemeProvider` can take it as `forcedTheme` — which deterministically wins over the iframe's
 * system/storage theme listeners (they no-op while forced), instead of toggling `.dark`
 * out-of-band where the provider would revert it on the next OS-pref / storage event.
 */
export function usePreviewForcedTheme(): PreviewMode | undefined {
  // Seeded from the iframe URL so the first paint already uses the previewed
  // mode — waiting for the parent's post-load `preview-mode` message would
  // flash the iframe's own stored theme first whenever the two differ.
  const [mode, setMode] = React.useState<PreviewMode | undefined>(() => {
    if (typeof window === "undefined" || !isInIframe()) return undefined
    const m = new URLSearchParams(window.location.search).get("mode")
    return m === "dark" || m === "light" ? m : undefined
  })

  React.useEffect(() => {
    if (!isInIframe()) return

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "preview-mode") {
        setMode(event.data.mode === "dark" ? "dark" : "light")
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return mode
}

/**
 * Inside the preview iframe: announce that the previewed content has rendered,
 * and keep answering the parent's pings.
 *
 * Call this from the previewed page itself, never from the root shell: the shell
 * commits while the example chunk is still suspended, so announcing there clears
 * the parent's skeleton over a frame that hasn't painted. Effects don't run on a
 * render that suspends, so mounting this inside the page ties the signal to the
 * content actually committing.
 *
 * Answering pings matters as much as the first announcement — the parent polls
 * because that one message is lost whenever the iframe mounts before the
 * server-rendered parent hydrates.
 */
export function useAnnouncePreviewReady() {
  React.useEffect(() => {
    if (!isInIframe()) return

    const announce = () =>
      window.parent.postMessage(
        { type: "preview-ready" } satisfies IframeToParentMessage,
        "*",
      )

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "preview-ping") announce()
    }

    window.addEventListener("message", handleMessage)
    announce()
    return () => window.removeEventListener("message", handleMessage)
  }, [])
}

/** Inside the preview iframe: whether this document is embedded in /create. */
export function useIsEmbeddedPreview(): boolean {
  const [embedded] = React.useState(() => isInIframe())
  return embedded
}

/**
 * Inside the preview iframe: ask the embedding panel to open the controls for
 * one of its chapters — the preview's half of the two-way coupling.
 */
export function sendInspect(panel: string) {
  if (!isInIframe()) return
  window.parent.postMessage(
    { type: "preview-inspect", panel } satisfies IframeToParentMessage,
    "*",
  )
}

/** Inside the preview iframe: follow the parent's inspector on/off toggle. */
export function useInspectorModeMessages(onChange: (enabled: boolean) => void) {
  const onChangeRef = React.useRef(onChange)
  React.useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  React.useEffect(() => {
    if (!isInIframe()) return
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "inspector-mode") {
        onChangeRef.current(event.data.enabled === true)
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])
}

/**
 * Inside the preview iframe: tell the parent the user left inspect mode from
 * within the preview (Escape), so the toolbar toggle stays in sync.
 */
export function sendInspectorExit() {
  if (!isInIframe()) return
  window.parent.postMessage(
    { type: "inspector-exit" } satisfies IframeToParentMessage,
    "*",
  )
}

/** In the /create parent: react to the preview leaving inspect mode. */
export function useInspectorExitMessages(onExit: () => void) {
  const onExitRef = React.useRef(onExit)
  React.useEffect(() => {
    onExitRef.current = onExit
  }, [onExit])

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "inspector-exit") onExitRef.current()
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])
}

/** In the /create parent: react to the preview's inspect requests. */
export function useInspectMessages(onInspect: (panel: string) => void) {
  const onInspectRef = React.useRef(onInspect)
  React.useEffect(() => {
    onInspectRef.current = onInspect
  }, [onInspect])

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === "preview-inspect" &&
        typeof event.data.panel === "string"
      ) {
        onInspectRef.current(event.data.panel)
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])
}
