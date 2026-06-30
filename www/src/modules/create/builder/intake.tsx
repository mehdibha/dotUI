'use client'

import { type ReactNode, useMemo, useState } from 'react'
import {
  ArrowRightIcon,
  GlobeIcon,
  Loader2Icon,
  SparklesIcon,
  UploadIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from '@/registry/theme'
import type { AlgorithmId } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorField } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { FileTrigger } from '@/registry/ui/file-trigger'
import { Input } from '@/registry/ui/input'
import { SearchField } from '@/registry/ui/search-field'
import { Tag, TagGroup, TagList } from '@/registry/ui/tag-group'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

import { useDesignSystem } from '../preset'
import type { Density, DesignSystem } from '../preset'
import { RADIUS_FACTOR_VAR } from './tokens'

type IntakeMode = 'color' | 'url' | 'logo' | 'vibe'

interface Bundle {
  id: string
  label: string
  accent: string
  neutral?: string
  algorithm: AlgorithmId
  radius: string
  density: Density
}

const VIBES: Bundle[] = [
  {
    id: 'minimal',
    label: 'Minimal',
    accent: '#111111',
    neutral: '#808080',
    algorithm: 'oklch',
    radius: '0.5',
    density: 'compact',
  },
  {
    id: 'bold',
    label: 'Bold',
    accent: '#ff5c00',
    algorithm: 'tailwind',
    radius: '1',
    density: 'default',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    accent: '#b45309',
    neutral: '#8a8275',
    algorithm: 'oklch',
    radius: '0.25',
    density: 'comfortable',
  },
  {
    id: 'playful',
    label: 'Playful',
    accent: '#ec4899',
    algorithm: 'tailwind',
    radius: '1.6',
    density: 'comfortable',
  },
  {
    id: 'technical',
    label: 'Technical',
    accent: '#06b6d4',
    algorithm: 'contrast',
    radius: '0.25',
    density: 'compact',
  },
  {
    id: 'warm',
    label: 'Warm',
    accent: '#ea580c',
    neutral: '#8a8275',
    algorithm: 'oklch',
    radius: '1',
    density: 'default',
  },
]

const STARTERS: Bundle[] = [
  {
    id: 'geist',
    label: 'Geist',
    accent: '#000000',
    neutral: '#808080',
    algorithm: 'oklch',
    radius: '0.6',
    density: 'compact',
  },
  {
    id: 'material',
    label: 'Material',
    accent: '#6750a4',
    algorithm: 'material',
    radius: '1',
    density: 'default',
  },
  {
    id: 'linear',
    label: 'Linear',
    accent: '#5e6ad2',
    algorithm: 'oklch',
    radius: '0.8',
    density: 'compact',
  },
  {
    id: 'vercel',
    label: 'Vercel',
    accent: '#0070f3',
    neutral: '#808080',
    algorithm: 'oklch',
    radius: '0.5',
    density: 'compact',
  },
  {
    id: 'sunset',
    label: 'Sunset',
    accent: '#f43f5e',
    algorithm: 'tailwind',
    radius: '1.4',
    density: 'comfortable',
  },
]

function applyBundle(
  setDesignSystem: (u: (prev: DesignSystem) => DesignSystem) => void,
  b: Bundle,
) {
  setDesignSystem((prev) => ({
    ...prev,
    density: b.density,
    tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: b.radius },
    color: {
      algorithm: b.algorithm,
      seeds: {
        ...DEFAULT_COLOR_CONFIG.seeds,
        accent: b.accent,
        ...(b.neutral ? { neutral: b.neutral } : {}),
      },
    },
  }))
}

/* ----------------------------- Birth preview ---------------------------- */

/** The product thesis as one animation: one seed → a whole system blooms in. */
function SeedToSystem({ accent }: { accent: string }) {
  const resolved = useMemo(
    () =>
      resolveColorConfig({
        ...DEFAULT_COLOR_CONFIG,
        seeds: { ...DEFAULT_COLOR_CONFIG.seeds, accent },
      }),
    [accent],
  )
  const ramp = resolved.light.accent
  const stops = ramp ? Object.values(ramp) : []
  const status = (['success', 'warning', 'danger', 'info'] as const).map(
    (k) => resolved.light[k]?.['500'] ?? '#888',
  )

  return (
    <div className="flex flex-col gap-2.5" key={accent}>
      <div className="flex gap-1">
        {stops.map((c, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 6, scaleY: 0.4 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            transition={{
              delay: i * 0.04,
              duration: 0.3,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="h-7 flex-1 rounded-sm"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] tracking-widest text-fg-muted/70 uppercase">
          Status
        </span>
        <div className="flex gap-1.5">
          {status.map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.45 + i * 0.06,
                type: 'spring',
                stiffness: 400,
                damping: 22,
              }}
              className="size-4 rounded-full ring-1 ring-black/10 ring-inset"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- Intake --------------------------------- */

export function IntakeGate({ onGenerate }: { onGenerate: () => void }) {
  const { designSystem, setDesignSystem, setColorSeed } = useDesignSystem()
  const [mode, setMode] = useState<IntakeMode>('color')
  const [reading, setReading] = useState(false)
  const accent = (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent

  function simulateExtract(b: Bundle | undefined) {
    if (!b) return
    setReading(true)
    setTimeout(() => {
      applyBundle(setDesignSystem, b)
      setReading(false)
    }, 1100)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="scrollbar-none flex flex-1 flex-col overflow-y-auto p-5 *:shrink-0"
    >
      <div className="flex items-center gap-2 text-fg-muted">
        <SparklesIcon className="size-4" />
        <span className="text-xs font-medium tracking-wide uppercase">
          New system
        </span>
      </div>
      <h1 className="mt-3 text-xl font-semibold tracking-tight text-balance">
        Start from your brand.
      </h1>
      <p className="mt-1 text-sm text-balance text-fg-muted">
        Seed one colour and watch a complete, accessible system bloom — then
        refine anything.
      </p>

      <ToggleButtonGroup
        aria-label="Intake mode"
        selectionMode="single"
        disallowEmptySelection
        size="sm"
        selectedKeys={[mode]}
        onSelectionChange={(k) => {
          const next = k.values().next().value
          if (next) setMode(next as IntakeMode)
        }}
        className="mt-5 w-full *:flex-1"
      >
        <ToggleButton id="color">Color</ToggleButton>
        <ToggleButton id="url">URL</ToggleButton>
        <ToggleButton id="logo">Logo</ToggleButton>
        <ToggleButton id="vibe">Vibe</ToggleButton>
      </ToggleButtonGroup>

      <div className="mt-4 min-h-[13rem]">
        <AnimatePresence mode="wait">
          {mode === 'color' && (
            <motion.div
              key="color"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <ColorPicker
                value={accent}
                onChange={(c) => setColorSeed('accent', c.toString('hex'))}
              >
                <div className="flex gap-3">
                  <ColorArea
                    colorSpace="hsb"
                    xChannel="saturation"
                    yChannel="brightness"
                    className="h-32 flex-1"
                  />
                  <ColorSlider
                    orientation="vertical"
                    colorSpace="hsb"
                    channel="hue"
                    className="h-auto self-stretch"
                  />
                </div>
                <ColorField aria-label="Brand hex" className="mt-3 w-full">
                  <Input className="w-full" />
                </ColorField>
              </ColorPicker>
              <SeedToSystem accent={accent} />
            </motion.div>
          )}

          {mode === 'url' && (
            <IntakeStub
              key="url"
              icon={<GlobeIcon className="size-4" />}
              reading={reading}
              field={
                <SearchField aria-label="Website URL" className="w-full">
                  <Input placeholder="linear.app" className="w-full" />
                </SearchField>
              }
              action="Lift palette"
              onSubmit={() => simulateExtract(STARTERS[2])}
              note="Paste a site — we'll lift its palette. (Demo: applies a sample.)"
            />
          )}

          {mode === 'logo' && (
            <motion.div
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <div className="grid h-32 place-items-center rounded-xl border-2 border-dashed border-border text-center">
                {reading ? (
                  <span className="flex items-center gap-2 text-sm text-fg-muted">
                    <Loader2Icon className="size-4 animate-spin" />
                    Reading your brand…
                  </span>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-fg-muted">
                    <UploadIcon className="size-5" />
                    <FileTrigger onSelect={() => simulateExtract(STARTERS[1])}>
                      <Button size="sm">Upload a logo</Button>
                    </FileTrigger>
                    <span className="text-xs">or drag it here</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-fg-muted/70">
                We'll extract the dominant colour. (Demo: applies a sample.)
              </p>
            </motion.div>
          )}

          {mode === 'vibe' && (
            <motion.div
              key="vibe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <TagGroup
                aria-label="Vibe"
                selectionMode="single"
                onSelectionChange={(keys) => {
                  const id = [...keys][0]
                  const v = VIBES.find((x) => x.id === id)
                  if (v) applyBundle(setDesignSystem, v)
                }}
              >
                <TagList className="flex flex-wrap gap-2">
                  {VIBES.map((v) => (
                    <Tag key={v.id} id={v.id}>
                      <span
                        className="mr-1.5 inline-block size-2.5 rounded-full"
                        style={{ backgroundColor: v.accent }}
                      />
                      {v.label}
                    </Tag>
                  ))}
                </TagList>
              </TagGroup>
              <p className="text-xs text-fg-muted/70">
                Pick a starting personality — everything stays editable.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Starter systems */}
      <div className="mt-4 flex flex-col gap-2">
        <span className="text-[10px] font-semibold tracking-widest text-fg-muted/70 uppercase">
          Or start from a system
        </span>
        <div className="flex flex-wrap gap-2">
          {STARTERS.map((s) => (
            <Button
              key={s.id}
              size="sm"
              variant="default"
              onPress={() => applyBundle(setDesignSystem, s)}
            >
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: s.accent }}
                aria-hidden
              />
              {s.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-6">
        <Button variant="quiet" size="sm" onPress={onGenerate}>
          Skip
        </Button>
        <Button variant="primary" onPress={onGenerate}>
          Build my system
          <ArrowRightIcon data-icon-end="" />
        </Button>
      </div>
    </motion.div>
  )
}

function IntakeStub({
  icon,
  field,
  action,
  onSubmit,
  note,
  reading,
}: {
  icon: ReactNode
  field: ReactNode
  action: string
  onSubmit: () => void
  note: string
  reading: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-2 text-fg-muted">{icon}</div>
      {field}
      <Button
        size="sm"
        variant="primary"
        onPress={onSubmit}
        isDisabled={reading}
      >
        {reading ? (
          <>
            <Loader2Icon data-icon-start="" className="animate-spin" />
            Reading…
          </>
        ) : (
          action
        )}
      </Button>
      <p className="text-xs text-fg-muted/70">{note}</p>
    </motion.div>
  )
}
