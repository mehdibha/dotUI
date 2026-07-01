'use client'

import { SearchIcon, ShuffleIcon, Undo2Icon } from 'lucide-react'

import { siteConfig } from '@/config/site'
import { Button, buttonStyles } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { GitHubIcon } from '@/components/icons/github'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme-toggle'

import type { StudioMode } from './context'
import { Segmented } from './primitives'
import { useStudioShell } from './shell'

/**
 * The builder's own top bar — it stands in for the global site header on /create
 * only. It keeps the site's chrome language (same `--header-height`, sticky,
 * blurred backdrop, the Logo as a home link, the theme + GitHub controls) so
 * stepping into the builder reads as a focused mode of the same product, not a
 * separate app. Between those continuity anchors it carries the builder's
 * genuinely-primary controls: identity, undo, shuffle, ⌘K, and Simple/Pro.
 */
export function BuilderTopBar() {
  const {
    name,
    setName,
    accent,
    mode,
    setMode,
    canUndo,
    undo,
    shuffle,
    setSearchOpen,
  } = useStudioShell()

  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) w-full shrink-0 items-center gap-3 border-b bg-bg/80 px-3 backdrop-blur-md md:px-4">
      {/* Left: home anchor — the smooth way back out to the site. */}
      <div className="flex shrink-0 items-center">
        <Logo />
      </div>

      <div className="mx-1 h-5 w-px shrink-0 bg-border max-sm:hidden" />

      {/* Center-left: the system identity (accent + editable name). */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span
          className="size-5 shrink-0 rounded-[6px] ring-1 ring-black/15 ring-inset"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="System name"
          spellCheck={false}
          className="max-w-56 min-w-0 flex-1 truncate rounded-sm bg-transparent text-sm font-medium outline-none focus-visible:bg-neutral focus-visible:px-1.5 focus-visible:py-0.5"
        />
      </div>

      {/* Right: primary actions, then the site-continuity controls. */}
      <div className="flex shrink-0 items-center gap-1">
        <TopBarIcon label="Search (⌘K)" onPress={() => setSearchOpen(true)}>
          <SearchIcon />
        </TopBarIcon>
        <TopBarIcon label="Surprise me" onPress={shuffle}>
          <ShuffleIcon />
        </TopBarIcon>
        <TopBarIcon label="Undo" onPress={undo} isDisabled={!canUndo}>
          <Undo2Icon />
        </TopBarIcon>

        <div className="mx-1 h-5 w-px bg-border max-sm:hidden" />

        {/* Persona switch — the one toggle that serves both audiences. */}
        <div className="w-[136px] max-sm:hidden">
          <Segmented<StudioMode>
            ariaLabel="Detail level"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'simple', label: 'Simple' },
              { value: 'pro', label: 'Pro' },
            ]}
          />
        </div>

        <div className="mx-1 h-5 w-px bg-border" />

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

function TopBarIcon({
  label,
  onPress,
  isDisabled,
  children,
}: {
  label: string
  onPress: () => void
  isDisabled?: boolean
  children: React.ReactNode
}) {
  return (
    <Tooltip delay={300}>
      <Button
        size="sm"
        variant="quiet"
        isIconOnly
        onPress={onPress}
        isDisabled={isDisabled}
        aria-label={label}
      >
        {children}
      </Button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
