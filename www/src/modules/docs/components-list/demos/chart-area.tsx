"use client"

import { Suspense, lazy } from "react"

// Lazy on purpose — see the note in chart-bar.tsx.
const ChartAreaVisitors = lazy(() => import("./chart-area.lazy"))

export function ChartAreaDemo() {
  return (
    <div className="w-[180px] max-w-full">
      <Suspense
        fallback={
          <div className="h-[96px] w-full animate-pulse rounded-xl bg-muted" />
        }
      >
        <ChartAreaVisitors />
      </Suspense>
    </div>
  )
}
