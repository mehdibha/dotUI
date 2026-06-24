'use client'

import { Suspense, lazy } from 'react'

// Lazy, not a static import: this same demo is dynamically imported via the
// generated DemosIndex (for /charts and the docs). A module imported both
// statically and dynamically gets folded into the static chunk, which breaks the
// dynamic import's default export in production (React #306). Keeping it dynamic
// here lets Vite code-split it cleanly so both importers resolve it.
const ChartBarDefault = lazy(
  () => import('@/registry/ui/chart-bar/demos/default'),
)

export function ChartBarDemo() {
  return (
    <div className="w-[360px] max-w-full">
      <Suspense
        fallback={
          <div className="h-[400px] w-full animate-pulse rounded-xl bg-muted" />
        }
      >
        <ChartBarDefault />
      </Suspense>
    </div>
  )
}
