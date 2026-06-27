'use client'

import { useMemo, useState } from 'react'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import {
  DEFAULT_COLOR_CONFIG,
  PALETTE_ORDER,
  resolveColorConfig,
} from '@/registry/theme'

import { DEFAULT_RADIUS_FACTOR, RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'
import { Segmented } from './primitives'

type Mode = 'light' | 'dark'

/** A live, searchable browser of the resolved design tokens. */
export function TokensView() {
  const { designSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const resolved = useMemo(() => resolveColorConfig(config), [config])
  const [mode, setMode] = useState<Mode>('light')
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const ramps = mode === 'light' ? resolved.light : resolved.dark
  const q = query.trim().toLowerCase()

  function copy(token: string, value: string) {
    navigator.clipboard?.writeText(value).then(
      () => {
        setCopied(token)
        window.setTimeout(() => setCopied(null), 1200)
      },
      () => {},
    )
  }

  const scalarTokens: Array<{ name: string; value: string }> = [
    {
      name: '--radius-factor',
      value: designSystem.tokens[RADIUS_FACTOR_VAR] ?? DEFAULT_RADIUS_FACTOR,
    },
    { name: '--density', value: designSystem.density },
    ...Object.entries(designSystem.tokens)
      .filter(([name]) => name !== RADIUS_FACTOR_VAR)
      .map(([name, value]) => ({ name, value })),
  ].filter((t) => !q || t.name.toLowerCase().includes(q))

  const palettes = PALETTE_ORDER.filter((p) => !q || p.includes(q))

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b px-4 py-2.5">
        <div className="flex flex-1 items-center gap-2 rounded-md border bg-bg px-2.5 focus-within:focus-ring">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter tokens…"
            className="h-7 w-full bg-transparent text-[13px] outline-none placeholder:text-fg-muted"
          />
        </div>
        <div className="w-40">
          <Segmented<Mode>
            ariaLabel="Token mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
        </div>
        {copied && (
          <span className="flex items-center gap-1 text-[11px] text-success">
            <CheckIcon className="size-3" /> Copied
          </span>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {/* Color ramps */}
          {palettes.length > 0 && (
            <section className="flex flex-col gap-3">
              <h3 className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
                Color · {PALETTE_ORDER.length} palettes
              </h3>
              <div className="flex flex-col gap-3">
                {palettes.map((palette) => {
                  const ramp = ramps[palette]
                  if (!ramp) return null
                  return (
                    <div key={palette} className="flex flex-col gap-1">
                      <span className="text-[11px] font-medium capitalize">
                        {palette}
                      </span>
                      <div className="grid grid-cols-11 gap-1">
                        {Object.entries(ramp).map(([step, value]) => {
                          const token = `--${palette}-${step}`
                          return (
                            <button
                              key={step}
                              type="button"
                              onClick={() => copy(token, value)}
                              title={`${token}: ${value}`}
                              className="group/swatch flex flex-col items-center gap-1"
                            >
                              <span
                                className="h-9 w-full rounded-md border transition-transform group-hover/swatch:scale-105"
                                style={{ backgroundColor: value }}
                              />
                              <span className="font-mono text-[9px] text-fg-muted">
                                {step}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Scalar tokens */}
          {scalarTokens.length > 0 && (
            <section className="flex flex-col gap-3">
              <h3 className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
                Foundation
              </h3>
              <div className="overflow-hidden rounded-lg border">
                {scalarTokens.map((t, i) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => copy(t.name, t.value)}
                    className={cn(
                      'flex w-full items-center justify-between gap-4 px-3 py-2 text-left transition-colors hover:bg-neutral',
                      i > 0 && 'border-t',
                    )}
                  >
                    <span className="font-mono text-[12px] text-fg">
                      {t.name}
                    </span>
                    <span className="truncate font-mono text-[12px] text-fg-muted">
                      {t.value}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
