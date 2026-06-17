'use client'

import { Suspense, lazy } from 'react'

// Lazy on purpose — see the note in chart-bar.tsx: a module imported both
// statically here and dynamically via DemosIndex breaks in production.
const ChartAreaDefault = lazy(
  () => import('@/registry/ui/chart-area/demos/default'),
)

export function ChartAreaDemo() {
  return (
    <div className="w-[360px] max-w-full">
      <Suspense fallback={null}>
        <ChartAreaDefault />
      </Suspense>
    </div>
  )
}
