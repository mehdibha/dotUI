'use client'

import { DicesIcon, Redo2Icon, RotateCcwIcon, Undo2Icon } from 'lucide-react'

import { siteConfig } from '@/config/site'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button, buttonStyles } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorField } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { DialogContent } from '@/registry/ui/dialog'
import { Input } from '@/registry/ui/input'
import { Popover } from '@/registry/ui/popover'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { GitHubIcon } from '@/components/icons/github'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme-toggle'

import { useDesignSystem } from '../preset'
import { CommandPalette } from './command-palette'
import { Segmented } from './controls'
import { useStudioActions } from './hooks'
import { useStudio } from './store'
import { useHistory } from './use-history'

/**
 * The builder's own top bar — it replaces the global site nav on /create so the
 * studio reads as a focused "app" inside dotUI, not a second bar stacked over
 * the marketing chrome. It stays visually continuous with the site header
 * (same --header-height, sticky, blur-free, the Logo linking home for a smooth
 * exit, the same ThemeToggle / GitHub buttons) while swapping the docs nav for
 * the builder's genuinely-primary controls: brand identity, ⌘K, re-roll +
 * undo/redo, and the Quick ↔ Studio depth switch. Secondary controls stay in
 * the panels; the export payoff keeps its dedicated footer.
 */
export function StudioTopBar() {
  const { name, setName, depth, setDepth } = useStudio()
  const { reroll, reset } = useStudioActions()
  const { canUndo, canRedo, undo, redo } = useHistory()

  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) w-full shrink-0 items-center gap-2 border-b bg-bg px-4 sm:gap-3 sm:px-6">
      {/* Left: exit to the site, then the system's identity */}
      <Logo />
      <div className="mx-1 hidden h-5 w-px bg-border sm:block" />
      <BrandSwatch />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="System name"
        spellCheck={false}
        className="max-w-44 min-w-0 flex-1 truncate rounded-sm bg-transparent text-sm font-semibold outline-none focus-visible:bg-neutral focus-visible:px-1.5 sm:max-w-56"
      />

      {/* Right: primary actions + continuity bits */}
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <CommandPalette compact />

        {/* History + shuffle — power actions; also reachable via ⌘K, so they
            fold away on the narrowest screens to keep the bar uncluttered. */}
        <div className="hidden shrink-0 items-center gap-0.5 sm:flex">
          <IconButton label="Re-roll the system" onPress={reroll}>
            <DicesIcon />
          </IconButton>
          <IconButton label="Undo" onPress={undo} isDisabled={!canUndo}>
            <Undo2Icon />
          </IconButton>
          <IconButton label="Redo" onPress={redo} isDisabled={!canRedo}>
            <Redo2Icon />
          </IconButton>
          <IconButton label="Reset to default" onPress={reset}>
            <RotateCcwIcon />
          </IconButton>
        </div>

        <div className="mx-0.5 hidden h-5 w-px bg-border md:block" />

        <div className="hidden w-40 md:block">
          <Segmented
            ariaLabel="Depth"
            value={depth}
            onChange={setDepth}
            options={[
              { value: 'quick', label: 'Quick' },
              { value: 'studio', label: 'Studio' },
            ]}
          />
        </div>

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
        <ThemeToggle variant="quiet" size="sm" isIconOnly />
      </div>
    </header>
  )
}

function IconButton({
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

/** Live brand-color swatch — edit the accent from the top bar. */
function BrandSwatch() {
  const { designSystem, setColorSeed } = useDesignSystem()
  const accent =
    designSystem.color?.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent
  return (
    <ColorPicker
      value={accent}
      onChange={(c) => setColorSeed('accent', c.toString('hex'))}
    >
      <Button
        isIconOnly
        size="sm"
        aria-label="Brand color"
        className="size-7 shrink-0 overflow-hidden p-0"
      >
        <span className="block size-full" style={{ backgroundColor: accent }} />
      </Button>
      <Popover>
        <DialogContent className="flex flex-col gap-2">
          <div className="flex gap-2">
            <ColorArea
              colorSpace="hsb"
              xChannel="saturation"
              yChannel="brightness"
            />
            <ColorSlider
              orientation="vertical"
              colorSpace="hsb"
              channel="hue"
              className="h-auto self-stretch"
            />
          </div>
          <ColorField aria-label="Hex" className="w-full">
            <Input size="sm" className="w-full" />
          </ColorField>
        </DialogContent>
      </Popover>
    </ColorPicker>
  )
}
