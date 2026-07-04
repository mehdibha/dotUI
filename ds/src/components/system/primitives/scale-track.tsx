import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils'

export interface ScaleItem {
  token: string
  value: number
  /** Overrides the right-hand readout (defaults to `${value}${unit}`). */
  display?: string
  note?: ReactNode
  /** Dim the row, e.g. deprecated or out-of-focus steps. */
  muted?: boolean
}

/**
 * A numeric scale rendered as labeled rows with a proportional bar. Pass
 * `renderBar` to draw something other than a plain bar (a rounded corner, a
 * type specimen, a shadow swatch…).
 */
export function ScaleTrack({
  items,
  max,
  unit = 'px',
  renderBar,
  labelWidth = '9rem',
  className,
}: {
  items: ScaleItem[]
  max?: number
  unit?: string
  renderBar?: (item: ScaleItem, maxValue: number) => ReactNode
  labelWidth?: string
  className?: string
}) {
  const maxValue = max ?? Math.max(...items.map((item) => item.value), 1)
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {items.map((item) => (
        <div
          key={item.token}
          className="grid items-center gap-3"
          style={
            { gridTemplateColumns: `${labelWidth} 1fr auto` } as CSSProperties
          }
        >
          <span
            className={cn(
              'truncate font-mono text-xs',
              item.muted ? 'text-fg-muted/60' : 'text-fg-muted',
            )}
            title={item.token}
          >
            {item.token}
          </span>
          <div className="flex min-w-0 items-center">
            {renderBar ? (
              renderBar(item, maxValue)
            ) : (
              <span
                className="h-4 rounded-[3px] bg-accent/70"
                style={{
                  width: `${Math.max((item.value / maxValue) * 100, 0.5)}%`,
                }}
              />
            )}
          </div>
          <span className="text-right font-mono text-xs text-fg tabular-nums">
            {item.display ?? `${item.value}${unit}`}
          </span>
        </div>
      ))}
    </div>
  )
}
