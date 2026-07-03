import type { SpecEntry } from '@/data/schema'

import { SourceLinks } from './source-links'

interface SpecTableProps {
  entries: SpecEntry[]
}

/** A labeled spec sheet: one row per architecture decision, sources attached. */
export function SpecTable({ entries }: SpecTableProps) {
  return (
    <dl className="divide-y rounded-lg border">
      {entries.map((entry) => (
        <div
          key={entry.label}
          className="grid grid-cols-1 gap-x-6 gap-y-1 px-4 py-3 sm:grid-cols-[8.5rem_1fr]"
        >
          <dt className="text-sm font-medium">{entry.label}</dt>
          <dd>
            <p className="text-sm">{entry.value}</p>
            {entry.note && (
              <p className="mt-1 text-xs text-fg-muted">{entry.note}</p>
            )}
            <SourceLinks sources={entry.sources} className="mt-1.5" />
          </dd>
        </div>
      ))}
    </dl>
  )
}
