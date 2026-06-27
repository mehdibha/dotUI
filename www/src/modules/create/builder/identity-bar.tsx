'use client'

import { useEffect, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  MoonIcon,
  Redo2Icon,
  SearchIcon,
  SunIcon,
  Undo2Icon,
} from 'lucide-react'
import { useTheme } from 'starter-themes'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Kbd } from '@/registry/ui/kbd'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

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

/* ------------------------------- identity bar ----------------------------- */

export function IdentityBar() {
  const { designSystem } = useDesignSystem()
  const { detail, setDetail, setCmdkOpen, systemName, setSystemName } =
    useBuilderUi()
  const { resolvedTheme, setTheme } = useTheme()
  const { canUndo, canRedo, undo, redo } = useHistory()

  const accent =
    (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ??
    DEFAULT_COLOR_CONFIG.seeds.accent

  return (
    <div className="shrink-0 border-b">
      <div className="flex h-12 items-center gap-2 px-2.5">
        <Swatch color={accent} className="size-5 rounded-[6px]" />
        <input
          value={systemName}
          onChange={(e) => setSystemName(e.target.value)}
          aria-label="System name"
          spellCheck={false}
          className="min-w-0 flex-1 truncate rounded-sm bg-transparent text-sm font-medium text-fg outline-none focus-visible:bg-neutral focus-visible:px-1.5 focus-visible:py-0.5"
        />
        <ContrastDot className="mx-0.5" />
        <div className="flex shrink-0 items-center">
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
            <TooltipContent>Toggle light / dark</TooltipContent>
          </Tooltip>
          <Tooltip delay={300}>
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label="Search controls"
              onPress={() => setCmdkOpen(true)}
            >
              <SearchIcon />
            </Button>
            <TooltipContent>
              <span className="flex items-center gap-1.5">
                Search <Kbd>⌘K</Kbd>
              </span>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Speed switch — one schema, two altitudes. A pure view toggle over the
          panel chrome; it never resets or branches the design system. */}
      <div className="px-3 pb-2.5">
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
    </div>
  )
}
