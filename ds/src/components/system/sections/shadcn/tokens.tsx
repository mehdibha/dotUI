'use client'

import { useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
import { isPaintable } from '@/components/explorer/swatch'
import { SearchField } from '@/ui/search-field'

import { Section } from '../../primitives'
import type { BaseColor } from './data'
import { THEMES, TOKEN_GROUPS } from './data'
import { BaseChoice } from './shared'

interface TokenRow {
  name: string
  usage: string
}

/** Every token as a flat, ordered row with a usage note (foregrounds included). */
const ROWS: TokenRow[] = TOKEN_GROUPS.flatMap((group) =>
  group.tokens.flatMap((token) =>
    token.fg
      ? [
          { name: token.name, usage: token.usage },
          { name: token.fg, usage: `Text painted on ${token.name}.` },
        ]
      : [{ name: token.name, usage: token.usage }],
  ),
)

export function TokensSection() {
  const [base, setBase] = useState<BaseColor>('zinc')
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ROWS
    return ROWS.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.usage.toLowerCase().includes(q),
    )
  }, [query])

  const light = THEMES[base].light
  const dark = THEMES[base].dark

  return (
    <Section
      title="Tokens"
      kicker="Reference"
      intro="All 31 tokens with their light and dark values for the chosen base color. Every component in shadcn/ui is styled from this set alone."
    >
      <div className="flex flex-wrap items-center gap-3">
        <BaseChoice value={base} onChange={setBase} />
        <SearchField
          aria-label="Search tokens"
          placeholder="Search tokens…"
          value={query}
          onChange={setQuery}
          className="flex-1 sm:max-w-56"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left font-mono text-[11px] tracking-wider text-fg-muted uppercase">
              <th className="py-2 pr-4 font-medium">Token</th>
              <th className="py-2 pr-4 font-medium">Light</th>
              <th className="py-2 pr-4 font-medium">Dark</th>
              <th className="hidden py-2 font-medium md:table-cell">Usage</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="border-b border-border/60">
                <td className="py-2 pr-4">
                  <span className="font-mono text-xs">{row.name}</span>
                </td>
                <td className="py-2 pr-4">
                  <ValueCell value={light[row.name]!} />
                </td>
                <td className="py-2 pr-4">
                  <ValueCell value={dark[row.name]!} />
                </td>
                <td className="hidden py-2 text-xs text-fg-muted md:table-cell">
                  {row.usage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="py-6 text-center text-sm text-fg-muted">
            No tokens match “{query}”.
          </p>
        )}
      </div>
    </Section>
  )
}

/** Swatch + value, click to copy. */
function ValueCell({ value }: { value: string }) {
  const paintable = isPaintable(value)
  return (
    <button
      type="button"
      title={`${value} — click to copy`}
      onClick={() => void navigator.clipboard?.writeText(value)}
      className="flex items-center gap-2"
    >
      <span
        className={cn(
          'size-4 shrink-0 rounded-sm border',
          !paintable && 'border-dashed',
        )}
        style={{ background: paintable ? value : undefined }}
      />
      <span className="font-mono text-[11px] whitespace-nowrap text-fg-muted">
        {value}
      </span>
    </button>
  )
}
