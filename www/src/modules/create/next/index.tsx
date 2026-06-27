'use client'

import { useEffect, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import {
  DicesIcon,
  MoonIcon,
  Share2Icon,
  SparklesIcon,
  SunIcon,
  Undo2Icon,
} from 'lucide-react'
import { useTheme } from 'starter-themes'

import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { RADIUS_FACTOR_VAR } from '../layout'
import { useDesignSystem } from '../preset'
import { PreviewPanel } from '../preview/preview-panel'
import { readAccent } from './ai'
import { Assistant } from './assistant'
import { Inspector } from './inspector'
import { Rail, type SectionId } from './rail'

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

export function BuilderNext() {
  const [section, setSection] = useState<SectionId>('theme')
  const [assistantOpen, setAssistantOpen] = useState(true)

  // ⌘K / Ctrl-K opens the assistant.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setAssistantOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex h-[calc(100svh-var(--header-height))] min-h-0 flex-col">
      <TopBar onOpenAssistant={() => setAssistantOpen(true)} />
      <div className="flex min-h-0 flex-1">
        <Rail
          active={section}
          onSelect={setSection}
          onOpenAssistant={() => setAssistantOpen(true)}
          assistantOpen={assistantOpen}
        />
        <Inspector section={section} onAsk={() => setAssistantOpen(true)} />
        <PreviewPanel className="m-3 rounded-xl border" />
        {assistantOpen && <Assistant onClose={() => setAssistantOpen(false)} />}
      </div>
    </div>
  )
}

function TopBar({ onOpenAssistant }: { onOpenAssistant: () => void }) {
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const { designSystem, setDesignSystem } = useDesignSystem()
  const { resolvedTheme, setTheme } = useTheme()
  const [name, setName] = useState('Untitled system')
  const accent = readAccent(designSystem)

  // Undo history. Design edits write `?preset=` with `replace: true`, so the browser
  // back button can't step through them — we keep our own stack and walk it back.
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

  function reroll() {
    const accentPick = pick(SHUFFLE_ACCENTS)
    const radius = pick(SHUFFLE_RADII)
    const density = pick(SHUFFLE_DENSITIES)
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

  function share() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b px-3">
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
        className="w-40 min-w-0 truncate rounded-sm bg-transparent text-sm font-medium outline-none focus-visible:bg-neutral focus-visible:px-1.5 focus-visible:py-0.5"
      />

      {/* AI compose bar — the front door. */}
      <button
        type="button"
        onClick={onOpenAssistant}
        className="mx-auto flex h-9 w-full max-w-md items-center gap-2 rounded-md border bg-neutral px-3 text-sm text-fg-muted transition-colors hover:border-fg-muted/40 hover:bg-bg"
      >
        <SparklesIcon className="size-4 text-primary" />
        <span className="truncate">Describe a vibe, paste a URL, or ask…</span>
        <kbd className="ml-auto rounded border bg-card px-1.5 font-mono text-[10px] text-fg-muted">
          ⌘K
        </kbd>
      </button>

      <div className="flex shrink-0 items-center gap-0.5">
        <Tooltip>
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
          <TooltipContent>Toggle mode</TooltipContent>
        </Tooltip>
        <Tooltip>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Re-roll"
            onPress={reroll}
          >
            <DicesIcon />
          </Button>
          <TooltipContent>Re-roll the system</TooltipContent>
        </Tooltip>
        <Tooltip>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Undo"
            onPress={undo}
            isDisabled={!canUndo}
          >
            <Undo2Icon />
          </Button>
          <TooltipContent>Undo</TooltipContent>
        </Tooltip>
        <Tooltip>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Share"
            onPress={share}
          >
            <Share2Icon />
          </Button>
          <TooltipContent>Copy share link</TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
