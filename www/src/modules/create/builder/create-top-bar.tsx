'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { Redo2Icon, SearchIcon, Undo2Icon } from 'lucide-react'

import { siteConfig } from '@/config/site'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button, buttonStyles } from '@/registry/ui/button'
import { Kbd } from '@/registry/ui/kbd'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'
import { GitHubIcon } from '@/components/icons/github'
import { Logo } from '@/components/layout/logo'
import { ThemeToggle } from '@/components/theme-toggle'

import { Segmented } from '../panel/primitives'
import { useDesignSystem } from '../preset'
import { Swatch } from './atoms'
import { ContrastDot } from './color'
import { useBuilderUi } from './use-builder-ui'

const routeApi = getRouteApi('/_app/create')

/* --------------------------------- history -------------------------------- */

/**
 * Two-stack undo/redo over the encoded ?preset=. Edits write the preset with
 * replace:true (no native forward history), so we keep our own stacks: a new
 * user edit clears redo, undo pushes onto redo, redo pushes back onto undo.
 */
function useHistory() {
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const undoStack = useRef<(string | undefined)[]>([])
  const redoStack = useRef<(string | undefined)[]>([])
  const prev = useRef<string | undefined>(preset)
  const replaying = useRef(false)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  useEffect(() => {
    if (prev.current === preset) return
    if (replaying.current) {
      replaying.current = false
    } else {
      undoStack.current.push(prev.current)
      redoStack.current = []
      setCanUndo(true)
      setCanRedo(false)
    }
    prev.current = preset
  }, [preset])

  function undo() {
    if (undoStack.current.length === 0) return
    const target = undoStack.current.pop()
    redoStack.current.push(preset)
    replaying.current = true
    navigate({ search: (s) => ({ ...s, preset: target }), replace: true })
    setCanUndo(undoStack.current.length > 0)
    setCanRedo(true)
  }

  function redo() {
    if (redoStack.current.length === 0) return
    const target = redoStack.current.pop()
    undoStack.current.push(preset)
    replaying.current = true
    navigate({ search: (s) => ({ ...s, preset: target }), replace: true })
    setCanRedo(redoStack.current.length > 0)
    setCanUndo(true)
  }

  return { canUndo, canRedo, undo, redo }
}

/* ------------------------------- shared shell ----------------------------- */

/**
 * The builder's own top bar — the global site nav steps aside on /create so this
 * is the single bar at the top of the page. It stays visually continuous with
 * the site header (same --header-height, sticky, Logo→home, GitHub, ThemeToggle,
 * shared button styles) so entering and leaving the builder feels like the same
 * product in a focused mode, not a separate app. `children` are the builder's
 * own controls, dropped between the home logo and the continuity rail.
 */
function TopBarShell({ children }: { children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) w-full shrink-0 items-center gap-3 border-b bg-bg px-4 lg:px-6">
      <Logo />
      {children}
      {/* Continuity rail — the same affordances the site header keeps on the
          right (GitHub, theme), so leaving the builder feels seamless. */}
      <div className="ml-auto flex shrink-0 items-center gap-1">
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
        <ThemeToggle variant="quiet" isIconOnly size="sm" />
      </div>
    </header>
  )
}

/* ------------------------------ create top bar ---------------------------- */

/**
 * The default builder bar. Between the home logo and the continuity rail it
 * carries the genuinely-primary builder controls: the system identity (swatch +
 * name + contrast health), undo/redo, the ⌘K command palette, and the
 * Essentials ⇄ Everything speed switch. Secondary controls stay in the panels.
 */
export function CreateTopBar() {
  const { designSystem } = useDesignSystem()
  const { detail, setDetail, setCmdkOpen, systemName, setSystemName } =
    useBuilderUi()
  const { canUndo, canRedo, undo, redo } = useHistory()

  const accent =
    (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ??
    DEFAULT_COLOR_CONFIG.seeds.accent

  return (
    <TopBarShell>
      <span aria-hidden className="h-5 w-px bg-border max-sm:hidden" />

      {/* Live system identity. */}
      <div className="flex min-w-0 items-center gap-2 max-sm:hidden">
        <Swatch color={accent} className="size-5 rounded-[6px]" />
        <input
          value={systemName}
          onChange={(e) => setSystemName(e.target.value)}
          aria-label="System name"
          spellCheck={false}
          className="w-40 min-w-0 truncate rounded-sm bg-transparent text-sm font-medium text-fg outline-none focus-visible:bg-neutral focus-visible:px-1.5 focus-visible:py-0.5"
        />
        <ContrastDot />
      </div>

      {/* Primary builder actions, pushed to sit beside the continuity rail. */}
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <div className="flex items-center">
          <Tooltip delay={300}>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label="Undo"
              isDisabled={!canUndo}
              onPress={undo}
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
              aria-label="Redo"
              isDisabled={!canRedo}
              onPress={redo}
            >
              <Redo2Icon />
            </Button>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>

        <Button
          size="sm"
          variant="default"
          aria-label="Search controls"
          onPress={() => setCmdkOpen(true)}
          className="text-fg-muted max-sm:size-8 max-sm:px-0"
        >
          <SearchIcon />
          <span className="max-sm:hidden">Search controls</span>
          <Kbd className="max-sm:hidden">⌘K</Kbd>
        </Button>

        {/* Speed switch — one schema, two altitudes. A pure view toggle over the
            panel chrome; it never resets or branches the design system. */}
        <div className="w-44 max-md:hidden">
          <Segmented
            ariaLabel="Detail level"
            value={detail}
            onChange={setDetail}
            options={[
              { value: 'essentials', label: 'Essentials' },
              { value: 'everything', label: 'Everything' },
            ]}
          />
        </div>

        <span aria-hidden className="ml-0.5 h-5 w-px bg-border max-sm:hidden" />
      </div>
    </TopBarShell>
  )
}

/**
 * Minimal continuity bar for the opt-in `/create?lab` exploration, which has its
 * own panel chrome and so needs only the home logo + continuity rail (no builder
 * controls) to stay visually consistent with the site header.
 */
export function CreateLabTopBar() {
  return <TopBarShell />
}
