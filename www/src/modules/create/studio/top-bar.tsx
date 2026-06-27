'use client'

import { useEffect, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  DicesIcon,
  MoreHorizontalIcon,
  RotateCcwIcon,
  Undo2Icon,
} from 'lucide-react'

import { siteConfig } from '@/config/site'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button, buttonStyles } from '@/registry/ui/button'
import { Menu, MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { GitHubIcon } from '@/components/icons/github'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme-toggle'

import { useDesignSystem } from '../preset'
import { useStudioActions } from './actions'
import { CommandPalette } from './command'
import { Segmented } from './primitives'
import { useStudio } from './store'

const routeApi = getRouteApi('/_app/create')

/* ----------------------------------------------------------------------------
 * The /create top bar — the builder's own app-shell header. It replaces the
 * global site nav on /create only (the site links + "Search docs" are
 * irrelevant inside the builder) while staying visually continuous with it:
 * same `--header-height`, sticky, the Logo (links home for a two-way exit),
 * the same button language, and the ThemeToggle on the right.
 *
 * It holds the builder's genuinely-primary controls — system name, Simple/Pro
 * posture, ⌘K, undo and the surprise/reset macros — so the editor panel below
 * never stacks a second bar of its own.
 * -------------------------------------------------------------------------- */
export function StudioTopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) w-full shrink-0 items-center gap-2 border-b bg-bg px-3 sm:px-4">
      <Logo />
      <div className="mx-1 h-5 w-px shrink-0 bg-border max-sm:hidden" />
      <SystemName />

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <PostureToggle />
        <div className="flex items-center gap-0.5">
          <CommandPalette />
          <UndoButton />
          <MacrosMenu />
        </div>
        <div className="mx-0.5 h-5 w-px shrink-0 bg-border max-sm:hidden" />
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

/* ------------------------------ System name ----------------------------- */

function SystemName() {
  const { name, setName } = useStudio()
  const { designSystem } = useDesignSystem()
  const accent =
    (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ?? '#6366f1'

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <span
        className="size-5 shrink-0 rounded-md ring-1 ring-black/10 ring-inset"
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
  )
}

/* ---------------------------- Posture toggle ---------------------------- */

function PostureToggle() {
  const { level, setLevel } = useStudio()
  return (
    <Segmented
      ariaLabel="Editing mode"
      value={level}
      onChange={setLevel}
      options={[
        { value: 'simple', label: 'Simple' },
        { value: 'pro', label: 'Pro' },
      ]}
      className="w-auto *:flex-none max-sm:hidden"
    />
  )
}

/* ------------------------------ Macros menu ----------------------------- */

function MacrosMenu() {
  const { reroll, resetAll } = useStudioActions()
  return (
    <Menu>
      <Button size="sm" variant="quiet" isIconOnly aria-label="More">
        <MoreHorizontalIcon />
      </Button>
      <Popover placement="bottom end" className="min-w-44">
        <MenuContent>
          <MenuItem onAction={reroll}>
            <DicesIcon />
            Surprise me
          </MenuItem>
          <MenuItem onAction={resetAll}>
            <RotateCcwIcon />
            Reset to defaults
          </MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}

/* --------------------------------- Undo --------------------------------- */

/**
 * Walks back through past preset values. Every edit lands in `?preset=` with
 * `replace:true`, so the browser back button can't undo edits — we keep our own
 * stack. Watching `preset` captures changes from every editor regardless of
 * which `useDesignSystem()` instance made them.
 */
function UndoButton() {
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const historyRef = useRef<(string | undefined)[]>([])
  const prevRef = useRef<string | undefined>(preset)
  const undoingRef = useRef(false)
  const [canUndo, setCanUndo] = useState(false)

  useEffect(() => {
    if (prevRef.current === preset) return
    if (undoingRef.current) {
      undoingRef.current = false
    } else {
      historyRef.current.push(prevRef.current)
      setCanUndo(true)
    }
    prevRef.current = preset
  }, [preset])

  function undo() {
    if (historyRef.current.length === 0) return
    const previous = historyRef.current.pop()
    undoingRef.current = true
    navigate({
      search: (prev) => ({ ...prev, preset: previous }),
      replace: true,
    })
    setCanUndo(historyRef.current.length > 0)
  }

  return (
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
  )
}
