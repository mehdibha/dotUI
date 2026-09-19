"use client"

import { Suspense, lazy } from "react"

// Lazy so the charts runtime stays out of the page's static chunk. Sibling
// chart demos lazy-load registry demos for the same reason (and because a
// module imported both statically and via DemosIndex breaks in production).
const ChartBarBrowsers = lazy(() => import("./chart-bar.lazy"))

export function ChartBarDemo() {
  return (
    <div className="w-[164px] max-w-full">
      <Suspense
        fallback={
          <div className="h-[96px] w-full animate-pulse rounded-xl bg-muted" />
        }
      >
        <ChartBarBrowsers />
      </Suspense>
    </div>
  )
}
