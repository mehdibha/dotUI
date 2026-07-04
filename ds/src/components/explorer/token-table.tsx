'use client'

import { useMemo, useState } from 'react'
import { SearchIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { TokenGroup } from '@/data/schema'
import { Badge } from '@/ui/badge'

import { SourceLinks } from './source-links'
import { SwatchPopover } from './swatch-popover'

const layerVariant = {
  primitive: 'neutral',
  semantic: 'info',
  component: 'success',
} as const

interface TokenTableProps {
  groups: TokenGroup[]
  modes: string[]
}

/** Searchable token explorer: one table per group, swatch columns per mode. */
export function TokenTable({ groups, modes }: TokenTableProps) {
  const [query, setQuery] = useState('')
  const [layer, setLayer] = useState<'all' | TokenGroup['layer']>('all')

  const layers = useMemo(
    () => [...new Set(groups.map((group) => group.layer))],
    [groups],
  )
  const total = useMemo(
    () => groups.reduce((n, group) => n + group.tokens.length, 0),
    [groups],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return groups
      .filter((group) => layer === 'all' || group.layer === layer)
      .map((group) => ({
        ...group,
        tokens: q
          ? group.tokens.filter(
              (token) =>
                token.name.toLowerCase().includes(q) ||
                token.ref?.toLowerCase().includes(q) ||
                Object.values(token.values).some((value) =>
                  value.toLowerCase().includes(q),
                ),
            )
          : group.tokens,
      }))
      .filter((group) => group.tokens.length > 0)
  }, [groups, query, layer])

  const shown = filtered.reduce((n, group) => n + group.tokens.length, 0)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative flex-1 basis-64">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-fg-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${total} tokens — name, reference or value…`}
            className="h-9 w-full rounded-lg border bg-field pr-3 pl-9 text-sm outline-offset-1 placeholder:text-fg-muted focus-visible:outline-2"
          />
        </label>
        {layers.length > 1 && (
          <div className="flex items-center gap-1">
            {(['all', ...layers] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setLayer(value)}
                className={cn(
                  'cursor-pointer rounded-md border px-2.5 py-1 text-xs capitalize transition-colors',
                  layer === value
                    ? 'bg-inverse text-bg'
                    : 'text-fg-muted hover:bg-muted hover:text-fg',
                )}
              >
                {value}
              </button>
            ))}
          </div>
        )}
        <span className="text-xs text-fg-muted">
          {shown === total ? `${total} tokens` : `${shown} of ${total}`}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-8">
        {filtered.length === 0 && (
          <p className="rounded-lg border p-6 text-sm text-fg-muted">
            No tokens match “{query}”.
          </p>
        )}
        {filtered.map((group) => (
          <div key={group.name}>
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="text-sm font-medium">{group.name}</h3>
              <Badge appearance="subtle" variant={layerVariant[group.layer]}>
                {group.layer}
              </Badge>
              <span className="text-xs text-fg-muted">
                {group.tokens.length} tokens
              </span>
              <SourceLinks sources={group.sources} className="ml-auto" />
            </div>
            {group.note && (
              <p className="mt-1 max-w-3xl text-xs text-fg-muted">
                {group.note}
              </p>
            )}
            <div className="mt-2 overflow-x-auto rounded-lg border">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-xs text-fg-muted">
                    <th className="px-3 py-2 font-medium">Token</th>
                    <th className="px-3 py-2 font-medium">References</th>
                    {modes.map((mode) => (
                      <th
                        key={mode}
                        className="px-3 py-2 font-medium capitalize"
                      >
                        {mode}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {group.tokens.map((token) => (
                    <tr key={token.name} className="border-b last:border-b-0">
                      <td
                        className="max-w-64 truncate px-3 py-1.5 font-mono text-xs"
                        title={token.note ?? token.name}
                      >
                        {token.name}
                      </td>
                      <td
                        className="max-w-56 truncate px-3 py-1.5 font-mono text-xs text-fg-muted"
                        title={token.ref ?? undefined}
                      >
                        {token.ref ?? '—'}
                      </td>
                      {modes.map((mode) => {
                        const value = token.values[mode]
                        return (
                          <td key={mode} className="px-3 py-1.5">
                            {value ? (
                              <span className="flex items-center gap-2">
                                <SwatchPopover
                                  title={token.name}
                                  value={value}
                                  values={token.values}
                                  refText={token.ref}
                                  note={token.note}
                                  className="h-5 w-5 flex-none rounded border"
                                />
                                <span className="hidden max-w-40 truncate font-mono text-xs text-fg-muted lg:inline">
                                  {value}
                                </span>
                              </span>
                            ) : (
                              <span className="text-xs text-fg-muted">—</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
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
