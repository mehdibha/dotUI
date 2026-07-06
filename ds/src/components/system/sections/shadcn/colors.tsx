'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'
import { isPaintable } from '@/components/explorer/swatch'

import { Block, Section } from '../../primitives'
import type { BaseColor, Mode, TokenMeta } from './data'
import { THEMES, TOKEN_GROUPS } from './data'
import { BaseChoice, ModeChoice, ThemedPreview } from './shared'

export function ColorsSection() {
  const [base, setBase] = useState<BaseColor>('zinc')
  const [mode, setMode] = useState<Mode>('light')
  const theme = THEMES[base][mode]

  return (
    <Section
      title="Colors"
      kicker="The palette"
      intro="Every token resolved for the chosen base color and mode. Swap them to watch the same components re-theme — click any swatch to copy its value."
    >
      <div className="flex flex-wrap items-center gap-3">
        <BaseChoice value={base} onChange={setBase} />
        <ModeChoice value={mode} onChange={setMode} />
      </div>

      <Block title="Live preview">
        <ThemedPreview base={base} mode={mode} />
      </Block>

      <Block title="Tokens">
        <div className="flex flex-col gap-8">
          {TOKEN_GROUPS.map((group) => (
            <div key={group.id}>
              <h4 className="text-xs font-medium text-fg">{group.label}</h4>
              <p className="mt-0.5 mb-3 text-xs text-fg-muted">{group.blurb}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {group.tokens.map((token) => (
                  <TokenChip key={token.name} token={token} theme={theme} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Block>
    </Section>
  )
}

/** A single token swatch: the surface color, its paired foreground sample, name + value. */
function TokenChip({
  token,
  theme,
}: {
  token: TokenMeta
  theme: Record<string, string>
}) {
  const value = theme[token.name]!
  const fgValue = token.fg ? theme[token.fg] : undefined
  const paintable = isPaintable(value)

  return (
    <button
      type="button"
      title={`${token.name} · ${value} — click to copy`}
      onClick={() => void navigator.clipboard?.writeText(value)}
      className="group flex flex-col gap-1.5 text-left"
    >
      <span
        className={cn(
          'flex h-14 items-center justify-center rounded-md border',
          !paintable && 'border-dashed',
        )}
        style={{ background: paintable ? value : undefined }}
      >
        {fgValue && (
          <span className="text-sm font-semibold" style={{ color: fgValue }}>
            Aa
          </span>
        )}
      </span>
      <span className="flex flex-col">
        <span className="truncate font-mono text-[11px] text-fg group-hover:underline">
          {token.name}
        </span>
        <span className="truncate font-mono text-[10px] text-fg-muted">
          {value}
        </span>
      </span>
    </button>
  )
}
