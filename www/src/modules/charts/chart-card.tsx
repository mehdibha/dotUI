'use client'

import { Suspense } from 'react'

import { cn } from '@/registry/lib/utils'

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
 * One variant rendered in a gallery card: the live chart in a fixed-height box
 * above its name. The chart is decorative here (`inert` + `aria-hidden`) so the
 * grid stays keyboard-navigable across every variant at once — its accessible
 * description is the card label; the real, interactive component lives in the
 * docs and in installed code. The chart fills the box (overriding each demo's
 * own aspect / min-height): polar charts stay square so they don't stretch,
 * cartesian ones fill the full width.
 */
export function ChartCard({ familyId, demoKey, label }: ChartCardProps) {
  const Component = getDemoComponent(demoKey)
  if (!Component) return null

  const isPolar = POLAR_FAMILIES.has(familyId)

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border bg-card">
      <div
        inert
        aria-hidden="true"
        className="h-60 overflow-hidden border-b bg-bg/40"
      >
        {/* Skeleton fills the whole box edge-to-edge; padding lives on the chart
            wrapper so it never insets the fallback. */}
        <Suspense
          fallback={<div className="size-full animate-pulse bg-muted" />}
        >
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
      </div>
      <div className="px-4 py-3">
        <span className="text-sm font-medium capitalize">{label}</span>
      </div>
    </div>
  )
}
