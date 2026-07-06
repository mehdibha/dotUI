'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'
import { isPaintable } from '@/components/explorer/swatch'

import { Block, Note, Section } from '../../primitives'
import type { BaseColor, Mode } from './data'
import { TAILWIND_MAP, THEMES, TOKEN_GROUPS } from './data'
import { BaseChoice, ModeChoice } from './shared'

/** The Tailwind family a step belongs to (`zinc-900` → `zinc`, `white / 10%` → `white`). */
function family(step: string): string {
  return step.split(/[-\s]/)[0]!
}

/** A step is "borrowed" when it comes from outside the chosen base's own family. */
function isBorrowed(step: string, base: BaseColor): boolean {
  const f = family(step)
  return f !== base && f !== 'white' && f !== 'black'
}

export function MappingSection() {
  const [base, setBase] = useState<BaseColor>('zinc')
  const [mode, setMode] = useState<Mode>('light')
  const theme = THEMES[base][mode]
  const map = TAILWIND_MAP[base][mode]

  return (
    <Section
      title="Tailwind mapping"
      kicker="Where the values come from"
      intro="shadcn/ui doesn't invent colors — every token is a step lifted straight from Tailwind's palette. Here's the exact one behind each value. Borrowed steps (outside the base family) are highlighted."
    >
      <div className="flex flex-wrap items-center gap-3">
        <BaseChoice value={base} onChange={setBase} />
        <ModeChoice value={mode} onChange={setMode} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b text-left font-mono text-[11px] tracking-wider text-fg-muted uppercase">
              <th className="py-2 pr-4 font-medium">Token</th>
              <th className="py-2 pr-4 font-medium">Value</th>
              <th className="py-2 font-medium">Tailwind</th>
            </tr>
          </thead>
          <tbody>
            {TOKEN_GROUPS.map((group) => (
              <GroupRows
                key={group.id}
                group={group}
                theme={theme}
                map={map}
                base={base}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Block
        title="What gets borrowed"
        description="Nearly everything is the base gray. A few tokens reach outside it — and that's the whole of shadcn's color choices."
      >
        <ul className="flex flex-col gap-1.5 text-sm text-fg-muted">
          <li>
            <Chip step="red-600" /> / <Chip step="red-400" /> —{' '}
            <span className="font-mono text-xs">destructive</span> is red in
            every base.
          </li>
          <li>
            <Chip step="white / 10%" /> / <Chip step="white / 15%" /> — in dark
            mode <span className="font-mono text-xs">border</span> and{' '}
            <span className="font-mono text-xs">input</span> are translucent
            white, not a step.
          </li>
          <li>
            <Chip step="blue-700" /> —{' '}
            <span className="font-mono text-xs">sidebar-primary</span> is blue
            in dark mode.
          </li>
          <li>
            <span className="font-mono text-xs">chart-1…5</span> —
            neutral/stone/zinc tint the charts to their own gray; gray/slate
            keep Tailwind's colorful default series.
          </li>
        </ul>
      </Block>

      <Note>
        Verified by matching each resolved OKLCH value against Tailwind v4's
        palette — 155 tokens per mode, every one an exact hit.
      </Note>
    </Section>
  )
}

function GroupRows({
  group,
  theme,
  map,
  base,
}: {
  group: (typeof TOKEN_GROUPS)[number]
  theme: Record<string, string>
  map: Record<string, string>
  base: BaseColor
}) {
  const names = group.tokens.flatMap((token) =>
    token.fg ? [token.name, token.fg] : [token.name],
  )
  return (
    <>
      <tr>
        <td
          colSpan={3}
          className="pt-5 pb-1.5 font-mono text-[11px] tracking-wider text-fg-muted uppercase"
        >
          {group.label}
        </td>
      </tr>
      {names.map((name) => (
        <tr key={name} className="border-b border-border/60">
          <td className="py-2 pr-4">
            <span className="font-mono text-xs">{name}</span>
          </td>
          <td className="py-2 pr-4">
            <ValueCell value={theme[name]!} />
          </td>
          <td className="py-2">
            <Chip step={map[name]!} highlight={isBorrowed(map[name]!, base)} />
          </td>
        </tr>
      ))}
    </>
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

/** A Tailwind step name, styled like a token pill; borrowed steps get emphasis. */
function Chip({ step, highlight }: { step: string; highlight?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[11px] whitespace-nowrap',
        highlight
          ? 'border-accent bg-accent-muted font-medium text-fg-accent'
          : 'text-fg-muted',
      )}
    >
      {step}
    </span>
  )
}
