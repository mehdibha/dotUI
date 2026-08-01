'use client'

import { Suspense, lazy } from 'react'

// Lazy on purpose — see the note in chart-bar.tsx: a module imported both
// statically here and dynamically via DemosIndex breaks in production.
const ChartScatterGrouped = lazy(
  () => import('@/registry/ui/chart-scatter/demos/grouped'),
)

export function ChartScatterDemo() {
  return (
    <div className="w-[360px] max-w-full">
      <Suspense
        fallback={
          <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
        }
      >
        <ChartScatterGrouped />
      </Suspense>
    </div>
  )
}
