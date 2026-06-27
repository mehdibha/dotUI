'use client'

import { useState } from 'react'
import { ChevronLeftIcon, SparklesIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'

import { ChartColorsConfig } from '../chart-colors'
import { CodeOptionsDialog } from '../code-options'
import { ColorsConfig } from '../colors'
import {
  AllComponentsView,
  ComponentDetailView,
  getComponentDisplayName,
} from '../components'
import {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  CursorConfig,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
} from '../cursor'
import { ExportFooter } from '../export'
import { IconographyConfig } from '../iconography'
import {
  DEFAULT_RADIUS_FACTOR,
  DensityConfig,
  RADIUS_FACTOR_VAR,
  RadiusConfig,
} from '../layout'
import { useDesignSystem } from '../preset'
import type { Density } from '../preset'
import { TypographyConfig } from '../typography'
import { readAccent } from './ai'
import {
  BordersAxis,
  ElevationAxis,
  FocusAxis,
  MotionAxis,
  SpacingAxis,
  SurfacesAxis,
  TypographyDepth,
} from './axes'
import { ALL_SECTIONS, type SectionId } from './rail'

export function Inspector({
  section,
  onAsk,
}: {
  section: SectionId
  onAsk: () => void
}) {
  const def = ALL_SECTIONS.find((s) => s.id === section)
  return (
    <div className="flex w-72 shrink-0 flex-col border-r bg-card max-lg:hidden">
      <div className="flex items-center justify-between border-b px-3 py-2.5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium">{def?.label}</h2>
          {def?.isNew && (
            <span className="rounded bg-primary/10 px-1.5 py-px text-[10px] font-medium text-primary">
              New
            </span>
          )}
        </div>
        <ButtonPrimitives.Button
          onPress={onAsk}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-primary focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring"
        >
          <SparklesIcon className="size-3.5" />
          Ask
        </ButtonPrimitives.Button>
      </div>

      <div className="scrollbar-none flex-1 overflow-y-auto p-4">
        <SectionPanel section={section} />
      </div>

      <div className="flex flex-col gap-2 border-t p-3">
        <CodeOptionsDialog />
        <ExportFooter />
      </div>
    </div>
  )
}

function SectionPanel({ section }: { section: SectionId }) {
  const { designSystem, setToken } = useDesignSystem()

  switch (section) {
    case 'theme':
      return <ThemePanel />
    case 'color':
      return <ColorsConfig />
    case 'chart-colors':
      return <ChartColorsConfig />
    case 'typography':
      return (
        <div className="flex flex-col gap-5">
          <TypographyConfig />
          <div className="h-px bg-border" />
          <TypographyDepth />
        </div>
      )
    case 'icons':
      return <IconographyConfig />
    case 'radius':
      return (
        <RadiusConfig
          value={
            designSystem.tokens[RADIUS_FACTOR_VAR] ?? DEFAULT_RADIUS_FACTOR
          }
          onChange={(v) => setToken(RADIUS_FACTOR_VAR, v)}
        />
      )
    case 'spacing':
      return <SpacingAxis />
    case 'elevation':
      return <ElevationAxis />
    case 'motion':
      return <MotionAxis />
    case 'borders':
      return <BordersAxis />
    case 'focus':
      return <FocusAxis />
    case 'surfaces':
      return <SurfacesAxis />
    case 'cursor':
      return (
        <CursorConfig
          interactive={
            designSystem.tokens[CURSOR_INTERACTIVE_VAR] ??
            DEFAULT_CURSOR_INTERACTIVE
          }
          disabled={
            designSystem.tokens[CURSOR_DISABLED_VAR] ?? DEFAULT_CURSOR_DISABLED
          }
          onChange={setToken}
        />
      )
    case 'components':
      return <ComponentsPanel />
    case 'code':
      return (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-fg-muted">
            Shape the exported source so it reads like your codebase. Full
            options live in the dialog below.
          </p>
          <CodeOptionsDialog />
        </div>
      )
    default:
      return null
  }
}

/* --------------------------------- Theme --------------------------------- */

interface Personality {
  id: string
  label: string
  accent: string
  radius: string
  density: Density
}

const PERSONALITIES: Personality[] = [
  {
    id: 'minimal',
    label: 'Minimal',
    accent: '#171717',
    radius: '0.4',
    density: 'compact',
  },
  {
    id: 'corporate',
    label: 'Corporate',
    accent: '#2563eb',
    radius: '0.6',
    density: 'default',
  },
  {
    id: 'playful',
    label: 'Playful',
    accent: '#f43f5e',
    radius: '1.6',
    density: 'comfortable',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    accent: '#0f766e',
    radius: '0.25',
    density: 'comfortable',
  },
  {
    id: 'vivid',
    label: 'Vivid',
    accent: '#7c3aed',
    radius: '1',
    density: 'default',
  },
]

const BRAND_SWATCHES = [
  '#6366f1',
  '#5e6ad2',
  '#171717',
  '#2563eb',
  '#0f766e',
  '#f43f5e',
  '#f59e0b',
  '#06b6d4',
  '#22c55e',
]

function ThemePanel() {
  const { designSystem, setDesignSystem, setColorSeed, setDensity, setToken } =
    useDesignSystem()
  const accent = readAccent(designSystem)
  const radius = designSystem.tokens[RADIUS_FACTOR_VAR] ?? DEFAULT_RADIUS_FACTOR

  function applyPersonality(p: Personality) {
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density: p.density,
        tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: p.radius },
        color: { ...base, seeds: { ...base.seeds, accent: p.accent } },
      }
    })
  }

  const activePersonality = PERSONALITIES.find(
    (p) =>
      p.accent.toLowerCase() === accent.toLowerCase() &&
      p.radius === radius &&
      p.density === designSystem.density,
  )?.id

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-fg-muted">Brand color</span>
        <div className="flex flex-wrap gap-2">
          {BRAND_SWATCHES.map((c) => (
            <ButtonPrimitives.Button
              key={c}
              onPress={() => setColorSeed('accent', c)}
              aria-label={c}
              className={cn(
                'size-6 rounded-full border focus-reset transition-transform focus-visible:focus-ring',
                c.toLowerCase() === accent.toLowerCase()
                  ? 'ring-2 ring-fg ring-offset-2 ring-offset-card'
                  : 'hover:scale-110',
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-fg-muted">Personality</span>
        <div className="flex flex-wrap gap-1.5">
          {PERSONALITIES.map((p) => (
            <ButtonPrimitives.Button
              key={p.id}
              onPress={() => applyPersonality(p)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs focus-reset transition-colors focus-visible:focus-ring',
                activePersonality === p.id
                  ? 'border-transparent bg-primary text-fg-on-primary'
                  : 'hover:bg-neutral',
              )}
            >
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: p.accent }}
              />
              {p.label}
            </ButtonPrimitives.Button>
          ))}
        </div>
      </div>

      <RadiusConfig
        value={radius}
        onChange={(v) => setToken(RADIUS_FACTOR_VAR, v)}
      />

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-fg-muted">Density</span>
        <DensityConfig value={designSystem.density} onChange={setDensity} />
      </div>
    </div>
  )
}

/* ------------------------------- Components ------------------------------- */

function ComponentsPanel() {
  const { designSystem, setComponentParam } = useDesignSystem()
  const [selected, setSelected] = useState<string | null>(null)

  if (selected) {
    return (
      <div className="flex flex-col gap-2">
        <div className="-ml-1 flex items-center gap-2">
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            onPress={() => setSelected(null)}
            aria-label="Back"
            className="size-6"
          >
            <ChevronLeftIcon />
          </Button>
          <h3 className="text-sm font-medium">
            {getComponentDisplayName(selected)}
          </h3>
        </div>
        <ComponentDetailView
          componentName={selected}
          selectedParams={designSystem.componentParams[selected] ?? {}}
          onParamChange={(paramName, value) =>
            setComponentParam(selected, paramName, value)
          }
        />
      </div>
    )
  }

  return <AllComponentsView onSelect={setSelected} />
}
