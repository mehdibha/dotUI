'use client'

import { useEffect, useRef, useState } from 'react'

import { ChartCard } from './chart-card'
import { CHART_FAMILIES, variantsFor } from './data'

/**
 * Mounts its children once they come near the viewport. The page stacks ~60
 * live Recharts previews; mounting them all at once blocks the main thread for
 * seconds, so offscreen cards wait their turn. The placeholder matches
 * ChartCard's rendered height (header row + h-80 card) so nothing shifts.
 */
function LazyMount({ children }: { children: React.ReactNode }) {
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
      { rootMargin: '600px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="h-[22.25rem]">
      {visible && children}
    </div>
  )
}

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

  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {variantsFor(data.id).map((v) => (
        <LazyMount key={v.key}>
          <ChartCard familyId={data.id} demoKey={v.key} label={v.label} />
        </LazyMount>
      ))}
    </div>
  )
}
