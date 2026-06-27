'use client'

/**
 * Studio — the redesigned /create control surface.
 *
 * Replaces the stack navigator with an instrument: a domain rail on the left, a
 * Simple/Pro depth switch in the header, command search across every axis, and a
 * footer that exports the result anywhere. The whole thing is one promise made
 * operable — brand in, complete system out, with as much or as little control as
 * the user wants.
 */

import { useEffect, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { RotateCcwIcon, ShuffleIcon, Undo2Icon } from 'lucide-react'
import { AnimatePresence, motion, type Transition } from 'motion/react'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Input } from '@/registry/ui/input'
import { SearchField } from '@/registry/ui/search-field'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { CodeOptionsDialog } from '../code-options'
import { ExportFooter } from '../export'
import { RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'
import {
  DEFAULT_SECTION,
  findSection,
  searchSections,
  STUDIO_SECTIONS,
} from './registry'
import { StudioModeProvider } from './widgets'

const routeApi = getRouteApi('/_app/create')

/* "Surprise me" pools — the always-legible axes, each curated so any pick lands. */
const SHUFFLE_ACCENTS = [
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#f43f5e',
  '#f59e0b',
  '#22c55e',
  '#14b8a6',
  '#06b6d4',
]
const SHUFFLE_RADII = ['0', '0.5', '1', '1.5', '2']
const SHUFFLE_DENSITIES = ['compact', 'default', 'comfortable'] as const

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

const fade: Transition = { duration: 0.18, ease: [0.32, 0.72, 0, 1] }

export function StudioPanel({ className }: { className?: string }) {
  const { panel, preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { designSystem, setDesignSystem } = useDesignSystem()

  const [pro, setPro] = useState(false)
  const [query, setQuery] = useState('')

  const active = findSection(panel ?? DEFAULT_SECTION)
  const accent =
    designSystem.color?.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent

  /* ----- Undo history. Every edit lands in `?preset=` with replace:true, so the
     browser back button can't step through it. We keep our own stack, watching
     `preset` to catch changes from every section regardless of which one made it. */
  const history = useRef<(string | undefined)[]>([])
  const prevPreset = useRef<string | undefined>(preset)
  const undoing = useRef(false)
  const [canUndo, setCanUndo] = useState(false)

  useEffect(() => {
    if (prevPreset.current === preset) return
    if (undoing.current) {
      undoing.current = false
    } else {
      history.current.push(prevPreset.current)
      setCanUndo(true)
    }
    prevPreset.current = preset
  }, [preset])

  function goTo(id: string) {
    setQuery('')
    navigate({ search: (prev) => ({ ...prev, panel: id }) })
  }

  function undo() {
    if (history.current.length === 0) return
    const previous = history.current.pop()
    undoing.current = true
    navigate({
      search: (prev) => ({ ...prev, preset: previous }),
      replace: true,
    })
    setCanUndo(history.current.length > 0)
  }

  function reset() {
    navigate({
      search: (prev) => ({ ...prev, preset: undefined }),
      replace: true,
    })
  }

  /* Shuffle the legible axes in one update so Undo reverts it in a single step. */
  function shuffle() {
    const accentPick = pickRandom(SHUFFLE_ACCENTS)
    const radius = pickRandom(SHUFFLE_RADII)
    const density = pickRandom(SHUFFLE_DENSITIES)
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density,
        tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: radius },
        color: { ...base, seeds: { ...base.seeds, accent: accentPick } },
      }
    })
  }

  const results = searchSections(query)
  const searching = query.trim().length > 0

  return (
    <div
      className={cn(
        'relative flex w-full flex-1 flex-col overflow-hidden rounded-xl border bg-card lg:w-[360px] lg:flex-none lg:shrink-0',
        className,
      )}
    >
      {/* Header */}
      <div className="flex flex-col gap-2.5 border-b p-2.5">
        <div className="flex items-center justify-between gap-2 pl-1">
          <div className="flex items-center gap-2">
            <span
              className="size-4 rounded-full ring-1 ring-border ring-inset"
              style={{ backgroundColor: accent }}
              aria-hidden
            />
            <span className="text-sm font-semibold tracking-tight">Studio</span>
          </div>
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
          >
            <ToggleButton id="simple">Simple</ToggleButton>
            <ToggleButton id="pro">Pro</ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div className="flex items-center gap-1.5">
          <SearchField
            aria-label="Search controls"
            value={query}
            onChange={setQuery}
            className="flex-1"
          >
            <Input size="sm" placeholder="Search any control…" />
          </SearchField>
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
        </div>
      </div>

      {/* Body: domain rail + content */}
      <div className="flex min-h-0 flex-1">
        <nav
          aria-label="Sections"
          className="scrollbar-none flex w-[52px] shrink-0 flex-col items-center gap-0.5 overflow-y-auto border-r py-2"
        >
          {STUDIO_SECTIONS.map((section, i) => {
            const prev = STUDIO_SECTIONS[i - 1]
            const isActive = !searching && section.id === active.id
            return (
              <div key={section.id} className="contents">
                {prev && prev.group !== section.group && (
                  <span className="my-1 h-px w-5 bg-border" aria-hidden />
                )}
                <div className="relative flex w-full justify-center">
                  {isActive && (
                    <span
                      className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-primary"
                      aria-hidden
                    />
                  )}
                  <Tooltip delay={300}>
                    <Button
                      size="sm"
                      isIconOnly
                      variant="quiet"
                      onPress={() => goTo(section.id)}
                      aria-label={section.label}
                      className={cn(
                        'size-9',
                        isActive
                          ? 'bg-neutral text-fg'
                          : 'text-fg-muted hover:text-fg',
                      )}
                    >
                      <section.icon />
                    </Button>
                    <TooltipContent placement="right">
                      {section.label}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            )
          })}
        </nav>

        <div className="min-w-0 flex-1 overflow-y-auto overscroll-contain p-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={searching ? 'search' : active.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={fade}
            >
              {searching ? (
                <SearchResults query={query} results={results} onPick={goTo} />
              ) : (
                <StudioModeProvider pro={pro}>
                  <active.Content />
                </StudioModeProvider>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer — export anywhere. */}
      <div className="flex flex-col gap-2 border-t p-3">
        <CodeOptionsDialog />
        <ExportFooter />
      </div>
    </div>
  )
}

function SearchResults({
  query,
  results,
  onPick,
}: {
  query: string
  results: ReturnType<typeof searchSections>
  onPick: (id: string) => void
}) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 py-10 text-center">
        <p className="text-sm font-medium">No matches</p>
        <p className="text-xs text-fg-muted">
          Nothing matches “{query.trim()}”. Try a token or control name.
        </p>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
        {results.length} {results.length === 1 ? 'section' : 'sections'}
      </p>
      <div className="flex flex-col gap-1.5">
        {results.map((section) => {
          const hit = section.keywords.find((k) =>
            k.includes(query.trim().toLowerCase()),
          )
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onPick(section.id)}
              className="flex items-center gap-3 rounded-lg border p-3 text-left focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring"
            >
              <section.icon className="size-4 shrink-0 text-fg-muted" />
              <span className="flex-1 text-sm font-medium">
                {section.label}
              </span>
              {hit && (
                <span className="rounded bg-neutral px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">
                  {hit}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
