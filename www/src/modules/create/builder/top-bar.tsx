'use client'

import { SearchIcon, ShuffleIcon, Undo2Icon } from 'lucide-react'

import { siteConfig } from '@/config/site'
import { cn } from '@/registry/lib/utils'
import { Button, buttonStyles } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { GitHubIcon } from '@/components/icons/github'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme-toggle'

/**
 * The /create top bar — replaces the global site nav on this route only.
 *
 * It owns the builder's primary chrome (brand intake, system name, ⌘K, shuffle,
 * undo) while staying visually continuous with the site header: same
 * `--header-height`, sticky positioning, the Logo (linking home for a two-way
 * exit), the ThemeToggle, GitHub link, and shared button styles. Secondary
 * controls (per-axis tweaks, code style, export) stay in the panel below.
 */
export function CreateTopBar({
  accent,
  name,
  onNameChange,
  onOpenIntake,
  onOpenCommand,
  onShuffle,
  onUndo,
  canUndo,
}: {
  accent: string
  name: string
  onNameChange: (name: string) => void
  onOpenIntake: () => void
  onOpenCommand: () => void
  onShuffle: () => void
  onUndo: () => void
  canUndo: boolean
}) {
  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) w-full shrink-0 items-center gap-2 border-b bg-bg/80 px-4 backdrop-blur-md md:px-6">
      {/* Left: identity — logo exits back to the site, swatch + name are the system. */}
      <Logo className="max-sm:[&_[data-wordmark]]:hidden" />
      <span className="mx-1 h-5 w-px shrink-0 bg-border max-sm:hidden" />
      <Tooltip delay={300}>
        <button
          type="button"
          onClick={onOpenIntake}
          aria-label="Brand source"
          className="size-5 shrink-0 rounded-[6px] focus-reset ring-1 ring-black/10 transition-transform ring-inset hover:scale-110 focus-visible:focus-ring"
          style={{ backgroundColor: accent }}
        />
        <TooltipContent>Brand · reopen intake</TooltipContent>
      </Tooltip>
      <input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        aria-label="System name"
        spellCheck={false}
        className="max-w-48 min-w-0 flex-1 truncate rounded-sm bg-transparent text-sm font-medium outline-none focus-visible:bg-neutral focus-visible:px-1"
      />

      {/* Right: builder actions + the continuity controls carried over from the site nav. */}
      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={onOpenCommand}
          className="flex items-center gap-1.5 rounded-md border bg-bg px-2 py-1 text-xs text-fg-muted focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring"
        >
          <SearchIcon className="size-3" />
          <kbd className="font-mono text-[10px]">⌘K</kbd>
        </button>
        <Tooltip delay={300}>
          <Button
            size="sm"
            isIconOnly
            variant="quiet"
            aria-label="Shuffle"
            onPress={onShuffle}
          >
            <ShuffleIcon />
          </Button>
          <TooltipContent>Surprise me</TooltipContent>
        </Tooltip>
        <Tooltip delay={300}>
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
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>
        <span className="mx-1 h-5 w-px shrink-0 bg-border max-sm:hidden" />
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
        <ThemeToggle isIconOnly variant="quiet" size="sm" />
      </div>
    </header>
  )
}
