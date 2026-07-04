import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/** Definition-list spec sheet: one row per decision. */
export function SpecList({
  rows,
  className,
}: {
  rows: { label: ReactNode; value: ReactNode; note?: ReactNode }[]
  className?: string
}) {
  return (
    <dl className={cn('divide-y rounded-xl border', className)}>
      {rows.map((row, index) => (
        <div
          key={index}
          className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-[11rem_1fr]"
        >
          <dt className="text-sm text-fg-muted">{row.label}</dt>
          <dd className="text-sm text-fg">
            {row.value}
            {row.note && (
              <p className="mt-0.5 text-xs text-fg-muted">{row.note}</p>
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** Big-number stat tile. */
export function Stat({
  value,
  label,
  sub,
  className,
}: {
  value: ReactNode
  label: ReactNode
  sub?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 rounded-xl border p-5', className)}
    >
      <p className="font-mono text-2xl font-semibold text-fg tabular-nums">
        {value}
      </p>
      <div>
        <p className="text-xs font-medium tracking-wide text-fg-muted uppercase">
          {label}
        </p>
        {sub && <p className="mt-0.5 text-[11px] text-fg-muted">{sub}</p>}
      </div>
    </div>
  )
}

export function StatGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
