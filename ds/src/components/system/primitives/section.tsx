import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** A top-level explorer section: kicker + heading + lede, then stacked content. */
export function Section({
  title,
  kicker,
  intro,
  children,
  className,
}: {
  title: string
  kicker?: string
  intro?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col', className)}>
      <header className="max-w-2xl">
        {kicker && (
          <p className="mb-2 font-mono text-[11px] font-medium tracking-wider text-fg-muted uppercase">
            {kicker}
          </p>
        )}
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {intro && (
          <p className="mt-3 text-[15px] leading-relaxed text-balance text-fg-muted">
            {intro}
          </p>
        )}
      </header>
      <div className="mt-8 flex flex-col gap-12">{children}</div>
    </div>
  )
}

/** A titled block inside a section. Groups a playground/table with a small header. */
export function Block({
  title,
  description,
  aside,
  children,
  className,
}: {
  title?: ReactNode
  description?: ReactNode
  aside?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('flex flex-col', className)}>
      {(title || description || aside) && (
        <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div className="max-w-2xl">
            {title && <h3 className="text-sm font-medium text-fg">{title}</h3>}
            {description && (
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                {description}
              </p>
            )}
          </div>
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

/** Small muted note, e.g. a caveat under a visual. */
export function Note({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={cn('text-xs leading-relaxed text-fg-muted', className)}>
      {children}
    </p>
  )
}
