"use client"

import * as React from "react"
import { flushSync } from "react-dom"

import type { DesignSystem } from "./types"

/* --------------------------------- Types --------------------------------- */

export type PreviewMode = "light" | "dark"

/** Fonts and icon libraries a preview is about to show. */
export interface PreviewAssets {
  fonts?: string[]
  icons?: string[]
}

/** The design system the preview shows. */
export interface DesignSystemMessage {
  data: DesignSystem
  /** A drag or hover preview, not the committed design. */
  live: boolean
  /** A drag's tick, or the commit or drop that ends it: painted at once.
   *  Anything else renders interruptibly. */
  drag: boolean
}

type ParentToIframeMessage =
  | ({ type: "design-system" } & DesignSystemMessage)
  | { type: "preview-mode"; mode: PreviewMode }
  | { type: "preview-ping" }
  | { type: "preview-navigate"; slug: string }
  | { type: "preview-prefetch"; slug: string }
  | { type: "inspector-mode"; enabled: boolean }
  | ({ type: "preview-warm" } & PreviewAssets)

type IframeToParentMessage =
  | { type: "preview-ready" }
  | { type: "preview-inspect"; panel: string }
  | { type: "inspector-exit" }

/* ------------------------------ Send (parent) ------------------------------ */

export function sendToIframe(
  iframe: HTMLIFrameElement | null,
  message: DesignSystemMessage,
) {
  if (!iframe?.contentWindow) return
  iframe.contentWindow.postMessage(
    { type: "design-system", ...message } satisfies ParentToIframeMessage,
    window.location.origin,
  )
}

/** Fonts and icon libraries the preview should start loading now. */
export function sendPreviewWarm(
  iframe: HTMLIFrameElement | null,
  assets: PreviewAssets,
) {
  if (!iframe?.contentWindow) return
  iframe.contentWindow.postMessage(
    { type: "preview-warm", ...assets } satisfies ParentToIframeMessage,
    window.location.origin,
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

/**
 * Ask the iframe's SPA router to show another preview. Navigating inside the
 * document — instead of remounting the iframe — keeps its module cache and
 * design-system state alive, so revisited previews render instantly.
 */
export function sendPreviewNavigate(
  iframe: HTMLIFrameElement | null,
  slug: string,
) {
  if (!iframe?.contentWindow) return
  iframe.contentWindow.postMessage(
    { type: "preview-navigate", slug } satisfies ParentToIframeMessage,
    "*",
  )
}

/** Ask the iframe to warm a preview's chunk (e.g. on picker-item hover). */
export function sendPreviewPrefetch(
  iframe: HTMLIFrameElement | null,
  slug: string,
) {
  if (!iframe?.contentWindow) return
  iframe.contentWindow.postMessage(
    { type: "preview-prefetch", slug } satisfies ParentToIframeMessage,
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

const FRAME_FALLBACK_MS = 100
// An apply over budget waits as long as it took: at most half the thread.
const APPLY_BUDGET_MS = 8
const LIVE_ATTR = "data-studio-live"

/** The next frame, or a timeout where rAF never fires (hidden tabs). */
function onNextFrame(fn: () => void) {
  let frame = 0
  let timer: ReturnType<typeof setTimeout> | undefined
  const cancel = () => {
    cancelAnimationFrame(frame)
    clearTimeout(timer)
  }
  const run = () => {
    cancel()
    fn()
  }
  frame = requestAnimationFrame(run)
  timer = setTimeout(run, FRAME_FALLBACK_MS)
  return cancel
}

/** Hands `ready` what applying `message` needs, now or later. */
export type PrepareDesignSystem<T> = (
  message: DesignSystemMessage,
  ready: (prepared: T) => void,
) => void

/** Renders `data`, then calls `committed` from the commit (at once if
 *  nothing changes). */
export type ApplyDesignSystem<T> = (
  data: DesignSystem,
  prepared: T,
  committed: () => void,
) => void

/** Applies only the newest prepared design system, one at a time, from the
 *  next frame. Returns the cleanup. */
export function listenDesignSystemMessages<T>(
  prepare: PrepareDesignSystem<T>,
  apply: ApplyDesignSystem<T>,
) {
  const root = document.documentElement
  let pending: { message: DesignSystemMessage; prepared: T } | null = null
  let received = 0
  // The newest message prepared: a slower, older one never replaces it.
  let accepted = 0
  // Until the apply in flight commits, newer messages wait in `pending`.
  let applying = false
  let readyAt = 0
  let cancelApply: (() => void) | undefined
  let cancelUnlive: (() => void) | undefined

  const flush = () => {
    cancelApply = undefined
    const next = pending
    pending = null
    if (!next) return
    const { message, prepared } = next
    cancelUnlive?.()
    if (message.live) root.setAttribute(LIVE_ATTR, "")
    applying = true
    const start = performance.now()
    const committed = () => {
      // Restyles now, so the measure includes it.
      void root.offsetHeight
      const end = performance.now()
      readyAt = end - start > APPLY_BUDGET_MS ? end + (end - start) : 0
      applying = false
      // A frame later, so the commit itself doesn't animate.
      if (!message.live && root.hasAttribute(LIVE_ATTR))
        cancelUnlive = onNextFrame(() => root.removeAttribute(LIVE_ATTR))
      schedule()
    }
    const run = () => apply(message.data, prepared, committed)
    // A transition yields to the panel; under a drag's stream it would starve.
    if (message.drag) flushSync(run)
    else React.startTransition(run)
  }

  const schedule = () => {
    if (cancelApply || applying) return
    const wait = readyAt - performance.now()
    if (wait <= 0) {
      cancelApply = onNextFrame(flush)
      return
    }
    const timer = setTimeout(() => {
      cancelApply = onNextFrame(flush)
    }, wait)
    cancelApply = () => clearTimeout(timer)
  }

  const handleMessage = (event: MessageEvent) => {
    if (
      event.origin !== window.location.origin ||
      event.data?.type !== "design-system"
    )
      return
    const message = {
      data: event.data.data,
      live: event.data.live === true,
      drag: event.data.drag === true,
    }
    const id = ++received
    // A commit is final: older previews still on their way aren't worth a paint.
    if (!message.live) {
      accepted = id - 1
      pending = null
    }
    prepare(message, (prepared) => {
      if (id <= accepted) return
      accepted = id
      pending = { message, prepared }
      schedule()
    })
  }

  window.addEventListener("message", handleMessage)
  return () => {
    window.removeEventListener("message", handleMessage)
    accepted = Infinity
    cancelApply?.()
    cancelUnlive?.()
    root.removeAttribute(LIVE_ATTR)
  }
}

/** Inside the preview iframe: see `listenDesignSystemMessages`. */
export function useDesignSystemMessages<T>(
  prepare: PrepareDesignSystem<T>,
  apply: ApplyDesignSystem<T>,
) {
  const handlers = React.useRef({ prepare, apply })

  React.useEffect(() => {
    handlers.current = { prepare, apply }
  }, [prepare, apply])

  React.useEffect(() => {
    if (!isInIframe()) return
    return listenDesignSystemMessages<T>(
      (message, ready) => handlers.current.prepare(message, ready),
      (data, prepared, committed) =>
        handlers.current.apply(data, prepared, committed),
    )
  }, [])
}

/** Inside the preview iframe: start loading what the parent is about to
 *  preview. */
export function usePreviewWarmMessages(
  onWarm: (assets: PreviewAssets) => void,
) {
  const onWarmRef = React.useRef(onWarm)
  React.useEffect(() => {
    onWarmRef.current = onWarm
  }, [onWarm])

  React.useEffect(() => {
    if (!isInIframe()) return
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.data?.type !== "preview-warm"
      )
        return
      const { fonts, icons } = event.data as PreviewAssets
      onWarmRef.current({ fonts, icons })
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])
}

/** Inside the preview iframe: follow the parent's block switches and prefetch hints. */
export function usePreviewNavigationMessages(handlers: {
  onNavigate: (slug: string) => void
  onPrefetch: (slug: string) => void
}) {
  const handlersRef = React.useRef(handlers)

  React.useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  React.useEffect(() => {
    if (!isInIframe()) return

    const handleMessage = (event: MessageEvent) => {
      const { type, slug } = event.data ?? {}
      if (typeof slug !== "string") return
      if (type === "preview-navigate") handlersRef.current.onNavigate(slug)
      if (type === "preview-prefetch") handlersRef.current.onPrefetch(slug)
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
