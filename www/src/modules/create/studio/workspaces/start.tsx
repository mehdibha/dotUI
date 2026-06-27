'use client'

import {
  ImageIcon,
  PaletteIcon,
  RulerIcon,
  ShapesIcon,
  SparklesIcon,
  TypeIcon,
  WandSparklesIcon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { FileTrigger } from '@/registry/ui/file-trigger'

import { RADIUS_FACTOR_VAR } from '../../layout'
import { useDesignSystem } from '../../preset'
import { BrandSeed } from '../color-controls'
import { useStudio } from '../context'
import { FONT_HEADING_VAR } from '../tokens'
import { GroupLabel, WorkspaceHeader } from '../ui'
import { VIBES, type Vibe, matchVibe, useApplyVibe, useReroll } from '../vibes'

export function StartWorkspace() {
  const { designSystem } = useDesignSystem()
  const reroll = useReroll()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const radius = designSystem.tokens[RADIUS_FACTOR_VAR] ?? '1'
  const activeVibe = matchVibe(
    config.seeds.accent,
    radius,
    designSystem.density,
  )

  return (
    <div className="flex flex-col gap-6">
      <WorkspaceHeader
        icon={SparklesIcon}
        title="Start"
        description="One brand color in — a complete, on-brand system out. Tune any detail after."
      />

      {/* The magic seed */}
      <div className="flex flex-col gap-2.5 rounded-xl border bg-neutral/30 p-3">
        <BrandSeed />
        <div className="grid grid-cols-2 gap-2">
          <FileTrigger
            acceptedFileTypes={['image/*']}
            onSelect={() => reroll()}
          >
            <Button size="sm" variant="default" className="w-full">
              <ImageIcon data-icon-start="" />
              From image
            </Button>
          </FileTrigger>
          <Button
            size="sm"
            variant="default"
            className="w-full"
            onPress={reroll}
          >
            <WandSparklesIcon data-icon-start="" />
            Surprise me
          </Button>
        </div>
        <p className="px-0.5 text-xs leading-snug text-fg-muted">
          Ramps, surfaces, borders and text colors all derive from this — with
          accessible contrast guaranteed.
        </p>
      </div>

      {/* Vibe gallery */}
      <div className="flex flex-col gap-2.5">
        <GroupLabel>Start from a vibe</GroupLabel>
        <div className="grid grid-cols-2 gap-2">
          {VIBES.map((vibe) => (
            <VibeCard
              key={vibe.id}
              vibe={vibe}
              active={activeVibe === vibe.id}
            />
          ))}
        </div>
      </div>

      <GlanceSummary />
    </div>
  )
}

function VibeCard({ vibe, active }: { vibe: Vibe; active: boolean }) {
  const applyVibe = useApplyVibe()
  const gap =
    vibe.density === 'compact' ? 2 : vibe.density === 'default' ? 3 : 5
  return (
    <ButtonPrimitives.Button
      onPress={() => applyVibe(vibe)}
      className={cn(
        'group flex flex-col gap-2.5 rounded-lg border p-2.5 text-left focus-reset transition focus-visible:focus-ring active:scale-[0.98]',
        active ? 'border-primary bg-primary/5' : 'hover:bg-neutral',
      )}
    >
      {/* Mini specimen */}
      <div className="flex items-center justify-between">
        <span
          className="flex size-8 items-center justify-center text-sm font-semibold text-white ring-1 ring-black/10 ring-inset"
          style={{
            backgroundColor: vibe.accent,
            borderRadius: `calc(0.5rem * ${vibe.radius})`,
          }}
        >
          Aa
        </span>
        <div className="flex flex-col items-end" style={{ gap }}>
          <span className="h-[2px] w-6 rounded-full bg-fg-muted/50" />
          <span className="h-[2px] w-6 rounded-full bg-fg-muted/50" />
          <span className="h-[2px] w-4 rounded-full bg-fg-muted/50" />
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium">{vibe.label}</span>
        <span className="text-[11px] leading-tight text-fg-muted">
          {vibe.blurb}
        </span>
      </div>
    </ButtonPrimitives.Button>
  )
}

/** "Foundations at a glance" — a live summary that jumps to each workspace. */
function GlanceSummary() {
  const { designSystem } = useDesignSystem()
  const { goTo } = useStudio()
  const config = designSystem.color ?? DEFAULT_COLOR_CONFIG
  const radius = Number.parseFloat(
    designSystem.tokens[RADIUS_FACTOR_VAR] ?? '1',
  )
  const font = designSystem.tokens[FONT_HEADING_VAR] ?? 'Geist'

  return (
    <div className="flex flex-col gap-2.5">
      <GroupLabel>At a glance</GroupLabel>
      <div className="grid grid-cols-2 gap-2">
        <GlanceTile
          icon={PaletteIcon}
          label="Accent"
          onPress={() => goTo('color')}
        >
          <span
            className="size-4 rounded ring-1 ring-black/10 ring-inset"
            style={{ backgroundColor: config.seeds.accent }}
          />
          <span className="truncate font-mono text-xs">
            {config.seeds.accent}
          </span>
        </GlanceTile>
        <GlanceTile
          icon={PaletteIcon}
          label="Base"
          onPress={() => goTo('color')}
        >
          <span
            className="size-4 rounded ring-1 ring-black/10 ring-inset"
            style={{ backgroundColor: config.seeds.neutral }}
          />
          <span className="truncate font-mono text-xs">
            {config.seeds.neutral}
          </span>
        </GlanceTile>
        <GlanceTile
          icon={TypeIcon}
          label="Font"
          onPress={() => goTo('typography')}
        >
          <span className="truncate text-xs font-medium">{font}</span>
        </GlanceTile>
        <GlanceTile
          icon={RulerIcon}
          label="Density"
          onPress={() => goTo('spacing')}
        >
          <span className="truncate text-xs font-medium capitalize">
            {designSystem.density}
          </span>
        </GlanceTile>
        <GlanceTile
          icon={ShapesIcon}
          label="Radius"
          onPress={() => goTo('shape')}
        >
          <div
            className="size-4 border-2 border-fg-muted/60"
            style={{ borderRadius: `calc(0.4rem * ${radius})` }}
          />
          <span className="font-mono text-xs tabular-nums">
            {radius.toFixed(2)}×
          </span>
        </GlanceTile>
      </div>
    </div>
  )
}

function GlanceTile({
  icon: Icon,
  label,
  onPress,
  children,
}: {
  icon: typeof PaletteIcon
  label: string
  onPress: () => void
  children: React.ReactNode
}) {
  return (
    <ButtonPrimitives.Button
      onPress={onPress}
      className="flex flex-col gap-1.5 rounded-lg border p-2.5 text-left focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring"
    >
      <span className="flex items-center gap-1.5 text-[10px] tracking-wide text-fg-muted uppercase">
        <Icon className="size-3" />
        {label}
      </span>
      <span className="flex items-center gap-1.5">{children}</span>
    </ButtonPrimitives.Button>
  )
}
