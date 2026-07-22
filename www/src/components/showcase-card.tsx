import type * as React from 'react'

import { cn } from '@/registry/lib/utils'

interface ShowcaseCardProps extends React.ComponentProps<'div'> {
  /** Quiet label shown at the left of the header row. */
  label: React.ReactNode
  /** Optional element pinned to the right of the header row (an action, swatches…). */
  action?: React.ReactNode
}

/**
 * The gallery card shell shared by /charts and the preset gallery: a quiet header row
 * (label left, optional action right) above a fixed-height framed box that holds
 * a live preview. Extra props spread onto the framed box, so callers can pass
 * `inert aria-hidden` (the decorative chart previews) or wire interactions.
 */
export function ShowcaseCard({
  label,
  action,
  className,
  children,
  ...props
}: ShowcaseCardProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 pl-1">
        <span className="text-sm text-fg-muted capitalize">{label}</span>
        {action}
      </div>
      <div
        className={cn(
          'relative h-60 overflow-hidden rounded-2xl border bg-card',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}
