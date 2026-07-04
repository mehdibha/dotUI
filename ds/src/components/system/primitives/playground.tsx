import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils'

const gridStyle: CSSProperties = {
  backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
}

/**
 * A framed live-demo surface: an optional header (label + controls), a centered
 * preview body, and an optional footer caption. The workhorse of every section.
 */
export function Playground({
  label,
  hint,
  controls,
  footer,
  children,
  className,
  bodyClassName,
  center = true,
  surface = 'default',
}: {
  label?: ReactNode
  hint?: ReactNode
  controls?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
  center?: boolean
  surface?: 'default' | 'muted' | 'grid'
}) {
  return (
    <figure className={cn('overflow-hidden rounded-xl border', className)}>
      {(label || controls) && (
        <figcaption className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b bg-muted/20 px-4 py-2.5">
          <div className="flex items-baseline gap-2 text-xs">
            {label && <span className="font-medium text-fg">{label}</span>}
            {hint && <span className="text-fg-muted">{hint}</span>}
          </div>
          {controls && (
            <div className="flex flex-wrap items-center gap-2">{controls}</div>
          )}
        </figcaption>
      )}
      <div
        style={surface === 'grid' ? gridStyle : undefined}
        className={cn(
          'p-6 sm:p-8',
          surface === 'muted' && 'bg-muted/30',
          center && 'flex min-h-44 items-center justify-center',
          bodyClassName,
        )}
      >
        {children}
      </div>
      {footer && (
        <div className="border-t bg-muted/10 px-4 py-2.5 text-xs text-fg-muted">
          {footer}
        </div>
      )}
    </figure>
  )
}

/** A preview surface that forces light or dark tokens locally (for elevation, etc.). */
export function Frame({
  mode = 'light',
  className,
  children,
}: {
  mode?: 'light' | 'dark'
  className?: string
  children: ReactNode
}) {
  return (
    <div
      data-mode={mode}
      className={cn(mode === 'dark' && 'dark', 'text-fg', className)}
    >
      {children}
    </div>
  )
}
