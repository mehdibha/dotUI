'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  CheckIcon,
  SearchIcon,
  ShuffleIcon,
  Undo2Icon,
  XIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { CodeOptionsDialog } from '../code-options'
import { ExportFooter } from '../export'
import { useDesignSystem } from '../preset'
import { CommandPalette } from './command-palette'
import { ComponentsZone } from './components-zone'
import { FOUNDATION_AXES, FoundationsZone } from './foundations'
import { IntakeGate } from './intake'
import { RADIUS_FACTOR_VAR } from './tokens'

const routeApi = getRouteApi('/_app/create')

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

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

export function BuilderPanel({ className }: { className?: string }) {
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { designSystem, setDesignSystem } = useDesignSystem()

  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(['f:colors']),
  )
  const [showIntake, setShowIntake] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [ribbonDismissed, setRibbonDismissed] = useState(false)
  const [name, setName] = useState('Untitled system')
  const scrollRef = useRef<HTMLDivElement>(null)

  // First-run: open the intake when landing with no preset (a shared ?preset=
  // link skips it). Captured once so picking a colour mid-intake doesn't dismiss.
  const inited = useRef(false)
  useEffect(() => {
    if (inited.current) return
    inited.current = true
    if (!preset) setShowIntake(true)
  }, [preset])

  /* ------------------------------- Undo -------------------------------- */
  const historyRef = useRef<(string | undefined)[]>([])
  const prevPresetRef = useRef<string | undefined>(preset)
  const isUndoingRef = useRef(false)
  const [canUndo, setCanUndo] = useState(false)
  useEffect(() => {
    if (prevPresetRef.current === preset) return
    if (isUndoingRef.current) {
      isUndoingRef.current = false
    } else {
      historyRef.current.push(prevPresetRef.current)
      setCanUndo(true)
    }
    prevPresetRef.current = preset
  }, [preset])

  function undo() {
    if (historyRef.current.length === 0) return
    const previous = historyRef.current.pop()
    isUndoingRef.current = true
    navigate({
      search: (prev) => ({ ...prev, preset: previous }),
      replace: true,
    })
    setCanUndo(historyRef.current.length > 0)
  }

  function shuffle() {
    const accent = pick(SHUFFLE_ACCENTS)
    const radius = pick(SHUFFLE_RADII)
    const density = pick(SHUFFLE_DENSITIES)
    setDesignSystem((prev) => {
      const base = prev.color ?? DEFAULT_COLOR_CONFIG
      return {
        ...prev,
        density,
        tokens: { ...prev.tokens, [RADIUS_FACTOR_VAR]: radius },
        color: { ...base, seeds: { ...base.seeds, accent } },
      }
    })
  }

  /* --------------------------- Open / accordion ------------------------ */
  // One-open accordion within each namespace ('f:' foundations, 'c:' components):
  // opening a row collapses its siblings so the column never runs away.
  const toggle = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        return next
      }
      const ns = id.split(':')[0]
      for (const open of next) {
        if (open.split(':')[0] === ns) next.delete(open)
      }
      next.add(id)
      return next
    })
  }, [])

  const jump = useCallback((rowId: string) => {
    setOpenIds((prev) => {
      if (prev.has(rowId)) return prev
      const next = new Set(prev)
      const ns = rowId.split(':')[0]
      for (const open of next) if (open.split(':')[0] === ns) next.delete(open)
      next.add(rowId)
      return next
    })
    requestAnimationFrame(() => {
      document
        .querySelector(`[data-row="${rowId}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  /* ------------------------------- ⌘K ---------------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCmdOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const accent =
    (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ?? '#6366f1'

  return (
    <div
      className={cn(
        'relative flex w-full flex-1 flex-col overflow-hidden rounded-xl border bg-card lg:w-[360px] lg:flex-none lg:shrink-0',
        className,
      )}
    >
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b px-2.5">
        <Tooltip delay={300}>
          <button
            type="button"
            onClick={() => setShowIntake(true)}
            aria-label="Brand source"
            className="size-5 shrink-0 rounded-[6px] focus-reset ring-1 ring-black/10 transition-transform ring-inset hover:scale-110 focus-visible:focus-ring"
            style={{ backgroundColor: accent }}
          />
          <TooltipContent>Brand · reopen intake</TooltipContent>
        </Tooltip>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="System name"
          spellCheck={false}
          className="min-w-0 flex-1 truncate rounded-sm bg-transparent text-sm font-medium outline-none focus-visible:bg-neutral focus-visible:px-1"
        />
        <button
          type="button"
          onClick={() => setCmdOpen(true)}
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
            onPress={shuffle}
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
            onPress={undo}
            isDisabled={!canUndo}
          >
            <Undo2Icon />
          </Button>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>
      </div>

      {/* Body */}
      <AnimatePresence mode="wait" initial={false}>
        {showIntake ? (
          <IntakeGate key="intake" onGenerate={() => setShowIntake(false)} />
        ) : (
          <motion.div
            key="spine"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div
              ref={scrollRef}
              className="scrollbar-none flex-1 overflow-y-auto p-2"
            >
              {!ribbonDismissed && (
                <CompletionRibbon onDismiss={() => setRibbonDismissed(true)} />
              )}

              <FoundationsZone openIds={openIds} onToggle={toggle} />

              <div className="mt-4 mb-1 flex items-center gap-2 px-3">
                <span className="text-[10px] font-semibold tracking-widest text-fg-muted/70 uppercase">
                  Components
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <ComponentsZone openIds={openIds} onToggle={toggle} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {!showIntake && (
        <div className="flex shrink-0 flex-col gap-2 border-t p-3">
          <CodeOptionsDialog />
          <ExportFooter />
        </div>
      )}

      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onJump={jump}
      />
    </div>
  )
}

function CompletionRibbon({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-1 mb-2 flex items-center gap-2 rounded-lg border border-success/30 bg-success-muted/40 px-3 py-2 text-xs"
    >
      <span className="grid size-4 shrink-0 place-items-center rounded-full bg-success text-fg-on-success">
        <CheckIcon className="size-2.5" />
      </span>
      <span className="flex-1 text-fg-muted">
        Complete system — refine anything below.
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="grid size-4 place-items-center rounded text-fg-muted hover:text-fg"
      >
        <XIcon className="size-3" />
      </button>
    </motion.div>
  )
}

// re-export for any external nav needs
export { FOUNDATION_AXES }
