'use client'

import { Suspense, type ReactNode } from 'react'

import { DesignSystemProvider } from '@/lib/styles'
import { useStoredPreset } from '@/modules/create/preset/storage'

/**
 * Renders a docs demo subtree in the user's selected design-system preset (the
 * one they build at /create, persisted in localStorage). Scoped, so only the
 * demo re-themes — the surrounding docs chrome stays in the site theme — and any
 * overlays the demo portals are themed too. When the user hasn't customized
 * anything it resolves to the defaults and injects nothing.
 *
 * Wrapped in a Suspense boundary: the scoped provider injects a client-only
 * `<style>` (the `:root` closure it clones doesn't exist during prerender), so
 * the prerendered HTML lacks a child the client renders — a hydration mismatch.
 * Without a boundary, React recovers by re-rendering up to the nearest one, which
 * sits above the whole docs shell, briefly blanking the prose + table of contents.
 * This boundary scopes that recovery to the demo. `fallback` is `null` on purpose:
 * React recovers a hydration mismatch synchronously and never shows the fallback
 * (verified — a probe fallback never rendered), so a skeleton here would be dead code.
 */
export function DemoPreset({ children }: { children: ReactNode }) {
  const ds = useStoredPreset()
  return (
    <Suspense fallback={null}>
      <DesignSystemProvider
        params={ds.componentParams}
        tokens={ds.tokens}
        density={ds.density}
        color={ds.color}
        scoped
      >
        {children}
      </DesignSystemProvider>
    </Suspense>
  )
}
