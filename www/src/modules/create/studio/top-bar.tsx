'use client'

/**
 * The /create top bar — replaces the global site nav on the builder route only.
 *
 * It stays visually continuous with the site header (same `--header-height`,
 * sticky, the same Logo / GitHub / ThemeToggle on the flanks, the same blur ramp
 * on scroll) so stepping from the site into the builder reads as "same product,
 * focused mode" rather than launching a different app. In place of the Docs /
 * Components / Search-docs nav it carries the builder's genuinely-primary actions:
 * the Simple/Pro depth switch, surprise-me, undo, and reset — lifted out of the
 * panel so /create shows one cohesive bar, never two stacked ones.
 */

import { RotateCcwIcon, ShuffleIcon, Undo2Icon } from 'lucide-react'

import { siteConfig } from '@/config/site'
import { cn } from '@/registry/lib/utils'
import { Button, buttonStyles } from '@/registry/ui/button'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { GitHubIcon } from '@/components/icons/github'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme-toggle'

import { useStudioChrome } from './chrome'

export function CreateTopBar() {
  const { pro, setPro, canUndo, undo, reset, shuffle } = useStudioChrome()

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-(--header-height) w-full shrink-0 items-center justify-between gap-3 border-b bg-bg/80 px-4 backdrop-blur-md lg:px-6',
      )}
    >
      {/* Left — the wordmark links home so the builder has a two-way exit. */}
      <Logo />

      {/* Center — the builder's depth switch, the one control that reshapes the
          whole panel. Hidden on the narrowest screens to keep the bar from
          crowding; it still lives in the panel chrome there. */}
      <ToggleButtonGroup
        aria-label="Detail level"
        selectionMode="single"
        disallowEmptySelection
        size="sm"
        selectedKeys={[pro ? 'pro' : 'simple']}
        onSelectionChange={(keys) => {
          const next = keys.values().next().value
          if (next) setPro(next === 'pro')
        }}
        className="max-sm:hidden"
      >
        <ToggleButton id="simple">Simple</ToggleButton>
        <ToggleButton id="pro">Pro</ToggleButton>
      </ToggleButtonGroup>

      {/* Right — primary builder actions, then the site continuity controls. */}
      <div className="flex items-center gap-1">
        <Tooltip delay={300}>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            onPress={shuffle}
            aria-label="Surprise me"
          >
            <ShuffleIcon />
          </Button>
          <TooltipContent>Surprise me</TooltipContent>
        </Tooltip>
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
            aria-label="Reset to defaults"
          >
            <RotateCcwIcon />
          </Button>
          <TooltipContent>Reset all</TooltipContent>
        </Tooltip>

        <div className="mx-1 h-5 w-px bg-border" aria-hidden />

        <a
          aria-label="GitHub"
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          data-icon-only=""
          className={buttonStyles({ variant: 'quiet', size: 'sm' })}
        >
          <GitHubIcon />
        </a>
        <ThemeToggle isIconOnly variant="quiet" size="sm" />
      </div>
    </header>
  )
}
