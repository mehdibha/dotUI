'use client'

import { useState } from 'react'
import { ArrowRightIcon, DicesIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorField } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { DialogContent } from '@/registry/ui/dialog'
import { Input } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import { TextField } from '@/registry/ui/text-field'

import { RADIUS_FACTOR_VAR } from '../../layout'
import { useDesignSystem } from '../../preset'
import {
  pickRandom,
  SHUFFLE_ACCENTS,
  SHUFFLE_DENSITIES,
  SHUFFLE_RADII,
  type Starter,
  STARTERS,
  type Vibe,
  VIBES,
} from '../data'
import { PresetCard, SectionShell, Subgroup, Swatch } from '../primitives'

/** Three swatches that preview a starter's accent and its neighbours. */
function MiniRamp({ accent }: { accent: string }) {
  const ramp = (() => {
    try {
      const resolved = resolveColorConfig({
        ...DEFAULT_COLOR_CONFIG,
        seeds: { ...DEFAULT_COLOR_CONFIG.seeds, accent },
      })
      const r = resolved.light.accent
      return r ? [r['300'], r['500'], r['700']] : null
    } catch {
      return null
    }
  })()
  if (!ramp) return <Swatch color={accent} className="size-6" />
  return (
    <div className="flex overflow-hidden rounded-md ring-1 ring-black/10 ring-inset">
      {ramp.map((c, i) => (
        <span
          key={i}
          className="size-6"
          style={{ backgroundColor: c ?? accent }}
        />
      ))}
    </div>
  )
}

export function BrandSection() {
  const { designSystem, setDesignSystem, setColorSeed } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const accent = config.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent
  const [url, setUrl] = useState('')

  function applyStarter(s: Starter) {
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density: s.density,
        tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: s.radius },
        color: {
          ...base,
          algorithm: s.algorithm,
          seeds: { ...base.seeds, accent: s.accent, neutral: s.neutral },
        },
      }
    })
  }

  function applyVibe(v: Vibe) {
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density: v.density,
        tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: v.radius },
        color: { ...base, algorithm: v.algorithm },
      }
    })
  }

  function shuffle() {
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density: pickRandom(SHUFFLE_DENSITIES),
        tokens: {
          ...prev.tokens,
          [RADIUS_FACTOR_VAR]: pickRandom(SHUFFLE_RADII),
        },
        color: {
          ...base,
          seeds: { ...base.seeds, accent: pickRandom(SHUFFLE_ACCENTS) },
        },
      }
    })
  }

  // Honest stub: a real extractor would pull brand colors from the URL/logo.
  // Here a valid hex seeds the accent; anything else nudges a shuffle so the
  // gesture still produces a result.
  function extractFromUrl() {
    const hex = url.match(/#?[0-9a-fA-F]{6}/)?.[0]
    if (hex) setColorSeed('accent', hex.startsWith('#') ? hex : `#${hex}`)
    else shuffle()
  }

  const activeStarter = STARTERS.find(
    (s) =>
      s.accent.toLowerCase() === accent.toLowerCase() &&
      s.algorithm === config.algorithm,
  )

  return (
    <SectionShell
      title="Start from your brand"
      blurb="Drop one color and walk away with a complete, on-brand system — or pick a starter and tweak from there."
    >
      {/* Hero: the one color that drives everything */}
      <div className="flex flex-col gap-3 rounded-xl border bg-gradient-to-b from-neutral/60 to-neutral/20 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-[0.12em] text-fg-muted/80 uppercase">
            Brand color
          </span>
          <span className="font-mono text-[11px] text-fg-muted tabular-nums">
            {accent.toUpperCase()}
          </span>
        </div>

        <ColorPicker
          value={accent}
          onChange={(c) => setColorSeed('accent', c.toString('hex'))}
        >
          {({ color }) => (
            <>
              <Button className="h-12 w-full justify-start gap-3 pl-2.5 text-base">
                <ColorSwatch className="size-8 rounded-lg" />
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-sm font-medium">Pick your color</span>
                  <span className="font-mono text-[11px] text-fg-muted">
                    {color.toString('hex')}
                  </span>
                </span>
              </Button>
              <Popover>
                <DialogContent className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <ColorArea
                      colorSpace="hsb"
                      xChannel="saturation"
                      yChannel="brightness"
                    />
                    <ColorSlider
                      orientation="vertical"
                      colorSpace="hsb"
                      channel="hue"
                      className="h-auto self-stretch"
                    />
                  </div>
                  <ColorField aria-label="Hex" className="w-full">
                    <Input size="sm" className="w-full" />
                  </ColorField>
                </DialogContent>
              </Popover>
            </>
          )}
        </ColorPicker>

        {/* Live preview of the generated accent ramp */}
        <div className="flex overflow-hidden rounded-md ring-1 ring-black/5 ring-inset">
          {(() => {
            let ramp: Record<string, string> | undefined
            try {
              ramp = resolveColorConfig(config).light.accent
            } catch {
              ramp = undefined
            }
            if (!ramp) return null
            return Object.values(ramp).map((c, i) => (
              <span
                key={i}
                className="h-6 flex-1"
                style={{ backgroundColor: c }}
              />
            ))
          })()}
        </div>
      </div>

      {/* Extract from a site or logo — honest preview-only */}
      <Subgroup title="Or import a brand">
        <div className="flex gap-2">
          <TextField
            aria-label="Brand URL or hex"
            value={url}
            onChange={setUrl}
            className="min-w-0 flex-1"
          >
            <Input
              size="sm"
              placeholder="yourbrand.com or #6366f1"
              className="w-full"
            />
          </TextField>
          <Button size="sm" variant="primary" onPress={extractFromUrl}>
            Extract
            <ArrowRightIcon data-icon-end="" />
          </Button>
        </div>
        <p className="text-xs text-fg-muted/80">
          Paste a site or a hex and we'll seed from it. Full logo extraction is
          coming — for now a hex in the field is applied directly.
        </p>
      </Subgroup>

      {/* Starters */}
      <Subgroup
        title="Starters"
        action={
          <Button size="xs" variant="quiet" onPress={shuffle}>
            <DicesIcon data-icon-start="" />
            Surprise me
          </Button>
        }
      >
        <div className="grid grid-cols-2 gap-2">
          {STARTERS.map((s) => (
            <PresetCard
              key={s.id}
              onPress={() => applyStarter(s)}
              isActive={activeStarter?.id === s.id}
            >
              <MiniRamp accent={s.accent} />
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium">{s.name}</span>
                <span className="font-mono text-[10px] text-fg-muted capitalize">
                  {s.algorithm}
                </span>
              </div>
            </PresetCard>
          ))}
        </div>
      </Subgroup>

      {/* Vibes */}
      <Subgroup title="Vibe">
        <div className="grid grid-cols-2 gap-2">
          {VIBES.map((v) => (
            <PresetCard key={v.id} onPress={() => applyVibe(v)}>
              <span className="text-[13px] font-medium">{v.name}</span>
              <span className={cn('text-[11px] leading-snug text-fg-muted')}>
                {v.hint}
              </span>
            </PresetCard>
          ))}
        </div>
      </Subgroup>
    </SectionShell>
  )
}
