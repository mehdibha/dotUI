"use client"

import { Suspense, lazy } from "react"

// Lazy on purpose — see the note in chart-bar.tsx.
const ChartPieBrowsers = lazy(() => import("./chart-pie.lazy"))

export function ChartPieDemo() {
  return (
    <div className="w-[136px] max-w-full">
      <Suspense
        fallback={
          <div className="h-[108px] w-full animate-pulse rounded-xl bg-muted" />
        }
      >
        <ChartPieBrowsers />
      </Suspense>
    </div>
  )
}
