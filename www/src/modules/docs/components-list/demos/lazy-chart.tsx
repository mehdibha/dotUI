import { type ComponentType, Suspense, lazy } from "react"

// Lazy so the charts runtime stays out of the page's static chunk.
export function lazyChart(
  load: () => Promise<{ default: ComponentType }>,
  width: number,
  height: number,
) {
  const Chart = lazy(load)
  return function ChartDemo() {
    return (
      <div className="max-w-full" style={{ width }}>
        <Suspense
          fallback={
            <div
              className="w-full animate-pulse rounded-xl bg-muted"
              style={{ height }}
            />
          }
        >
          <Chart />
        </Suspense>
      </div>
    )
  }
}
