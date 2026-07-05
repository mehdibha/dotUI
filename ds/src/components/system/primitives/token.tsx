import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Inline monospace token / value. */
export function Mono({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <code className={cn('font-mono text-[0.8125rem] text-fg', className)}>
      {children}
    </code>
  )
}

/** A block of preformatted code (token JSON, CSS). */
export function CodeBlock({
  code,
  className,
}: {
  code: string
  className?: string
}) {
  return (
    <pre
      className={cn(
        'overflow-x-auto rounded-xl border bg-muted/30 p-4 font-mono text-xs leading-relaxed text-fg',
        className,
      )}
    >
      <code>{code}</code>
    </pre>
  )
}

const roleClass = {
  concept: 'bg-accent-muted text-fg-accent',
  modifier: 'bg-warning-muted text-fg-warning',
  property: 'bg-success-muted text-fg-success',
  state: 'bg-info-muted text-fg-info',
  literal: 'bg-muted text-fg-muted',
  plain: 'bg-muted text-fg',
} as const

export type TokenSegmentRole = keyof typeof roleClass

/** A kebab token name decomposed into color-coded, role-labeled segments. */
export function TokenName({
  parts,
  className,
}: {
  parts: { text: string; role?: TokenSegmentRole }[]
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex flex-wrap items-center gap-1 font-mono text-sm',
        className,
      )}
    >
      {parts.map((part, index) => (
        <span
          key={index}
          className={cn(
            'rounded px-1.5 py-0.5',
            roleClass[part.role ?? 'plain'],
          )}
        >
          {part.text}
        </span>
      ))}
    </span>
  )
}

/** Legend mapping segment roles to their swatch color. */
export function TokenLegend({
  items,
  className,
}: {
  items: { role: TokenSegmentRole; label: string }[]
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap gap-x-4 gap-y-1.5', className)}>
      {items.map((item) => (
        <span
          key={item.role}
          className="flex items-center gap-1.5 text-xs text-fg-muted"
        >
          <span
            className={cn(
              'size-2.5 rounded-[3px]',
              roleClass[item.role].split(' ')[0],
            )}
          />
          {item.label}
        </span>
      ))}
    </div>
  )
}
