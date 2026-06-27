'use client'

import {
  DicesIcon,
  MoonIcon,
  RotateCcwIcon,
  SearchIcon,
  SunIcon,
  Undo2Icon,
} from 'lucide-react'
import { useTheme } from 'starter-themes'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Kbd } from '@/registry/ui/kbd'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { useDesignSystem } from '../preset'
import { useReset, useStudio, useUndo } from './context'
import { useReroll } from './vibes'

export function StudioHeader() {
  const { name, setName, setCommandOpen, goTo } = useStudio()
  const { designSystem } = useDesignSystem()
  const { resolvedTheme, setTheme } = useTheme()
  const { undo, canUndo } = useUndo()
  const reset = useReset()
  const reroll = useReroll()

  const accent =
    (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ?? '#6366f1'

  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b px-2.5">
      <Tooltip delay={300}>
        <button
          type="button"
          onClick={() => goTo('color')}
          aria-label="Brand color"
          className="size-5 shrink-0 rounded-md focus-reset ring-1 ring-black/10 ring-inset focus-visible:focus-ring"
          style={{ backgroundColor: accent }}
        />
        <TooltipContent>Brand color</TooltipContent>
      </Tooltip>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="System name"
        spellCheck={false}
        className="min-w-0 flex-1 truncate rounded-sm bg-transparent text-sm font-medium outline-none focus-visible:bg-neutral focus-visible:px-1.5 focus-visible:py-0.5"
      />

      <div className="flex shrink-0 items-center">
        <Tooltip delay={300}>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Search controls"
            onPress={() => setCommandOpen(true)}
          >
            <SearchIcon />
          </Button>
          <TooltipContent className="flex items-center gap-1.5">
            Search <Kbd>⌘K</Kbd>
          </TooltipContent>
        </Tooltip>
        <Tooltip delay={300}>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Undo"
            onPress={undo}
            isDisabled={!canUndo}
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
            aria-label="Toggle mode"
            onPress={() =>
              setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
          >
            {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </Button>
          <TooltipContent>Toggle mode</TooltipContent>
        </Tooltip>
        <Tooltip delay={300}>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Re-roll"
            onPress={reroll}
          >
            <DicesIcon />
          </Button>
          <TooltipContent>Surprise me</TooltipContent>
        </Tooltip>
        <Tooltip delay={300}>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Reset to defaults"
            onPress={reset}
          >
            <RotateCcwIcon />
          </Button>
          <TooltipContent>Reset to defaults</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
