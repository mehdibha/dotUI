'use client'

import { useMemo, useRef, useState } from 'react'
import {
  CheckIcon,
  DicesIcon,
  ImageIcon,
  SparklesIcon,
  WandSparklesIcon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import {
  DEFAULT_COLOR_CONFIG,
  PALETTE_ORDER,
  resolveColorConfig,
} from '@/registry/theme'
import type { PaletteSeeds } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorField } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Input, TextArea } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { useDesignSystem } from '../preset'
import { useStudioActions } from './actions'
import { VIBES } from './data'
import { GroupLabel } from './primitives'

/* --------------------------- Average-colour grab ------------------------- */

/**
 * Pull a representative colour out of an uploaded image by letting the browser
 * downscale it to a single pixel — the fastest honest "extract from your brand"
 * we can do client-side, no library. Makes the "feed in your brand" promise
 * tangible from the very first interaction.
 */
async function extractAverageColor(file: File): Promise<string | null> {
  if (typeof document === 'undefined') return null
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.src = url
    await img.decode()
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(img, 0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    const hex = (n: number) => n.toString(16).padStart(2, '0')
    return `#${hex(r ?? 0)}${hex(g ?? 0)}${hex(b ?? 0)}`
  } catch {
    return null
  } finally {
    URL.revokeObjectURL(url)
  }
}

const HEX_RE = /#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi

function parsePalette(text: string): string[] {
  const matches = text.match(HEX_RE) ?? []
  return matches.map((m) =>
    m.length === 4
      ? `#${m[1]}${m[1]}${m[2]}${m[2]}${m[3]}${m[3]}`.toLowerCase()
      : m.toLowerCase(),
  )
}

/* ------------------------------- Seed swatch ----------------------------- */

function SeedSwatch({
  value,
  onChange,
  size = 'md',
}: {
  value: string
  onChange: (hex: string) => void
  size?: 'md' | 'lg'
}) {
  return (
    <ColorPicker value={value} onChange={(c) => onChange(c.toString('hex'))}>
      <Button
        variant="quiet"
        aria-label="Brand colour"
        className={cn(
          'shrink-0 overflow-hidden rounded-xl border p-0 shadow-sm transition-transform hover:scale-[1.03]',
          size === 'lg' ? 'size-16' : 'size-11',
        )}
      >
        <ColorSwatch className="size-full rounded-[inherit] border-0" />
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
    </ColorPicker>
  )
}

/* ------------------------------- Extract menu ---------------------------- */

function ExtractMenu() {
  const { applySeeds } = useStudioActions()
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const parsed = useMemo(() => parsePalette(text), [text])

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    const hex = await extractAverageColor(file)
    setBusy(false)
    if (hex) applySeeds({ accent: hex })
    e.target.value = ''
  }

  function applyParsed() {
    const [accent, neutral, ...rest] = parsed
    const seeds: Partial<PaletteSeeds> = {}
    if (accent) seeds.accent = accent
    if (neutral) seeds.neutral = neutral
    const [success, warning, danger, info] = rest
    if (success) seeds.success = success
    if (warning) seeds.warning = warning
    if (danger) seeds.danger = danger
    if (info) seeds.info = info
    applySeeds(seeds)
  }

  return (
    <Dialog>
      <ButtonPrimitives.Button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-2 text-xs text-fg-muted focus-reset transition-colors hover:bg-neutral/50 focus-visible:focus-ring">
        <WandSparklesIcon className="size-3.5" />
        Extract from image or palette
      </ButtonPrimitives.Button>
      <Popover placement="bottom" className="w-72 p-3">
        <DialogContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium">Extract from an image</span>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed py-3 text-xs text-fg-muted transition-colors hover:bg-neutral/50">
              <ImageIcon className="size-4" />
              {busy ? 'Reading colours…' : 'Drop or choose a logo'}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onFile}
              />
            </label>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium">Paste a palette</span>
            <TextArea
              aria-label="Paste hex colours"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="#6366f1, #0a0a0a, #22c55e…"
              className="h-16 w-full resize-none font-mono text-xs"
            />
            {parsed.length > 0 && (
              <div className="flex items-center gap-1.5">
                {parsed.slice(0, 8).map((hex, i) => (
                  <span
                    key={`${hex}-${i}`}
                    className="size-4 rounded-sm border"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            )}
            <Button
              size="sm"
              variant="primary"
              isDisabled={parsed.length === 0}
              onPress={applyParsed}
            >
              Apply {parsed.length > 0 ? `${parsed.length} colours` : 'palette'}
            </Button>
          </div>
        </DialogContent>
      </Popover>
    </Dialog>
  )
}

/* -------------------------------- Vibe chips ----------------------------- */

function VibeChips() {
  const { applyVibe } = useStudioActions()
  const { designSystem } = useDesignSystem()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const accent = (config.seeds.accent ?? '').toLowerCase()

  return (
    <div className="grid grid-cols-2 gap-1.5">
      {VIBES.map((vibe) => {
        const active = vibe.accent.toLowerCase() === accent
        return (
          <ButtonPrimitives.Button
            key={vibe.id}
            onPress={() => applyVibe(vibe)}
            className={cn(
              'group flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs focus-reset transition-colors focus-visible:focus-ring',
              active
                ? 'border-primary/40 bg-primary/5'
                : 'hover:border-border-field hover:bg-neutral/50',
            )}
          >
            <span className="flex -space-x-1">
              <span
                className="size-3.5 rounded-full ring-1 ring-bg"
                style={{ backgroundColor: vibe.accent }}
              />
              <span
                className="size-3.5 rounded-full ring-1 ring-bg"
                style={{ backgroundColor: vibe.neutral }}
              />
            </span>
            <span className="flex-1 truncate font-medium">{vibe.label}</span>
            {active && <CheckIcon className="size-3.5 text-primary" />}
          </ButtonPrimitives.Button>
        )
      })}
    </div>
  )
}

/* ------------------------------- Front door ------------------------------ */

export function BrandFrontDoor() {
  const { designSystem, setColorSeed } = useDesignSystem()
  const { reroll } = useStudioActions()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const accent = config.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent

  // The full generated system, previewed as one tonal strip per palette — proof
  // the single seed has fanned out into a complete, contrast-safe library.
  const resolved = useMemo(() => resolveColorConfig(config), [config])

  return (
    <section className="flex flex-col gap-4 rounded-2xl border bg-gradient-to-b from-neutral/40 to-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <SparklesIcon className="size-3.5 text-primary" />
          <GroupLabel>Brand</GroupLabel>
        </div>
        <Tooltip delay={250}>
          <Button
            size="sm"
            variant="quiet"
            className="h-7 gap-1.5 px-2 text-xs"
            onPress={reroll}
          >
            <DicesIcon className="size-3.5" />
            Surprise me
          </Button>
          <TooltipContent>Re-roll accent, radius & density</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-3">
        <SeedSwatch
          value={accent}
          onChange={(hex) => setColorSeed('accent', hex)}
          size="lg"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="text-sm font-semibold">Seed one colour</span>
          <span className="text-xs leading-snug text-balance text-fg-muted">
            We expand it into a full, contrast-checked system — surfaces, text,
            states and charts.
          </span>
        </div>
      </div>

      {/* The generated proof: every palette as a tonal ramp. */}
      <div className="flex flex-col gap-1">
        {PALETTE_ORDER.map((palette) => {
          const ramp = resolved.light[palette]
          if (!ramp) return null
          return (
            <div
              key={palette}
              className="flex h-2.5 overflow-hidden rounded-full"
              title={palette}
            >
              {Object.entries(ramp).map(([step, val]) => (
                <span
                  key={step}
                  className="h-full flex-1"
                  style={{ backgroundColor: val }}
                />
              ))}
            </div>
          )
        })}
      </div>

      <ExtractMenu />

      <div className="flex flex-col gap-2">
        <GroupLabel>Or pick a vibe</GroupLabel>
        <VibeChips />
      </div>
    </section>
  )
}
