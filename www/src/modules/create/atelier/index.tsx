'use client'

import { useState } from 'react'
import { DicesIcon, RotateCcwIcon, SparklesIcon, Undo2Icon } from 'lucide-react'

import { siteConfig } from '@/config/site'
import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button, buttonStyles } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { GitHubIcon } from '@/components/icons/github'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme-toggle'

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
  // No global site Header above us anymore (suppressed in _app for ?atelier),
  // so the shell owns the full viewport: our own header-height top bar plus the
  // remaining space for the three zones.
  return (
    <div className="flex h-svh min-h-0 flex-col">
      <TopBar />
      <div className="flex min-h-0 flex-1 gap-3 p-4 lg:gap-4 lg:p-5">
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
    // One cohesive bar, visually continuous with the site Header it replaces on
    // /create: same height token, sticky top, same px-6 gutter and button
    // language. The Logo links home so the site ⇄ builder transition is two-way.
    <header className="sticky top-0 z-30 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-bg/80 px-4 backdrop-blur-md lg:px-6">
      <Logo />

      <div className="mx-1 h-5 w-px bg-border max-sm:hidden" />

      <span
        className="size-6 shrink-0 rounded-md ring-1 ring-black/10 ring-inset max-sm:hidden"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="System name"
        spellCheck={false}
        className="w-32 min-w-0 truncate rounded-sm bg-transparent text-sm font-semibold outline-none focus-visible:bg-neutral focus-visible:px-1.5 focus-visible:py-0.5 lg:w-44"
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

        <div className="mx-1 h-5 w-px bg-border max-sm:hidden" />

        <a
          aria-label="GitHub"
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          data-icon-only=""
          className={cn(
            buttonStyles({ variant: 'quiet', size: 'sm' }),
            'max-sm:hidden',
          )}
        >
          <GitHubIcon />
        </a>
        <ThemeToggle variant="quiet" size="sm" isIconOnly />
      </div>
    </header>
  )
}
