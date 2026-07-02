'use client'

import { useState } from 'react'
import {
  ArrowRightIcon,
  GlobeIcon,
  ImageIcon,
  WandSparklesIcon,
  XIcon,
} from 'lucide-react'
import { motion } from 'motion/react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import type { Density } from '@/registry/types'
import { Button } from '@/registry/ui/button'

import { RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'
import { SwatchButton } from './primitives'
import { useStudio } from './store'
import { ELEVATION_STYLE_VAR } from './tokens'

const SWATCHES = [
  '#2563eb',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#111827',
]

interface Vibe {
  id: string
  label: string
  radius: number
  density: Density
  elevation: string
}

const VIBES: Vibe[] = [
  {
    id: 'minimal',
    label: 'Minimal',
    radius: 0.5,
    density: 'compact',
    elevation: 'flat',
  },
  {
    id: 'modern',
    label: 'Modern',
    radius: 1,
    density: 'default',
    elevation: 'soft',
  },
  {
    id: 'playful',
    label: 'Playful',
    radius: 2,
    density: 'comfortable',
    elevation: 'soft',
  },
  {
    id: 'glass',
    label: 'Soft glass',
    radius: 1.5,
    density: 'default',
    elevation: 'glass',
  },
]

export function Onboarding() {
  const { setOnboardingOpen } = useStudio()
  const { designSystem, setDesignSystem } = useDesignSystem()
  const [accent, setAccent] = useState(
    designSystem.color?.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent,
  )
  const [vibe, setVibe] = useState<string>('modern')

  function close() {
    setOnboardingOpen(false)
  }

  function generate() {
    const v = VIBES.find((x) => x.id === vibe)
    if (!v) {
      close()
      return
    }
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density: v.density,
        tokens: {
          ...prev.tokens,
          [RADIUS_FACTOR_VAR]: String(v.radius),
          [ELEVATION_STYLE_VAR]: v.elevation,
        },
        color: { ...base, seeds: { ...base.seeds, accent } },
      }
    })
    close()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-40 flex items-center justify-center bg-bg/70 p-4 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 6 }}
        transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
        className="relative flex w-full max-w-lg flex-col gap-6 rounded-2xl border bg-card p-6 shadow-2xl"
      >
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          onPress={close}
          aria-label="Close generator"
          className="absolute top-3 right-3"
        >
          <XIcon />
        </Button>

        <div className="flex flex-col items-center gap-2 pt-2 text-center">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-fg-on-primary shadow-sm">
            <WandSparklesIcon className="size-5.5" />
          </div>
          <h1 className="text-lg font-semibold">Generate your design system</h1>
          <p className="max-w-sm text-[13px] text-fg-muted">
            Start from a single color or your brand. Everything — palettes,
            type, shape, depth — is generated, then yours to refine.
          </p>
        </div>

        {/* Seed */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
            Brand color
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {SWATCHES.map((hex) => (
              <ButtonPrimitives.Button
                key={hex}
                onPress={() => setAccent(hex)}
                aria-label={hex}
                className={cn(
                  'size-8 rounded-full border focus-reset transition-transform hover:scale-110 focus-visible:focus-ring',
                  accent.toLowerCase() === hex.toLowerCase() &&
                    'ring-2 ring-primary ring-offset-2 ring-offset-card',
                )}
                style={{ backgroundColor: hex }}
              />
            ))}
            <div className="ml-1 w-32">
              <SwatchButton
                ariaLabel="Custom brand color"
                value={accent}
                onChange={setAccent}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed py-2 text-[12px] text-fg-muted transition-colors hover:border-fg-muted/40 hover:bg-neutral"
            >
              <ImageIcon className="size-3.5" /> Upload logo
            </button>
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-dashed py-2 text-[12px] text-fg-muted transition-colors hover:border-fg-muted/40 hover:bg-neutral"
            >
              <GlobeIcon className="size-3.5" /> From URL
            </button>
          </div>
        </div>

        {/* Vibe */}
        <div className="flex flex-col gap-3">
          <span className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
            Vibe
          </span>
          <div className="grid grid-cols-4 gap-2">
            {VIBES.map((v) => {
              const active = v.id === vibe
              return (
                <ButtonPrimitives.Button
                  key={v.id}
                  onPress={() => setVibe(v.id)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-lg border p-3 focus-reset transition-colors focus-visible:focus-ring',
                    active
                      ? 'border-primary bg-primary/8 ring-1 ring-primary/30'
                      : 'hover:border-fg-muted/30 hover:bg-neutral',
                  )}
                >
                  <span
                    className="h-8 w-full border bg-card"
                    style={{
                      borderRadius: `calc(0.5rem * ${v.radius})`,
                      backgroundColor: accent,
                      opacity: active ? 1 : 0.55,
                    }}
                  />
                  <span className="text-[11px] font-medium">{v.label}</span>
                </ButtonPrimitives.Button>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <ButtonPrimitives.Button
            onPress={close}
            className="text-[13px] text-fg-muted underline-offset-2 focus-reset hover:text-fg hover:underline"
          >
            Start from scratch
          </ButtonPrimitives.Button>
          <Button variant="primary" onPress={generate} className="gap-1.5">
            Generate system
            <ArrowRightIcon data-icon-end="" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
