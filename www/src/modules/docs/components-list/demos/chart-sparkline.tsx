'use client'

import { Suspense, lazy } from 'react'

// Lazy on purpose — see the note in chart-bar.tsx: a module imported both
// statically here and dynamically via DemosIndex breaks in production.
const ChartSparklineStatCard = lazy(
  () => import('@/registry/ui/chart-sparkline/demos/stat-card'),
)

export function ChartSparklineDemo() {
  return (
    <div className="w-64 max-w-full">
      <Suspense
        fallback={
          <div className="h-48 w-full animate-pulse rounded-xl bg-muted" />
        }
      >
        <ChartSparklineStatCard />
      </Suspense>
    </div>
  )
}
