'use client'

import { DicesIcon, RotateCcwIcon, SearchIcon, Undo2Icon } from 'lucide-react'

import { siteConfig } from '@/config/site'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button, buttonStyles } from '@/registry/ui/button'
import { Kbd } from '@/registry/ui/kbd'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { GitHubIcon } from '@/components/icons/github'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme-toggle'

import { useDesignSystem } from '../preset'
import { useReset, useStudio, useUndo } from './context'
import { useReroll } from './vibes'

/**
 * The builder's own top bar — replaces the global site nav on `/create`.
 *
 * It owns the genuinely-primary builder controls (brand color, system name,
 * undo, surprise-me, reset, ⌘K) while staying visually continuous with the site
 * header: same `--header-height`, sticky, the Logo (linking home so users can
 * exit), the ThemeToggle and GitHub link. One cohesive bar — never two stacked.
 */
export function StudioTopBar() {
  const { name, setName, setCommandOpen, goTo } = useStudio()
  const { designSystem } = useDesignSystem()
  const { undo, canUndo } = useUndo()
  const reset = useReset()
  const reroll = useReroll()

  const accent =
    (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ?? '#6366f1'

  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) w-full shrink-0 items-center gap-2 border-b bg-bg px-4 md:gap-3 md:px-6">
      <Logo />
      <span aria-hidden className="h-5 w-px bg-border max-md:hidden" />

      {/* Identity: brand swatch + editable system name. */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
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
          className="max-w-56 min-w-0 flex-1 truncate rounded-sm bg-transparent text-sm font-medium outline-none focus-visible:bg-neutral focus-visible:px-1.5 focus-visible:py-0.5"
        />
      </div>

      {/* History + generation controls. */}
      <div className="flex shrink-0 items-center max-sm:hidden">
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
            aria-label="Surprise me"
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

      <span aria-hidden className="h-5 w-px bg-border max-sm:hidden" />

      <div className="flex shrink-0 items-center gap-2">
        <Button
          size="sm"
          variant="default"
          aria-label="Search controls"
          onPress={() => setCommandOpen(true)}
          className="text-fg-muted"
        >
          <SearchIcon className="sm:hidden" />
          <span className="max-sm:hidden">Search</span>
          <Kbd className="max-sm:hidden">⌘ K</Kbd>
        </Button>
        <a
          aria-label="GitHub"
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          data-icon-only=""
          className={buttonStyles({ variant: 'default', size: 'sm' })}
        >
          <GitHubIcon />
        </a>
        <ThemeToggle isIconOnly size="sm" variant="default" />
      </div>
    </header>
  )
}
