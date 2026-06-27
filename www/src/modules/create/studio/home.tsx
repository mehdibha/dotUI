'use client'

import { useMemo, useState } from 'react'
import { BlocksIcon, SparklesIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import {
  DEFAULT_COLOR_CONFIG,
  PALETTE_ORDER,
  resolveColorConfig,
} from '@/registry/theme'
import { SearchField } from '@/registry/ui/search-field'

import { useDesignSystem } from '../preset'
import { ComponentList } from './components-browser'
import { FOUNDATIONS, type Vibe, VIBES } from './data'
import { useStudio } from './nav'
import { NavRow, RampStrip, SectionLabel, SeedSwatch } from './primitives'

/* ------------------------------------------------------------------ *
 * Home — the front door.
 *
 * Brand hero (one seed → system) · one-tap vibes · Quick/Pro depth ·
 * foundations list with live previews · searchable component list.
 * ------------------------------------------------------------------ */

export function Home() {
  const { push, depth, reroll } = useStudio()
  const { designSystem, setColorSeed, setDesignSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const [query, setQuery] = useState('')

  const ramps = useMemo(() => resolveColorConfig(config).light, [config])

  const applyVibe = (vibe: Vibe) => {
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density: vibe.density,
        tokens: { ...prev.tokens, '--radius-factor': vibe.radius },
        color: {
          ...base,
          algorithm: vibe.algorithm,
          seeds: { ...base.seeds, accent: vibe.accent, neutral: vibe.neutral },
        },
      }
    })
  }

  const foundations = FOUNDATIONS.filter(
    (f) => depth === 'pro' || f.tier === 'core',
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Brand hero */}
      <div className="flex flex-col gap-4 rounded-xl border bg-gradient-to-b from-muted/40 to-transparent p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <SeedSwatch
              label="Brand"
              value={config.seeds.accent}
              onChange={(hex) => setColorSeed('accent', hex)}
              description="one seed → system"
            />
          </div>
          <ButtonPrimitives.Button
            onPress={reroll}
            aria-label="Surprise me"
            className="mt-6 flex size-9 shrink-0 items-center justify-center rounded-lg border bg-bg focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring"
          >
            <SparklesIcon className="size-4" />
          </ButtonPrimitives.Button>
        </div>
        <div className="flex flex-col gap-1">
          {PALETTE_ORDER.slice(0, 2).map((p) => {
            const ramp = ramps[p]
            return ramp ? <RampStrip key={p} ramp={ramp} /> : null
          })}
        </div>
        <ButtonPrimitives.Button
          onPress={() => push('color')}
          className="text-left text-xs font-medium text-fg-muted underline-offset-2 focus-reset hover:text-fg hover:underline"
        >
          Open the color lab →
        </ButtonPrimitives.Button>
      </div>

      {/* Vibes */}
      <section className="flex flex-col gap-2">
        <SectionLabel>Start from a vibe</SectionLabel>
        <div className="-mx-1 scrollbar-none flex gap-2 overflow-x-auto px-1 pb-1">
          {VIBES.map((vibe) => (
            <VibeChip
              key={vibe.id}
              vibe={vibe}
              onPress={() => applyVibe(vibe)}
            />
          ))}
        </div>
      </section>

      {/* Foundations — Quick shows only the core set; the Quick/Pro depth
          switch that gates this lives in the page top bar (CreateTopBar). */}
      <section className="flex flex-col gap-2">
        <SectionLabel>Foundations</SectionLabel>
        <div className="flex flex-col gap-2">
          {foundations.map((f) => {
            const Icon = f.icon
            return (
              <NavRow
                key={f.id}
                icon={<Icon />}
                title={f.title}
                subtitle={f.blurb}
                onPress={() => push(f.id)}
                preview={<FoundationPreview id={f.id} ramps={ramps} />}
              />
            )
          })}
        </div>
      </section>

      {/* Components */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <SectionLabel>Components</SectionLabel>
          <ButtonPrimitives.Button
            onPress={() => push('components')}
            className="flex items-center gap-1 text-[10px] font-medium text-fg-muted focus-reset hover:text-fg"
          >
            <BlocksIcon className="size-3" />
            Browse all
          </ButtonPrimitives.Button>
        </div>
        <SearchField
          aria-label="Search components"
          placeholder="Search components…"
          value={query}
          onChange={setQuery}
        />
        <ComponentList query={query} onSelect={push} />
      </section>
    </div>
  )
}

/* ------------------------------- Vibe ------------------------------- */

function VibeChip({ vibe, onPress }: { vibe: Vibe; onPress: () => void }) {
  return (
    <ButtonPrimitives.Button
      onPress={onPress}
      className="group flex w-24 shrink-0 flex-col gap-2 rounded-lg border p-2 text-left focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring"
    >
      <div
        className="h-10 w-full rounded-md"
        style={{
          background: `linear-gradient(135deg, ${vibe.swatch[0]}, ${vibe.swatch[1]})`,
        }}
      />
      <div className="flex flex-col">
        <span className="text-xs font-medium">{vibe.name}</span>
        <span className="truncate text-[10px] text-fg-muted">
          {vibe.description}
        </span>
      </div>
    </ButtonPrimitives.Button>
  )
}

/* --------------------------- Row previews --------------------------- */

function FoundationPreview({
  id,
  ramps,
}: {
  id: string
  ramps: Record<string, Record<string, string>>
}) {
  switch (id) {
    case 'color':
      return (
        <span className="flex gap-0.5">
          {['100', '300', '500', '700'].map((step) => (
            <span
              key={step}
              className="size-3.5 rounded-[3px] border border-black/5"
              style={{ backgroundColor: ramps.accent?.[step] }}
            />
          ))}
        </span>
      )
    case 'typography':
      return (
        <span className="font-heading text-lg leading-none tracking-tight">
          Ag
        </span>
      )
    case 'shape':
      return (
        <Swatch className="size-5 rounded-md border-2 border-fg-muted/50" />
      )
    case 'density':
      return (
        <span className="flex flex-col gap-[3px]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[2px] w-5 rounded-full bg-fg-muted/50" />
          ))}
        </span>
      )
    case 'elevation':
      return <Swatch className="size-5 rounded-md bg-bg shadow-md" />
    case 'motion':
      return <span className="text-xs text-fg-muted/60">›››</span>
    case 'icons':
      return <SparklesIcon className="size-4 text-fg-muted/60" />
    case 'cursor':
      return <span className="text-xs text-fg-muted/60">⌖</span>
    case 'charts':
      return (
        <span className="flex items-end gap-0.5">
          {[8, 14, 10, 16].map((h, i) => (
            <span
              key={i}
              className="w-1 rounded-sm bg-fg-muted/50"
              style={{ height: h }}
            />
          ))}
        </span>
      )
    default:
      return null
  }
}

function Swatch({ className }: { className?: string }) {
  return <span className={cn('block', className)} />
}
