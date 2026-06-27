'use client'

import { Suspense } from 'react'

import { cn } from '@/registry/lib/utils'
import { ShowcaseCard } from '@/components/showcase-card'

import { ChartCodeModal } from './chart-code-modal'
import { getDemoComponent, POLAR_FAMILIES } from './data'

interface ChartCardProps {
  /** Family id, e.g. `chart-bar` — decides polar vs cartesian sizing. */
  familyId: string
  /** Demo key, e.g. `chart-bar/demos/multiple`. */
  demoKey: string
  /** Human label for the card, e.g. `multiple`. */
  label: string
}

/**
 * One variant in the gallery: a subtle title and a "Show code" link sit in a
 * header row above a card that holds nothing but the live chart. The chart is
 * decorative (`inert` + `aria-hidden`) so it never traps focus across the grid —
 * the real, interactive component (with its source) lives in the docs, which
 * "Show code" links to. The chart fills the box (overriding each demo's own
 * aspect / min-height): polar charts stay square so they don't stretch,
 * cartesian ones fill the full width.
 */
export function ChartCard({ familyId, demoKey, label }: ChartCardProps) {
  const Component = getDemoComponent(demoKey)
  if (!Component) return null

  const isPolar = POLAR_FAMILIES.has(familyId)

  return (
    <ShowcaseCard
      label={label}
      action={<ChartCodeModal demoKey={demoKey} label={label} />}
      inert
      aria-hidden="true"
    >
      {/* Skeleton fills the whole box edge-to-edge; padding lives on the chart
          wrapper so it never insets the fallback. */}
      <Suspense fallback={<div className="size-full animate-pulse bg-muted" />}>
        <div
          className={cn(
            'flex size-full items-center justify-center [&_*]:pointer-events-none [&_[data-slot=chart]]:h-full! [&_[data-slot=chart]]:min-h-0!',
            isPolar
              ? 'p-2 [&_[data-slot=chart]]:mx-auto! [&_[data-slot=chart]]:aspect-square! [&_[data-slot=chart]]:w-auto!'
              : 'p-4 [&_[data-slot=chart]]:aspect-auto! [&_[data-slot=chart]]:w-full!',
          )}
        >
          <Component />
        </div>
      </Suspense>
    </ShowcaseCard>
  )
}
