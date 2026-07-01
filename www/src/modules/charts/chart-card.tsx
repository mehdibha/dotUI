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
 * "Show code" links to.
 *
 * Every card is the same height and padding so the gallery reads as one set.
 * Sizing mirrors shadcn's charts page: cartesian charts (line/bar/area) fill the
 * frame width, polar charts (pie/radar/radial) stay square and are capped at
 * 250px (shadcn's size) so they don't balloon, centered in the frame.
 */
export function ChartCard({ familyId, demoKey, label }: ChartCardProps) {
  const Component = getDemoComponent(demoKey)
  if (!Component) return null

  const isPolar = POLAR_FAMILIES.has(familyId)

  return (
    <ShowcaseCard
      label={label}
      action={<ChartCodeModal demoKey={demoKey} label={label} />}
      className="h-80"
      inert
      aria-hidden="true"
    >
      {/* Skeleton fills the whole box edge-to-edge; padding lives on the chart
          wrapper so it never insets the fallback. */}
      <Suspense fallback={<div className="size-full animate-pulse bg-muted" />}>
        <div
          className={cn(
            'flex size-full items-center justify-center p-9 [&_*]:pointer-events-none [&_[data-slot=chart]]:h-full! [&_[data-slot=chart]]:min-h-0!',
            isPolar
              ? '[&_[data-slot=chart]]:mx-auto! [&_[data-slot=chart]]:aspect-square! [&_[data-slot=chart]]:max-h-[250px]! [&_[data-slot=chart]]:w-auto!'
              : '[&_[data-slot=chart]]:aspect-auto! [&_[data-slot=chart]]:w-full!',
          )}
        >
          <Component />
        </div>
      </Suspense>
    </ShowcaseCard>
  )
}
