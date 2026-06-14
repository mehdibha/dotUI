'use client'

import { Suspense } from 'react'
import type { CSSProperties } from 'react'

import { cn } from '@/registry/lib/utils'

import { getDemoComponent } from './data'

interface ChartPreviewProps {
  demoKey: string
  /** Optional per-slot `--chart-N` overrides; nullish entries inherit the theme. */
  palette?: (string | null)[]
  className?: string
}

/**
 * Renders a chart demo from the registry live. A palette override is applied as
 * inline `--chart-N` custom properties on the wrapper — the demos read their
 * fills through those vars, so the chart recolours instantly with no re-mount.
 */
export function ChartPreview({
  demoKey,
  palette,
  className,
}: ChartPreviewProps) {
  const Component = getDemoComponent(demoKey)
  if (!Component) return null

  const style = palette
    ? (Object.fromEntries(
        palette.flatMap((color, i) =>
          color ? [[`--chart-${i + 1}`, color]] : [],
        ),
      ) as CSSProperties)
    : undefined

  return (
    <div
      style={style}
      className={cn(
        'flex w-full min-w-0 flex-col items-center justify-center [&_[data-card]]:w-full [&_[data-card]]:border-none [&_[data-card]]:bg-transparent',
        className,
      )}
    >
      <Suspense
        fallback={
          <div className="h-[240px] w-full animate-pulse rounded-xl bg-muted" />
        }
      >
        <Component />
      </Suspense>
    </div>
  )
}
