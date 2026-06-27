'use client'

import { useMemo } from 'react'
import { ArrowRightIcon, SparklesIcon, WandSparklesIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from '@/registry/theme'
import { Button } from '@/registry/ui/button'

import { useDesignSystem } from '../../preset'
import {
  ChapterIntro,
  OptionGrid,
  Section,
  Seed,
  SwitchField,
} from '../controls'
import { PRESETS, ROLL_ACCENTS } from '../data'
import { useStudioActions } from '../hooks'
import { useStudio } from '../store'

export function BrandChapter() {
  const { designSystem } = useDesignSystem()
  const { seedFromColor, applyPreset } = useStudioActions()
  const { colorMode, setColorMode, showPalettes, setShowPalettes, setChapter } =
    useStudio()

  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const accent = config.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent
  const resolved = useMemo(() => resolveColorConfig(config), [config])
  const accentRamp = resolved.light.accent ?? {}
  const neutralRamp = resolved.light.neutral ?? {}

  return (
    <div className="flex flex-col gap-7">
      <ChapterIntro
        title="Brand"
        blurb="Drop in one color. dotUI generates a complete, contrast-safe system around it — then you refine anything."
      />

      {/* The magic hero — one seed, a whole generated system. */}
      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="flex items-center gap-3 p-4">
          <div
            className="size-14 shrink-0 rounded-xl shadow-sm ring-1 ring-black/10 ring-inset"
            style={{ backgroundColor: accent }}
          />
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[10px] font-semibold tracking-[0.12em] text-fg-muted uppercase">
              Brand seed
            </span>
            <Seed value={accent} live onChange={seedFromColor} />
          </div>
        </div>

        {/* Generated foundation — the system that falls out of the one seed. */}
        <div className="flex flex-col gap-2 border-t bg-neutral/30 p-4">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12em] text-fg-muted uppercase">
            <WandSparklesIcon className="size-3 text-primary" />
            Generated from your seed
          </div>
          <Ramp ramp={accentRamp} />
          <Ramp ramp={neutralRamp} />
          <div className="mt-0.5 flex items-center gap-1.5">
            {(['success', 'warning', 'danger', 'info'] as const).map((p) => {
              const mid = resolved.light[p]?.['500']
              return (
                <span
                  key={p}
                  className="size-5 rounded-md border"
                  style={{ backgroundColor: mid }}
                  title={p}
                />
              )
            })}
            <span className="ml-auto text-[11px] text-fg-muted">
              accent · neutral · semantics
            </span>
          </div>
        </div>

        {/* Quick brand swatches — instant variety. */}
        <div className="flex flex-wrap items-center gap-1.5 border-t p-3">
          <span className="mr-1 text-[11px] text-fg-muted">Try</span>
          {ROLL_ACCENTS.slice(0, 9).map((hex) => (
            <ButtonPrimitives.Button
              key={hex}
              onPress={() => seedFromColor(hex)}
              aria-label={`Use ${hex}`}
              className={cn(
                'size-5 rounded-full focus-reset ring-1 ring-black/10 transition-transform ring-inset hover:scale-110 focus-visible:focus-ring',
                accent.toLowerCase() === hex.toLowerCase() &&
                  'ring-2 ring-primary',
              )}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>

      {/* How color is authored — the fork between magic and full control. */}
      <Section
        label="Color approach"
        hint={
          <ButtonPrimitives.Button
            onPress={() => setChapter('color')}
            className="flex items-center gap-1 text-[11px] text-fg-muted focus-reset transition-colors hover:text-fg focus-visible:focus-ring"
          >
            Open color
            <ArrowRightIcon className="size-3" />
          </ButtonPrimitives.Button>
        }
      >
        <OptionGrid
          value={colorMode}
          onChange={setColorMode}
          options={[
            {
              value: 'simple',
              label: 'Guided',
              hint: 'One seed, auto everything',
              preview: <SparklesIcon className="size-5 text-primary" />,
            },
            {
              value: 'advanced',
              label: 'Full control',
              hint: 'Algorithm, knobs, semantics',
              preview: (
                <div className="flex gap-0.5">
                  {['400', '500', '600', '700'].map((s) => (
                    <span
                      key={s}
                      className="h-5 w-2 rounded-[2px]"
                      style={{ backgroundColor: accentRamp[s] }}
                    />
                  ))}
                </div>
              ),
            },
          ]}
        />
        <SwitchField
          label="Expose palettes as foundations"
          hint="Surface the raw generated scales (50–950) as editable tokens, the way a design-system team works. Off keeps things semantic."
          value={showPalettes}
          onChange={setShowPalettes}
        />
      </Section>

      {/* Presets — a complete, named system in one click. */}
      <Section label="Start from a preset">
        <OptionGrid
          value={''}
          onChange={(id) => {
            const preset = PRESETS.find((p) => p.id === id)
            if (preset) applyPreset(preset)
          }}
          options={PRESETS.map((p) => ({
            value: p.id,
            label: p.label,
            hint: p.hint,
            preview: (
              <div className="flex items-center gap-1">
                <span
                  className="size-5 rounded-md ring-1 ring-black/10 ring-inset"
                  style={{ backgroundColor: p.accent }}
                />
                <span
                  className="size-5 rounded-md ring-1 ring-black/10 ring-inset"
                  style={{ backgroundColor: p.neutral }}
                />
              </div>
            ),
          }))}
        />
      </Section>

      <Button
        variant="primary"
        className="w-full"
        onPress={() => setChapter('color')}
      >
        Refine the system
        <ArrowRightIcon data-icon-end="" />
      </Button>
    </div>
  )
}

function Ramp({ ramp }: { ramp: Record<string, string> }) {
  const entries = Object.entries(ramp)
  if (entries.length === 0) return null
  return (
    <div className="flex h-5 overflow-hidden rounded-md ring-1 ring-border">
      {entries.map(([step, value]) => (
        <div
          key={step}
          className="flex-1"
          style={{ backgroundColor: value }}
          title={`${step}: ${value}`}
        />
      ))}
    </div>
  )
}
