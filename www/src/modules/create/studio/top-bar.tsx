'use client'

import { useEffect } from 'react'
import { ShuffleIcon, SparklesIcon, Undo2Icon } from 'lucide-react'

import { siteConfig } from '@/config/site'
import { Button, buttonStyles } from '@/registry/ui/button'
import { Kbd } from '@/registry/ui/kbd'
import { GitHubIcon } from '@/components/icons/github'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme-toggle'

import { useDesignSystem } from '../preset'
import { focusAiBar } from './ai-focus'
import { shuffleSystem } from './vibes'

/**
 * The studio's own top bar, in place of the global site nav on `/create`. It
 * sits at the shared `--header-height` and reuses the site Logo + ThemeToggle +
 * GitHub link so stepping into the builder reads as the same product in a
 * focused mode — not a separate app. The Logo links home for a two-way exit.
 *
 * The site nav links + "Search docs" are dropped (irrelevant inside the
 * builder) and replaced by this builder's genuinely-primary actions: undo,
 * re-roll, and the "Ask dotUI" command that focuses the docked AI bar (⌘K).
 */
export function StudioTopBar({
  canUndo,
  onUndo,
}: {
  canUndo: boolean
  onUndo: () => void
}) {
  const { setDesignSystem } = useDesignSystem()

  // ⌘K / Ctrl+K jumps focus to the docked AI bar — the builder's command surface.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        focusAiBar()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) w-full shrink-0 items-center justify-between gap-3 border-b bg-bg/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <Logo />
        <span className="rounded-md border bg-card px-1.5 py-0.5 text-[11px] font-medium text-fg-muted max-sm:hidden">
          Studio
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            isIconOnly
            variant="quiet"
            aria-label="Re-roll the system"
            onPress={() => shuffleSystem(setDesignSystem)}
          >
            <ShuffleIcon />
          </Button>
          <Button
            size="sm"
            isIconOnly
            variant="quiet"
            aria-label="Undo"
            onPress={onUndo}
            isDisabled={!canUndo}
          >
            <Undo2Icon />
          </Button>
        </div>

        <Button
          size="sm"
          variant="default"
          onPress={focusAiBar}
          className="md:text-fg-muted"
        >
          <SparklesIcon data-icon-start="" className="text-primary" />
          <span className="max-sm:hidden">Ask dotUI</span>
          <Kbd className="max-sm:hidden">⌘ K</Kbd>
        </Button>

        <div className="mx-0.5 h-5 w-px bg-border max-sm:hidden" />

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
