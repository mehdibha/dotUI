'use client'

import type { ReactNode } from 'react'
import { SparklesIcon, Undo2Icon } from 'lucide-react'

import { siteConfig } from '@/config/site'
import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button, buttonStyles } from '@/registry/ui/button'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { GitHubIcon } from '@/components/icons/github'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme-toggle'

import { useDesignSystem } from '../preset'
import { type Depth, useStudio } from './nav'

/* ------------------------------------------------------------------ *
 * CreateTopBar — the /create builder's own top bar.
 *
 * Replaces the global site nav on /create only (see _app/route.tsx) while
 * staying visually continuous with it: same `--header-height`, sticky top,
 * the site Logo (→ home, the smooth exit), the same GitHub link + theme
 * toggle, and the same button language. It carries the builder's genuinely-
 * primary controls — the system identity (accent dot + editable name), the
 * Quick/Pro depth switch, "Surprise me", and Undo — so the studio panel no
 * longer needs its own header bar (one cohesive bar, never two stacked).
 * ------------------------------------------------------------------ */

export function CreateTopBar() {
  const { name, setName, depth, setDepth, reroll, undo, canUndo } = useStudio()
  const { designSystem } = useDesignSystem()
  const accent = (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent

  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) w-full shrink-0 items-center gap-3 border-b px-4 sm:px-6">
      {/* Left: site Logo (exit → home) + system identity. */}
      <Logo />
      <span className="mx-1 h-5 w-px shrink-0 bg-border max-sm:hidden" />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span
          className="size-3 shrink-0 rounded-full ring-1 ring-black/10 ring-inset"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="System name"
          spellCheck={false}
          className="max-w-56 min-w-0 flex-1 rounded-sm bg-transparent text-sm font-semibold outline-none placeholder:text-fg-muted focus-visible:bg-neutral focus-visible:px-1"
        />
      </div>

      {/* Right: builder actions + the site continuity cluster. */}
      <div className="flex shrink-0 items-center gap-2">
        <ToggleButtonGroup
          aria-label="Detail level"
          selectionMode="single"
          disallowEmptySelection
          size="sm"
          selectedKeys={[depth]}
          onSelectionChange={(keys) => {
            const next = keys.values().next().value
            if (next === 'quick' || next === 'pro') setDepth(next as Depth)
          }}
          className="max-md:hidden"
        >
          <ToggleButton id="quick">Quick</ToggleButton>
          <ToggleButton id="pro">Pro</ToggleButton>
        </ToggleButtonGroup>
        <TopBarAction label="Surprise me" onPress={reroll}>
          <SparklesIcon />
        </TopBarAction>
        <TopBarAction label="Undo" onPress={undo} isDisabled={!canUndo}>
          <Undo2Icon />
        </TopBarAction>
        <span className="mx-0.5 h-5 w-px bg-border max-sm:hidden" />
        <a
          aria-label="GitHub"
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          data-icon-only=""
          className={cn(buttonStyles({ variant: 'default' }), 'max-sm:hidden')}
        >
          <GitHubIcon />
        </a>
        <ThemeToggle isIconOnly />
      </div>
    </header>
  )
}

function TopBarAction({
  label,
  onPress,
  isDisabled,
  children,
}: {
  label: string
  onPress: () => void
  isDisabled?: boolean
  children: ReactNode
}) {
  return (
    <Tooltip>
      <Button
        variant="quiet"
        isIconOnly
        aria-label={label}
        onPress={onPress}
        isDisabled={isDisabled}
      >
        {children}
      </Button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
