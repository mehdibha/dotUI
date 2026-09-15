"use client"

import { Suspense, lazy } from "react"

// Lazy on purpose — see the note in chart-bar.tsx.
const ChartRadialVisitors = lazy(() => import("./chart-radial.lazy"))

export function ChartRadialDemo() {
  return (
    <div className="w-[136px] max-w-full">
      <Suspense
        fallback={
          <div className="h-[108px] w-full animate-pulse rounded-xl bg-muted" />
        }
      >
        <ChartRadialVisitors />
      </Suspense>
    </div>
  )
}
