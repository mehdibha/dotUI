'use client'

import { useState } from 'react'
import { ArrowUpIcon, ShuffleIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'

import {
  DEFAULT_RADIUS_FACTOR,
  RADIUS_FACTOR_VAR,
  RadiusConfig,
} from '../layout'
import { useDesignSystem } from '../preset'
import type { Density } from '../preset'
import { SegmentedRow } from './axis-panels'
import {
  type Vibe,
  VIBES,
  applyVibe,
  shuffleSystem,
  vibeFromPrompt,
} from './vibes'

const PROMPT_CHIPS = [
  'Warm editorial fintech',
  'Linear-style minimal',
  'Playful and rounded',
  'Calm wellness app',
  'High-contrast dashboard',
  'Bold and vivid',
]

const QUICK_ACCENTS = [
  '#6366f1',
  '#2563eb',
  '#0ea5e9',
  '#14b8a6',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#171717',
]

const DENSITY_OPTIONS = [
  { value: 'compact' as Density, label: 'Compact' },
  { value: 'default' as Density, label: 'Default' },
  { value: 'comfortable' as Density, label: 'Comfortable' },
]

export function StylePanel() {
  const { designSystem, setDesignSystem, setDensity, setToken, setColorSeed } =
    useDesignSystem()
  const [prompt, setPrompt] = useState('')
  const [changelog, setChangelog] = useState<string[] | null>(null)

  const radiusFactor =
    designSystem.tokens[RADIUS_FACTOR_VAR] ?? DEFAULT_RADIUS_FACTOR
  const accent =
    designSystem.color?.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent

  function generate(text: string) {
    if (!text.trim()) return
    apply(vibeFromPrompt(text))
  }

  function apply(vibe: Vibe) {
    applyVibe(setDesignSystem, vibe)
    setChangelog(['Accent', 'Radius', 'Density'])
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs text-fg-muted">
        Set the whole system at once, then refine any axis from the rail.
      </p>

      {/* Prompt → system */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                generate(prompt)
              }
            }}
            rows={2}
            placeholder="Describe a brand, paste a URL, or drop a screenshot…"
            className="w-full resize-none rounded-lg border bg-field p-2.5 pr-10 text-sm outline-none placeholder:text-fg-muted focus-visible:focus-ring"
          />
          <Button
            size="sm"
            isIconOnly
            aria-label="Generate system"
            variant="primary"
            onPress={() => generate(prompt)}
            className="absolute right-1.5 bottom-1.5"
          >
            <ArrowUpIcon />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PROMPT_CHIPS.map((chip) => (
            <ButtonPrimitives.Button
              key={chip}
              onPress={() => {
                setPrompt(chip)
                generate(chip)
              }}
              className="rounded-full border bg-card px-2.5 py-1 text-xs text-fg-muted focus-reset transition-colors hover:text-fg focus-visible:focus-ring"
            >
              {chip}
            </ButtonPrimitives.Button>
          ))}
        </div>
        {changelog && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-fg-muted">AI set</span>
            {changelog.map((axis) => (
              <span
                key={axis}
                className="rounded-md bg-success-muted px-1.5 py-0.5 text-[11px] text-fg-success"
              >
                {axis}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Vibe presets */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-fg-muted">Vibe</span>
        <div className="grid grid-cols-2 gap-2">
          {VIBES.map((vibe) => {
            const active = accent.toLowerCase() === vibe.accent.toLowerCase()
            return (
              <ButtonPrimitives.Button
                key={vibe.id}
                onPress={() => apply(vibe)}
                className={cn(
                  'flex items-center gap-2 rounded-lg border p-2 text-left focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring',
                  active && 'border-border-focus bg-accent-muted',
                )}
              >
                <span
                  className="size-4 shrink-0 rounded-md border"
                  style={{ backgroundColor: vibe.accent }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium">
                    {vibe.label}
                  </span>
                  <span className="block truncate text-[10px] text-fg-muted">
                    {vibe.description}
                  </span>
                </span>
              </ButtonPrimitives.Button>
            )
          })}
        </div>
      </div>

      {/* Quick accent */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-fg-muted">Accent</span>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACCENTS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              onClick={() => setColorSeed('accent', c)}
              style={{ backgroundColor: c }}
              className={cn(
                'size-6 rounded-md border focus-reset focus-visible:focus-ring',
                accent.toLowerCase() === c.toLowerCase() &&
                  'ring-2 ring-fg ring-offset-2 ring-offset-card',
              )}
            />
          ))}
        </div>
      </div>

      <RadiusConfig
        value={radiusFactor}
        onChange={(v) => setToken(RADIUS_FACTOR_VAR, v)}
      />

      <SegmentedRow
        label="Density"
        value={designSystem.density}
        onChange={setDensity}
        options={DENSITY_OPTIONS}
      />

      <Button onPress={() => shuffleSystem(setDesignSystem)}>
        <ShuffleIcon />
        Surprise me
      </Button>
    </div>
  )
}
