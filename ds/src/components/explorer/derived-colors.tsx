'use client'

import { useMemo, useState } from 'react'
import { SearchIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/lib/utils'
import type { DerivedColor, DerivedColors } from '@/data/schema'
import { Badge } from '@/ui/badge'
import { Tooltip, TooltipContent } from '@/ui/tooltip'

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

// ── class humanizing ────────────────────────────────────────────────────────
// Mirrors the extractor's baseUtility(): variants are the segments before the
// last top-level ':' not inside brackets.
function splitVariants(cls: string): { variants: string[]; base: string } {
  const variants: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < cls.length; i++) {
    const ch = cls[i]
    if (ch === '[') depth++
    else if (ch === ']') depth--
    else if (ch === ':' && depth === 0) {
      variants.push(cls.slice(start, i))
      start = i + 1
    }
  }
  return { variants, base: cls.slice(start) }
}

const UTIL_LABEL: Record<string, string> = {
  bg: 'background',
  text: 'text colour',
  border: 'border',
  ring: 'ring',
  outline: 'outline',
  shadow: 'shadow',
  fill: 'fill',
  stroke: 'stroke',
  from: 'gradient stop',
  via: 'gradient stop',
  to: 'gradient stop',
  placeholder: 'placeholder',
  caret: 'caret',
  divide: 'divide',
  decoration: 'decoration',
  accent: 'accent',
}

function humanizeBase(base: string): string {
  const util = /^([a-z]+)-/.exec(base)?.[1]
  return (util && UTIL_LABEL[util]) || base
}

function humanizeVariant(variant: string): string {
  switch (variant) {
    case 'hover':
      return 'on hover'
    case 'focus-visible':
      return 'when focus-visible'
    case 'focus':
      return 'when focused'
    case 'active':
      return 'when active'
    case 'disabled':
      return 'when disabled'
    case 'dark':
      return 'in dark mode'
    case 'group-hover':
      return 'on group hover'
  }
  const dataState = /^data-\[state=([^\]]+)\]$/.exec(variant)
  if (dataState) return `when ${dataState[1]}`
  const aria = /^aria-([\w-]+)$/.exec(variant)
  if (aria) return `when ${aria[1]}`
  return variant
}

/** "hover:bg-primary/10" → "background on hover"; "data-[state=checked]:text-destructive/80"
    → "text colour when checked". No variants → just the utility phrase. */
function humanizeClass(cls: string): string {
  const { variants, base } = splitVariants(cls)
  const phrase = humanizeBase(base)
  if (variants.length === 0) return phrase
  return `${phrase} ${variants.map(humanizeVariant).join(' ')}`
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
              entry.usedBy.some((u) => u.component.toLowerCase().includes(q))),
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
      <td className="px-3 py-2 text-xs text-fg-muted">
        <div className="flex flex-wrap gap-1">
          {entry.usedBy.map((used) => (
            <UsedByChip key={used.component} used={used} />
          ))}
        </div>
      </td>
    </tr>
  )
}

function UsedByChip({ used }: { used: DerivedColor['usedBy'][number] }) {
  return (
    <Tooltip delay={300}>
      <ButtonPrimitives.Button className="rounded border px-1.5 py-0.5 whitespace-nowrap focus-reset focus-visible:focus-ring">
        {used.component}
      </ButtonPrimitives.Button>
      <TooltipContent className="max-w-sm text-left">
        <div className="flex flex-col gap-1.5">
          {used.classes.map((cls) => (
            <div key={cls}>
              <div>{humanizeClass(cls)}</div>
              <div className="mt-0.5 font-mono text-[10px] opacity-70">
                {cls}
              </div>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
