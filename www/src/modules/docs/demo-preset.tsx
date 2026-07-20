'use client'

import type { ReactNode } from 'react'

import { DesignSystemProvider } from '@/lib/styles'

import { useForcedPreviewMode, useResolvedPreset } from './preview-controls'

/**
 * Themes a docs preview subtree with the globally selected preset and preview
 * mode (see preview-controls). Scoped, so only the preview re-themes — the
 * surrounding docs chrome keeps the site theme while overlays the preview
 * portals are themed with it. Resolves to a no-op when the selection matches
 * the site defaults.
 */
export function DemoPreset({ children }: { children: ReactNode }) {
  const ds = useResolvedPreset()
  return (
    <DesignSystemProvider
      params={ds.componentParams}
      tokens={ds.tokens}
      density={ds.density}
      color={ds.color}
      icons={ds.icons}
      forcedMode={useForcedPreviewMode()}
      scoped
    >
      {children}
    </DesignSystemProvider>
  )
}
