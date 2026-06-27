'use client'

import { useState } from 'react'
import { DicesIcon, RotateCcwIcon, SparklesIcon, Undo2Icon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { useReroll } from '../panel/macros'
import { Segmented } from '../panel/primitives'
import { useDesignSystem } from '../preset'
import { AiDock } from './ai/ai-dock'
import { CommandBar } from './ai/command-bar'
import { Inspector } from './inspector'
import { Stage } from './stage'
import { StudioProvider, useStudio } from './store'

/* ----------------------------------------------------------------------------
 * Atelier — a rethink of /create as a three-zone instrument:
 *   edit (inspector) · see (stage + spec sheet) · converse (AI dock + command
 *   bar). Reuses the real design-system state and live preview; adds an expanded
 *   axis catalog, a spec-sheet view, and an AI design assistant. Behind
 *   `?atelier=true` so the shipped builder and the panel lab are untouched.
 *
 * Named "Atelier" to coexist with the separate "Studio" left-panel redesign
 * landing on main — distinct folder, flag and entry point, zero file overlap.
 * -------------------------------------------------------------------------- */

export function AtelierExperience() {
  return (
    <StudioProvider>
      <StudioLayout />
    </StudioProvider>
  )
}

function StudioLayout() {
  const { aiOpen } = useStudio()
  return (
    <div className="flex h-[calc(100svh-var(--header-height))] min-h-0 flex-col">
      <TopBar />
      <div className="flex min-h-0 flex-1 gap-3 p-4 pt-0 lg:gap-4 lg:p-5 lg:pt-0">
        <Inspector className="w-[360px] max-lg:hidden" />
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <Stage />
          <CommandBar />
        </div>
        <AiDock
          className={cn(
            'transition-all duration-300 max-lg:hidden',
            aiOpen ? 'w-[360px]' : 'pointer-events-none w-0 border-0 opacity-0',
          )}
        />
      </div>
    </div>
  )
}

function TopBar() {
  const { stageView, setStageView, aiOpen, setAiOpen, canUndo, undo, reset } =
    useStudio()
  const { designSystem } = useDesignSystem()
  const reroll = useReroll()
  const [name, setName] = useState('Untitled system')

  const accent =
    (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ?? '#6366f1'

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 lg:px-5">
      <span
        className="size-6 shrink-0 rounded-md ring-1 ring-black/10 ring-inset"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="System name"
        spellCheck={false}
        className="w-44 min-w-0 truncate rounded-sm bg-transparent text-sm font-semibold outline-none focus-visible:bg-neutral focus-visible:px-1.5 focus-visible:py-0.5"
      />

      <div className="mx-auto w-56 max-md:hidden">
        <Segmented
          ariaLabel="Stage view"
          value={stageView}
          onChange={(v) => setStageView(v as 'preview' | 'spec')}
          options={[
            { value: 'preview', label: 'Preview' },
            { value: 'spec', label: 'Spec sheet' },
          ]}
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Tooltip delay={300}>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            onPress={undo}
            isDisabled={!canUndo}
            aria-label="Undo"
          >
            <Undo2Icon />
          </Button>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>
        <Tooltip delay={300}>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            onPress={reset}
            aria-label="Reset"
          >
            <RotateCcwIcon />
          </Button>
          <TooltipContent>Reset to defaults</TooltipContent>
        </Tooltip>
        <Tooltip delay={300}>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            onPress={reroll}
            aria-label="Shuffle"
          >
            <DicesIcon />
          </Button>
          <TooltipContent>Surprise me</TooltipContent>
        </Tooltip>

        <div className="mx-1 h-5 w-px bg-border" />

        <Button
          size="sm"
          variant={aiOpen ? 'primary' : 'default'}
          onPress={() => setAiOpen(!aiOpen)}
        >
          <SparklesIcon /> Assistant
        </Button>
      </div>
    </div>
  )
}
