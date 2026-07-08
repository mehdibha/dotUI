'use client'

import { useMemo, useState } from 'react'
import { SearchIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { DerivedColor, DerivedColors } from '@/data/schema'
import { Badge } from '@/ui/badge'

import { SourceLinks } from './source-links'
import { checkerboard } from './swatch'

const kindLabel: Record<DerivedColor['kind'], string> = {
  opacity: 'Opacity',
  'color-mix': 'Color-mix',
  literal: 'Literal',
}
const kindVariant = {
  opacity: 'info',
  'color-mix': 'success',
  literal: 'warning',
} as const
const kindOrder: DerivedColor['kind'][] = ['opacity', 'color-mix', 'literal']

/** The CSS to paint for a preview chip. Resolved expressions reference the
    site's own theme vars, so they render against the ambient tokens. */
function paintValue(entry: DerivedColor): string | null {
  return entry.resolved ?? null
}

interface DerivedColorsProps {
  derived: DerivedColors
}

/** Point-of-use colours: a searchable dossier of the expressions component
    styles derive from tokens, grouped by kind. Mirrors the token table. */
export function DerivedColorsExplorer({ derived }: DerivedColorsProps) {
  const [query, setQuery] = useState('')

  const total = derived.entries.length
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    return kindOrder
      .map((kind) => ({
        kind,
        entries: derived.entries.filter(
          (entry) =>
            entry.kind === kind &&
            (!q ||
              entry.expression.toLowerCase().includes(q) ||
              entry.refs.some((ref) => ref.toLowerCase().includes(q)) ||
              entry.usedBy.some((u) => u.toLowerCase().includes(q))),
        ),
      }))
      .filter((group) => group.entries.length > 0)
  }, [derived.entries, query])

  const shown = groups.reduce((n, g) => n + g.entries.length, 0)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex-1 basis-64">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${total} expressions — token, kind or component…`}
            className="h-9 w-full rounded-lg border bg-field pr-3 pl-9 text-sm outline-offset-1 placeholder:text-fg-muted focus-visible:outline-2"
          />
        </label>
        <span className="text-xs text-fg-muted">
          {shown === total ? `${total} expressions` : `${shown} of ${total}`}
        </span>
      </div>

      {derived.note && (
        <p className="mt-3 max-w-3xl text-xs text-fg-muted">{derived.note}</p>
      )}

      <div className="mt-4 flex flex-col gap-8">
        {groups.length === 0 && (
          <p className="rounded-lg border p-6 text-sm text-fg-muted">
            No expressions match “{query}”.
          </p>
        )}
        {groups.map((group) => (
          <div key={group.kind}>
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="text-sm font-medium">{kindLabel[group.kind]}</h3>
              <Badge appearance="subtle" variant={kindVariant[group.kind]}>
                {group.kind}
              </Badge>
              <span className="text-xs text-fg-muted">
                {group.entries.length} expressions
              </span>
              <SourceLinks sources={derived.sources} className="ml-auto" />
            </div>
            <div className="mt-2 overflow-x-auto rounded-lg border">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-xs text-fg-muted">
                    <th className="px-3 py-2 font-medium">Preview</th>
                    <th className="px-3 py-2 font-medium">Expression</th>
                    <th className="px-3 py-2 font-medium">References</th>
                    <th className="px-3 py-2 font-medium">Used by</th>
                  </tr>
                </thead>
                <tbody>
                  {group.entries.map((entry) => (
                    <Row key={entry.expression} entry={entry} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Row({ entry }: { entry: DerivedColor }) {
  const paint = paintValue(entry)
  return (
    <tr className="border-b align-top last:border-b-0">
      <td className="px-3 py-2">
        <span
          className={cn(
            'block size-6 overflow-hidden rounded border',
            !paint && 'border-dashed',
          )}
          style={paint ? checkerboard : undefined}
          title={entry.resolved ?? entry.expression}
        >
          {paint && (
            <span className="block size-full" style={{ background: paint }} />
          )}
        </span>
      </td>
      <td
        className="px-3 py-2 font-mono text-xs"
        title={entry.note ?? undefined}
      >
        <div className="break-all">{entry.expression}</div>
        {entry.note && (
          <div className="mt-0.5 text-[11px] text-fg-muted">{entry.note}</div>
        )}
      </td>
      <td className="px-3 py-2 font-mono text-xs text-fg-muted">
        {entry.refs.length > 0 ? entry.refs.join(', ') : '—'}
      </td>
      <td className="px-3 py-2 text-xs text-fg-muted">
        <div className="flex flex-wrap gap-1">
          {entry.usedBy.map((used) => (
            <span
              key={used}
              className="rounded border px-1.5 py-0.5 whitespace-nowrap"
            >
              {used}
            </span>
          ))}
        </div>
      </td>
    </tr>
  )
}
