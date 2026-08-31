"use client"

import { ChartCard } from "./chart-card"
import { CHART_FAMILIES, variantsFor } from "./data"

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
        <ChartCard
          key={v.key}
          familyId={data.id}
          demoKey={v.key}
          label={v.label}
        />
      ))}
    </div>
  )
}
