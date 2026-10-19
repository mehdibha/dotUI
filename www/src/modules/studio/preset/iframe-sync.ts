"use client"

import * as React from "react"
import { flushSync } from "react-dom"

import type { Mode } from "@dotui/colors"

import { shareDesignSystem } from "./share-design-system"
import type { DesignSystem } from "./types"

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

/** The row the panel is editing, for the board on screen. */
export interface PreviewFocus {
  axis?: string
  /** Every key the row edits, when it edits several. */
  holds?: string[]
  /** A panel popover is open. */
  popover: boolean
}

/** The board the panel puts over the user's preview, and how it swaps in. */
export interface PreviewBoard {
  /** The board's preview slug; null shows the user's preview again. */
  slug: string | null
  /** A popover's takeover, not a page's drill-in. */
  popover: boolean
  // Dev tweaker exploration: remove once a transition is picked.
  transition: "none" | "slide" | "slide-fade" | "crossfade"
  duration: number
  keepAlive: boolean
}

/** A board's preview slug is this prefix and its panel page or chapter id. */
export const BOARD_SLUG_PREFIX = "board-"

export type ParentToIframeMessage =
  | ({ type: "design-system" } & DesignSystemMessage)
  | { type: "preview-mode"; mode: Mode }
  // Asks for `preview-ready` again: the first one is lost whenever the iframe
  // mounts before the parent hydrates.
  | { type: "preview-ping" }
  // Switches the iframe's own router: no remount, its module cache survives.
  | { type: "preview-navigate"; slug: string }
  | { type: "preview-prefetch"; slug: string }
  | { type: "inspector-mode"; enabled: boolean }
  | ({ type: "preview-warm" } & PreviewAssets)
  | ({ type: "preview-focus" } & PreviewFocus)
  | ({ type: "preview-board" } & PreviewBoard)

type IframeToParentMessage =
  | { type: "preview-ready" }
  | { type: "preview-inspect"; panel: string }
  | { type: "inspector-exit" }

type Message = ParentToIframeMessage | IframeToParentMessage
type MessageOf<T extends Message["type"]> = Extract<Message, { type: T }>

export function isInIframe(): boolean {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
}

export function postToIframe(
  iframe: HTMLIFrameElement | null,
  message: ParentToIframeMessage,
) {
  iframe?.contentWindow?.postMessage(message, window.location.origin)
}

export function postToParent(message: IframeToParentMessage) {
  if (isInIframe()) window.parent.postMessage(message, window.location.origin)
}

/** Calls `handler` with each same-origin message of `type`; returns the
 *  cleanup. */
export function onMessage<T extends Message["type"]>(
  type: T,
  handler: (message: MessageOf<T>) => void,
) {
  const listener = (event: MessageEvent) => {
    if (event.origin === window.location.origin && event.data?.type === type)
      handler(event.data)
  }
  window.addEventListener("message", listener)
  return () => window.removeEventListener("message", listener)
}

/** `onMessage` while mounted, calling the latest `handler`. */
export function useMessage<T extends Message["type"]>(
  type: T,
  handler: (message: MessageOf<T>) => void,
) {
  const latest = React.useRef(handler)
  React.useEffect(() => {
    latest.current = handler
  })
  React.useEffect(
    () => onMessage(type, (message) => latest.current(message)),
    [type],
  )
}

const FRAME_FALLBACK_MS = 100
// An apply over budget waits as long as it took: at most half the thread.
const APPLY_BUDGET_MS = 8
// A render still uncommitted by then (suspended on a chunk, say) stops
// holding newer messages.
const STALL_MS = 200
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
 *  the screen already shows it). */
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
  let flushed = 0
  // Until the apply in flight commits or stalls, newer messages wait in
  // `pending`.
  let applying = false
  let readyAt = 0
  let cancelApply: (() => void) | undefined
  let cancelUnlive: (() => void) | undefined
  let stall: ReturnType<typeof setTimeout> | undefined

  const flush = () => {
    cancelApply = undefined
    const next = pending
    pending = null
    if (!next) return
    const { message, prepared } = next
    const id = ++flushed
    cancelUnlive?.()
    if (message.live) root.setAttribute(LIVE_ATTR, "")
    applying = true
    stall = setTimeout(() => {
      applying = false
      schedule()
    }, STALL_MS)
    const start = performance.now()
    const committed = () => {
      // A newer apply took over.
      if (id !== flushed) return
      clearTimeout(stall)
      // A transition yields while it renders: only its commit holds the thread.
      const from = message.drag ? start : performance.now()
      // Restyles now, so the measure includes it.
      void root.offsetHeight
      const end = performance.now()
      readyAt = end - from > APPLY_BUDGET_MS ? end + (end - from) : 0
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
    if (!pending || cancelApply || applying) return
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

  const stop = onMessage("design-system", (data) => {
    const message = {
      data: data.data,
      live: data.live === true,
      drag: data.drag === true,
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
  })

  return () => {
    stop()
    accepted = Infinity
    cancelApply?.()
    cancelUnlive?.()
    clearTimeout(stall)
    root.removeAttribute(LIVE_ATTR)
  }
}

/** Inside the preview iframe: see `listenDesignSystemMessages`. */
function useDesignSystemMessages<T>(
  prepare: PrepareDesignSystem<T>,
  apply: ApplyDesignSystem<T>,
) {
  const handlers = React.useRef({ prepare, apply })
  React.useEffect(() => {
    handlers.current = { prepare, apply }
  })
  React.useEffect(
    () =>
      listenDesignSystemMessages<T>(
        (message, ready) => handlers.current.prepare(message, ready),
        (data, prepared, committed) =>
          handlers.current.apply(data, prepared, committed),
      ),
    [],
  )
}

export interface AppliedDesignSystem<T> {
  designSystem: DesignSystem
  prepared: T
  committed?: () => void
}

/** `apply` hands `render` the newest design system, reusing what it
 *  shares with the last; `rendered` reports each commit. */
export function createApplier<T>(
  initial: AppliedDesignSystem<T>,
  render: (next: AppliedDesignSystem<T>) => void,
  normalize: (data: DesignSystem) => DesignSystem = (data) => data,
) {
  let target = initial
  let onScreen = initial
  const apply: ApplyDesignSystem<T> = (data, prepared, committed) => {
    const designSystem = shareDesignSystem(target.designSystem, normalize(data))
    // Nothing to render, unless a stalled render is still on its way.
    if (
      target === onScreen &&
      designSystem === target.designSystem &&
      prepared === target.prepared
    )
      return committed()
    target = { designSystem, prepared, committed }
    render(target)
  }
  const rendered = (applied: AppliedDesignSystem<T>) => {
    onScreen = applied
    applied.committed?.()
  }
  return { apply, rendered }
}

/** Inside the preview iframe: the design system to render, following the
 *  studio's messages. */
export function useAppliedDesignSystem<T>(
  prepare: PrepareDesignSystem<T>,
  initial: () => AppliedDesignSystem<T>,
  /** Applied to each message's design system before it's shared. */
  normalize?: (data: DesignSystem) => DesignSystem,
) {
  const [applied, setApplied] = React.useState(initial)
  const [{ apply, rendered }] = React.useState(() =>
    createApplier(applied, setApplied, normalize),
  )
  React.useLayoutEffect(() => rendered(applied), [rendered, applied])
  useDesignSystemMessages(prepare, apply)
  return applied
}

/** Inside the preview iframe: the mode the studio previews, for the root
 *  `ThemeProvider`'s `forcedTheme` (which its own system and storage
 *  listeners can't revert); `undefined` outside the iframe. */
export function usePreviewForcedTheme(): Mode | undefined {
  // Seeded from the URL: waiting for the first message would flash the
  // iframe's stored theme.
  const [mode, setMode] = React.useState<Mode | undefined>(() => {
    if (typeof window === "undefined" || !isInIframe()) return undefined
    const m = new URLSearchParams(window.location.search).get("mode")
    return m === "dark" || m === "light" ? m : undefined
  })
  useMessage("preview-mode", (message) => setMode(message.mode))
  return mode
}

/** Inside the preview iframe: announces the previewed content, and answers
 *  the parent's pings. Call it from the previewed page, never the root
 *  shell: the shell commits while the page's chunk is still suspended. */
export function useAnnouncePreviewReady() {
  const announce = () => postToParent({ type: "preview-ready" })
  useMessage("preview-ping", announce)
  React.useEffect(announce, [])
}

/** Inside the preview iframe: whether this document is embedded in /studio. */
export function useIsEmbeddedPreview(): boolean {
  const [embedded] = React.useState(() => isInIframe())
  return embedded
}
