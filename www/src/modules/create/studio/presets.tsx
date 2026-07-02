'use client'

import { useState } from 'react'
import { LayoutGridIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import type { AlgorithmId } from '@/registry/theme'
import type { Density } from '@/registry/types'
import { Button } from '@/registry/ui/button'
import { DialogContent } from '@/registry/ui/dialog'
import { Modal } from '@/registry/ui/modal'

import { RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'
import { ELEVATION_STYLE_VAR } from './tokens'

interface Preset {
  id: string
  name: string
  tagline: string
  accent: string
  neutral?: string
  algorithm: AlgorithmId
  radius: number
  density: Density
  elevation: string
}

/* Curated starting points — each a complete, opinionated system you fork and
   then refine. They cover the spread the builder is meant to reproduce: tight
   product UIs, soft marketing systems, Material, monochrome, warm editorial. */
const PRESETS: Preset[] = [
  {
    id: 'linear',
    name: 'Aurora',
    tagline: 'Tight, cool, product-grade',
    accent: '#5b5bd6',
    neutral: '#6e6e80',
    algorithm: 'oklch',
    radius: 0.75,
    density: 'compact',
    elevation: 'soft',
  },
  {
    id: 'vercel',
    name: 'Onyx',
    tagline: 'Monochrome & sharp',
    accent: '#0070f3',
    neutral: '#808080',
    algorithm: 'oklch',
    radius: 0.4,
    density: 'compact',
    elevation: 'flat',
  },
  {
    id: 'stripe',
    name: 'Violet',
    tagline: 'Friendly fintech',
    accent: '#635bff',
    algorithm: 'oklch',
    radius: 1,
    density: 'default',
    elevation: 'soft',
  },
  {
    id: 'supabase',
    name: 'Forest',
    tagline: 'Crisp developer green',
    accent: '#3ecf8e',
    algorithm: 'oklch',
    radius: 0.5,
    density: 'default',
    elevation: 'flat',
  },
  {
    id: 'material',
    name: 'Tonal',
    tagline: 'Material-style, generous',
    accent: '#6750a4',
    algorithm: 'material',
    radius: 1.75,
    density: 'comfortable',
    elevation: 'depth',
  },
  {
    id: 'editorial',
    name: 'Terracotta',
    tagline: 'Warm editorial calm',
    accent: '#c2603f',
    neutral: '#8a7f76',
    algorithm: 'oklch',
    radius: 0.4,
    density: 'comfortable',
    elevation: 'flat',
  },
  {
    id: 'glass',
    name: 'Frost',
    tagline: 'Soft, translucent depth',
    accent: '#06b6d4',
    algorithm: 'oklch',
    radius: 1.5,
    density: 'default',
    elevation: 'glass',
  },
  {
    id: 'bold',
    name: 'Punch',
    tagline: 'High-contrast & loud',
    accent: '#f43f5e',
    algorithm: 'tailwind',
    radius: 1,
    density: 'default',
    elevation: 'depth',
  },
]

export function PresetsButton() {
  const [open, setOpen] = useState(false)
  const { setDesignSystem } = useDesignSystem()

  function apply(preset: Preset) {
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density: preset.density,
        tokens: {
          ...prev.tokens,
          [RADIUS_FACTOR_VAR]: String(preset.radius),
          [ELEVATION_STYLE_VAR]: preset.elevation,
        },
        color: {
          ...base,
          algorithm: preset.algorithm,
          seeds: {
            ...base.seeds,
            accent: preset.accent,
            ...(preset.neutral ? { neutral: preset.neutral } : {}),
          },
        },
      }
    })
    setOpen(false)
  }

  return (
    <>
      <Button
        size="sm"
        variant="quiet"
        onPress={() => setOpen(true)}
        className="gap-1.5 max-sm:hidden"
      >
        <LayoutGridIcon />
        Presets
      </Button>

      <Modal isOpen={open} onOpenChange={setOpen} isDismissable>
        <DialogContent className="flex max-h-[80vh] w-full max-w-2xl flex-col gap-4 p-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-semibold">Start from a preset</h2>
            <p className="text-[13px] text-fg-muted">
              A complete, opinionated system — fork one and make it yours.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
            {PRESETS.map((preset) => (
              <ButtonPrimitives.Button
                key={preset.id}
                onPress={() => apply(preset)}
                className="group/preset flex flex-col gap-3 rounded-xl border p-3 text-left focus-reset transition-colors hover:border-fg-muted/30 hover:bg-neutral focus-visible:focus-ring"
              >
                {/* Mini specimen — accent + radius + a faux control. */}
                <div className="flex flex-col gap-2 rounded-lg border bg-card p-2.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="size-5 rounded-full border"
                      style={{ backgroundColor: preset.accent }}
                    />
                    <span className="h-2 flex-1 rounded-full bg-fg-muted/20" />
                  </div>
                  <span
                    className="h-6 w-full"
                    style={{
                      backgroundColor: preset.accent,
                      borderRadius: `calc(0.5rem * ${preset.radius})`,
                    }}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-medium">{preset.name}</span>
                  <span className="text-[11px] leading-snug text-fg-muted">
                    {preset.tagline}
                  </span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {[preset.algorithm, preset.density].map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          'rounded-full bg-neutral px-1.5 py-0.5 text-[9px] tracking-wide text-fg-muted uppercase',
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                </div>
              </ButtonPrimitives.Button>
            ))}
          </div>
        </DialogContent>
      </Modal>
    </>
  )
}
