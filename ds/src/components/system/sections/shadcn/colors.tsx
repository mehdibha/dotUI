'use client'

import { Fragment, useMemo, useState } from 'react'

import { cn } from '@/lib/utils'
import { isPaintable } from '@/components/explorer/swatch'
import { SearchField } from '@/ui/search-field'

import { Block, Note, Section } from '../../primitives'
import type { BaseColor, ColorTheme, Mode } from './data'
import { TOKEN_GROUPS } from './data'
import type { StepInfo } from './shared'
import {
  BaseChoice,
  ModeChoice,
  ThemeChoice,
  ThemedPreview,
  resolveTheme,
} from './shared'

interface Row {
  name: string
  usage: string
}

/** Every token flattened to a row, foregrounds included, in theme order. */
const GROUPS: { id: string; label: string; rows: Row[] }[] = TOKEN_GROUPS.map(
  (group) => ({
    id: group.id,
    label: group.label,
    rows: group.tokens.flatMap((token) =>
      token.fg
        ? [
            { name: token.name, usage: token.usage },
            { name: token.fg, usage: `Text painted on ${token.name}.` },
          ]
        : [{ name: token.name, usage: token.usage }],
    ),
  }),
)

export function ColorsSection() {
  const [base, setBase] = useState<BaseColor>('zinc')
  const [theme, setTheme] = useState<ColorTheme>('default')
  const [mode, setMode] = useState<Mode>('light')
  const [query, setQuery] = useState('')

  const resolved = resolveTheme(base, mode, theme)

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return GROUPS
    return GROUPS.map((group) => ({
      ...group,
      rows: group.rows.filter(
        (row) =>
          row.name.toLowerCase().includes(q) ||
          row.usage.toLowerCase().includes(q),
      ),
    })).filter((group) => group.rows.length > 0)
  }, [query])

  return (
    <Section
      title="Colors"
      kicker="Explore"
      intro="Every token resolved for the picks a shadcn user actually makes — base gray, color theme, and mode. Watch the same UI re-theme, and see the exact Tailwind step behind each value (borrowed steps highlighted)."
    >
      <div className="flex flex-wrap items-center gap-3">
        <SearchField
          aria-label="Search tokens"
          placeholder="Search tokens…"
          value={query}
          onChange={setQuery}
          className="flex-1 sm:max-w-56"
        />
        <BaseChoice value={base} onChange={setBase} />
        <ThemeChoice value={theme} onChange={setTheme} />
        <ModeChoice value={mode} onChange={setMode} />
      </div>

      <Block title="Live preview">
        <ThemedPreview values={resolved.values} mode={mode} />
      </Block>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left font-mono text-[11px] tracking-wider text-fg-muted uppercase">
              <th className="py-2 pr-4 font-medium">Token</th>
              <th className="py-2 pr-4 font-medium">Value</th>
              <th className="py-2 pr-4 font-medium">Tailwind</th>
              <th className="hidden py-2 font-medium md:table-cell">Usage</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <Fragment key={group.id}>
                <tr>
                  <td
                    colSpan={4}
                    className="pt-5 pb-1.5 font-mono text-[11px] tracking-wider text-fg-muted uppercase"
                  >
                    {group.label}
                  </td>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.name} className="border-b border-border/60">
                    <td className="py-2 pr-4">
                      <span className="font-mono text-xs">{row.name}</span>
                    </td>
                    <td className="py-2 pr-4">
                      <ValueCell value={resolved.values[row.name]!} />
                    </td>
                    <td className="py-2 pr-4">
                      <StepChip info={resolved.step(row.name)} />
                    </td>
                    <td className="hidden py-2 text-xs text-fg-muted md:table-cell">
                      {row.usage}
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
        {groups.length === 0 && (
          <p className="py-6 text-center text-sm text-fg-muted">
            No tokens match “{query}”.
          </p>
        )}
      </div>

      <Block
        title="What gets borrowed"
        description="Almost every token is the base gray. A handful reach outside it — and that's the whole of shadcn's color choices."
      >
        <ul className="flex flex-col gap-1.5 text-sm text-fg-muted">
          <li>
            <span className="font-mono text-xs">destructive</span> is always
            red; in dark mode <span className="font-mono text-xs">border</span>{' '}
            and <span className="font-mono text-xs">input</span> are translucent
            white, and{' '}
            <span className="font-mono text-xs">sidebar-primary</span> is blue.
          </li>
          <li>
            neutral/stone/zinc tint the charts to their own gray; gray/slate
            keep Tailwind's colorful default series.
          </li>
          <li>
            A <span className="font-medium text-fg">color theme</span> repaints{' '}
            <span className="font-mono text-xs">primary</span>,{' '}
            <span className="font-mono text-xs">ring</span>, and their sidebar
            twins with a colored step — everything else stays the base gray.
            (The ring is a lighter/darker shade than the primary, and shadcn's
            “green” is built on lime.)
          </li>
        </ul>
      </Block>

      <Note>
        Every value is an exact Tailwind step — the base grays and the color
        themes alike (shadcn annotates each in its own source). Highlighted
        chips are the steps that reach outside the chosen base gray.
      </Note>
    </Section>
  )
}

/** Swatch + oklch value, click to copy. */
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

/** The exact Tailwind step behind a token; steps outside the base gray get emphasis. */
function StepChip({ info }: { info: StepInfo }) {
  if (!info.label) return <span className="text-fg-muted">—</span>
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[11px] whitespace-nowrap',
        info.borrowed
          ? 'border-accent bg-accent-muted font-medium text-fg-accent'
          : 'text-fg-muted',
      )}
    >
      {info.label}
    </span>
  )
}
