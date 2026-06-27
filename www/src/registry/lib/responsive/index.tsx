'use client'

import type * as React from 'react'

import { useIsMobile } from '@/registry/hooks/use-mobile'

export interface ResponsiveProps {
  /**
   * Render the content for the current viewport. `isMobile` is `true` below the
   * mobile breakpoint, so you can pick an overlay per device — e.g. a `Drawer`
   * on mobile and a `Modal` on desktop.
   */
  render: (isMobile: boolean) => React.ReactNode
}

/**
 * Headless helper that renders different content depending on the viewport.
 *
 * ```tsx
 * <Responsive
 *   render={(isMobile) => (isMobile ? <Drawer>…</Drawer> : <Modal>…</Modal>)}
 * />
 * ```
 */
export function Responsive({ render }: ResponsiveProps) {
  const isMobile = useIsMobile()
  return <>{render(isMobile)}</>
}
