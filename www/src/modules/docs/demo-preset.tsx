'use client'

import type { ReactNode } from 'react'

import { DesignSystemProvider } from '@/lib/styles'
import { useStoredPreset } from '@/modules/create/preset/storage'

/**
 * Renders a docs demo subtree in the user's selected design-system preset (the
 * one they build at /create, persisted in localStorage). Scoped, so only the
 * demo re-themes — the surrounding docs chrome stays in the site theme — and any
 * overlays the demo portals are themed too. When the user hasn't customized
 * anything it resolves to the defaults and injects nothing.
 */
export function DemoPreset({ children }: { children: ReactNode }) {
  const ds = useStoredPreset()
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
