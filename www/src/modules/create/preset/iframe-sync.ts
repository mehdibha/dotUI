'use client'

import * as React from 'react'

import type { DesignSystem } from './types'

/* --------------------------------- Types --------------------------------- */

export type PreviewMode = 'light' | 'dark'

type ParentToIframeMessage =
  | { type: 'design-system'; data: DesignSystem }
  | { type: 'preview-mode'; mode: PreviewMode }

type IframeToParentMessage =
  | { type: 'preview-ready' }
  | { type: 'preview-scroll'; progress: number }
  | { type: 'preview-inspect'; panel: string }

/* ------------------------------ Send (parent) ------------------------------ */

export function sendToIframe(
  iframe: HTMLIFrameElement | null,
  data: DesignSystem,
) {
  if (!iframe?.contentWindow) return
  iframe.contentWindow.postMessage(
    { type: 'design-system', data } satisfies ParentToIframeMessage,
    '*',
  )
}

export function sendPreviewMode(
  iframe: HTMLIFrameElement | null,
  mode: PreviewMode,
) {
  if (!iframe?.contentWindow) return
  iframe.contentWindow.postMessage(
    { type: 'preview-mode', mode } satisfies ParentToIframeMessage,
    '*',
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
      if (event.data?.type === 'design-system') {
        onMessageRef.current(event.data.data)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
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
  const [mode, setMode] = React.useState<PreviewMode | undefined>(undefined)

  React.useEffect(() => {
    if (!isInIframe()) return

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'preview-mode') {
        setMode(event.data.mode === 'dark' ? 'dark' : 'light')
      }
    }

    window.addEventListener('message', handleMessage)
    // Signal readiness so the parent (re)sends the current mode — its load-event send can
    // race ahead of this listener mounting.
    window.parent.postMessage(
      { type: 'preview-ready' } satisfies IframeToParentMessage,
      '*',
    )
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return mode
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
    { type: 'preview-inspect', panel } satisfies IframeToParentMessage,
    '*',
  )
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
        event.data?.type === 'preview-inspect' &&
        typeof event.data.panel === 'string'
      ) {
        onInspectRef.current(event.data.panel)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])
}

/**
 * Inside the preview iframe: report scroll progress (0 at rest → 1 at `range` px)
 * so the embedding toolbar can reveal its blur the way the app header does. CSS
 * scroll timelines can't cross the document boundary — the parent's CSS cannot
 * observe this document's scroller — so the progress travels by postMessage
 * instead: one message per scroll frame, only while the value actually changes.
 * The mount-time report also resets the parent after an iframe reload.
 */
export function useReportScrollProgress(range: number) {
  React.useEffect(() => {
    if (!isInIframe()) return

    let last = -1
    const report = () => {
      const progress = Math.min(1, Math.max(0, window.scrollY / range))
      if (progress === last) return
      last = progress
      window.parent.postMessage(
        { type: 'preview-scroll', progress } satisfies IframeToParentMessage,
        '*',
      )
    }
    report()
    window.addEventListener('scroll', report, { passive: true })
    return () => window.removeEventListener('scroll', report)
  }, [range])
}
