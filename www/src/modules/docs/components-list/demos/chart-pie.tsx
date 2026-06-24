'use client'

import { Suspense, lazy } from 'react'

// Lazy on purpose — see the note in chart-bar.tsx: a module imported both
// statically here and dynamically via DemosIndex breaks in production.
const ChartPieSimple = lazy(
  () => import('@/registry/ui/chart-pie/demos/simple'),
)

export function ChartPieDemo() {
  return (
    <div className="w-[360px] max-w-full">
      <Suspense
        fallback={
          <div className="h-[400px] w-full animate-pulse rounded-xl bg-muted" />
        }
      >
        <ChartPieSimple />
      </Suspense>
    </div>
  )
}
