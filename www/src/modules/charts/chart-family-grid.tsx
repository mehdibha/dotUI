"use client"

import { useEffect, useRef, useState } from "react"

import { ChartCard } from "./chart-card"
import { CHART_FAMILIES, variantsFor } from "./data"

/**
 * Mounts its children once they come near the viewport. The page stacks ~70
 * live chart previews; mounting them all at once blocks the main thread for
 * seconds, so offscreen cards wait their turn. The placeholder matches
 * ChartCard's rendered height (header row + card box) so nothing shifts.
 */
function LazyMount({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "600px 0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {visible && children}
    </div>
  )
}

/* The header row above each card box is 36px tall (28px row + 8px gap), so
   the placeholder is the card box height plus that. */
const PLACEHOLDER_HEIGHT = "h-[20.25rem]"

/**
 * Renders the chart previews for a single family, identified by its registry id
 * (see CHART_FAMILIES). The family heading itself lives in the MDX so it feeds
 * the page's table of contents, mirroring the components gallery.
 */
export function ChartFamilyGrid({ family }: { family: string }) {
  const data = CHART_FAMILIES.find((f) => f.id === family)

  if (!data) {
    if (import.meta.env.DEV) {
      console.warn(
        `<ChartFamilyGrid family="${family}" /> — no matching family in CHART_FAMILIES`,
      )
    }
    return null
  }

  // Two columns, not three: the content column is ~900px, and three-across
  // makes every card taller than it is wide.
  return (
    <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
      {variantsFor(data.id).map((v) => (
        <LazyMount key={v.key} className={PLACEHOLDER_HEIGHT}>
          <ChartCard familyId={data.id} demoKey={v.key} label={v.label} />
        </LazyMount>
      ))}
    </div>
  )
}
