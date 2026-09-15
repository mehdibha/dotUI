"use client"

import { Suspense, lazy } from "react"

// Lazy on purpose — see the note in chart-bar.tsx.
const ChartLineVisitors = lazy(() => import("./chart-line.lazy"))

export function ChartLineDemo() {
  return (
    <div className="w-[180px] max-w-full">
      <Suspense
        fallback={
          <div className="h-[92px] w-full animate-pulse rounded-xl bg-muted" />
        }
      >
        <ChartLineVisitors />
      </Suspense>
    </div>
  )
}
