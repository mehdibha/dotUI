"use client"

import { Suspense, lazy } from "react"

// Lazy on purpose — see the note in chart-bar.tsx.
const ChartRadarVisitors = lazy(() => import("./chart-radar.lazy"))

export function ChartRadarDemo() {
  return (
    <div className="w-[240px] max-w-full">
      <Suspense
        fallback={
          <div className="h-[132px] w-full animate-pulse rounded-xl bg-muted" />
        }
      >
        <ChartRadarVisitors />
      </Suspense>
    </div>
  )
}
