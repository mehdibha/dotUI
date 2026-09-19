"use client"

import { Suspense, lazy } from "react"

// Lazy on purpose — see the note in chart-bar.tsx.
const ChartHeatmapContributions = lazy(() => import("./chart-heatmap.lazy"))

export function ChartHeatmapDemo() {
  return (
    <div className="w-[196px] max-w-full">
      <Suspense
        fallback={
          <div className="h-[96px] w-full animate-pulse rounded-xl bg-muted" />
        }
      >
        <ChartHeatmapContributions />
      </Suspense>
    </div>
  )
}
