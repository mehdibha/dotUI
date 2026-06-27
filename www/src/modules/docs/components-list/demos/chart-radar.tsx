'use client'

import { Suspense, lazy } from 'react'

// Lazy on purpose — see the note in chart-bar.tsx: a module imported both
// statically here and dynamically via DemosIndex breaks in production.
const ChartRadarDefault = lazy(
  () => import('@/registry/ui/chart-radar/demos/default'),
)

export function ChartRadarDemo() {
  return (
    <div className="w-[360px] max-w-full">
      <Suspense
        fallback={
          <div className="h-[400px] w-full animate-pulse rounded-xl bg-muted" />
        }
      >
        <ChartRadarDefault />
      </Suspense>
    </div>
  )
}
