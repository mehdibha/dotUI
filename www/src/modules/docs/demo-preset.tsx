'use client'

import type { ReactNode } from 'react'

import { DesignSystemProvider } from '@/lib/styles'

import { useResolvedPreset } from './preset-control'

/**
 * Renders a docs demo subtree in the globally selected design-system preset —
 * either one of the curated presets or the user's own /create design system,
 * chosen via the preset selector (see preset-control). Scoped, so only the demo
 * re-themes — the surrounding docs chrome stays in the site theme — and any
 * overlays the demo portals are themed too. When the selection resolves to the
 * defaults it injects nothing.
 */
export function DemoPreset({ children }: { children: ReactNode }) {
  const ds = useResolvedPreset()
  return (
    <DesignSystemProvider
      params={ds.componentParams}
      tokens={ds.tokens}
      density={ds.density}
      color={ds.color}
      scoped
    >
      {children}
    </DesignSystemProvider>
  )
}
