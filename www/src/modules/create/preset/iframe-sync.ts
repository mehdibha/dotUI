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
  | { type: 'preview-scrolled'; scrolled: boolean }

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

/**
 * Inside the preview iframe: report whether the document is scrolled past the top, so
 * the embedding toolbar can reveal its bottom border. Sends only on threshold crossings,
 * plus once on mount — which also resets the parent after an iframe reload.
 */
export function useReportPreviewScrolled() {
  React.useEffect(() => {
    if (!isInIframe()) return

    let last: boolean | undefined
    const report = () => {
      const scrolled = window.scrollY > 0
      if (scrolled === last) return
      last = scrolled
      window.parent.postMessage(
        { type: 'preview-scrolled', scrolled } satisfies IframeToParentMessage,
        '*',
      )
    }
    report()
    window.addEventListener('scroll', report, { passive: true })
    return () => window.removeEventListener('scroll', report)
  }, [])
}
