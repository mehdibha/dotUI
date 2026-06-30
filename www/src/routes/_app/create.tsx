import { useEffect, useRef, useState } from 'react'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { z } from 'zod'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { BuilderPanel, CreateTopBar } from '@/modules/create/builder'
import { RADIUS_FACTOR_VAR } from '@/modules/create/builder/tokens'
import { DEFAULTS, useDesignSystem } from '@/modules/create/preset'
import {
  loadStoredPreset,
  saveStoredPreset,
} from '@/modules/create/preset/storage'
import { PreviewPanel } from '@/modules/create/preview/preview-panel'

type MobilePane = 'customize' | 'preview'

export const createSearchSchema = z.object({
  preview: z.string().default('cards').catch('cards'),
  preset: z.string().optional().catch(undefined),
})

const searchDefaults = { preview: 'cards' }

export const Route = createFileRoute('/_app/create')({
  validateSearch: createSearchSchema,
  search: {
    middlewares: [stripSearchParams(searchDefaults)],
  },
  component: CreatePage,
})

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

function CreatePage() {
  const { preset } = Route.useSearch()
  const navigate = Route.useNavigate()
  const { designSystem, setDesignSystem } = useDesignSystem()
  // Below `lg` the builder and the live preview can't sit side by side, so they
  // collapse into a single switchable pane. Both stay mounted (only CSS-hidden)
  // so switching never reloads the preview.
  const [mobilePane, setMobilePane] = useState<MobilePane>('customize')

  // Builder chrome owned by the page so the top bar (replacing the site nav) and
  // the panel body stay in sync.
  const [name, setName] = useState('Untitled system')
  const [showIntake, setShowIntake] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)

  // Seed the editor from the saved preset on open (unless a shared ?preset= link
  // is being viewed), then persist back as it's edited.
  const seededFromStorage = useRef(false)
  useEffect(() => {
    if (seededFromStorage.current) return
    seededFromStorage.current = true
    if (preset) return
    const stored = loadStoredPreset()
    if (stored !== DEFAULTS) setDesignSystem(stored)
  }, [preset, setDesignSystem])

  const skipFirstPersist = useRef(true)
  useEffect(() => {
    if (skipFirstPersist.current) {
      skipFirstPersist.current = false
      return
    }
    saveStoredPreset(designSystem)
  }, [designSystem])

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
    <>
      <CreateTopBar
        accent={accent}
        name={name}
        onNameChange={setName}
        onOpenIntake={() => setShowIntake(true)}
        onOpenCommand={() => setCmdOpen(true)}
        onShuffle={shuffle}
        onUndo={undo}
        canUndo={canUndo}
      />
      <div className="flex h-[calc(100svh-var(--header-height))] min-h-0 flex-1 flex-col gap-3 p-4 pt-2 lg:flex-row lg:gap-6 lg:p-6 lg:pt-2">
        {/* Mobile-only view switcher — hidden once the two panes fit side by side. */}
        <ToggleButtonGroup
          aria-label="Editor view"
          selectionMode="single"
          disallowEmptySelection
          size="sm"
          selectedKeys={[mobilePane]}
          onSelectionChange={(keys) => {
            const next = keys.values().next().value
            if (next === 'customize' || next === 'preview') setMobilePane(next)
          }}
          className="w-full shrink-0 *:flex-1 lg:hidden"
        >
          <ToggleButton id="customize">Customize</ToggleButton>
          <ToggleButton id="preview">Preview</ToggleButton>
        </ToggleButtonGroup>
        <BuilderPanel
          className={cn(mobilePane === 'preview' && 'max-lg:hidden')}
          showIntake={showIntake}
          onCloseIntake={() => setShowIntake(false)}
          cmdOpen={cmdOpen}
          onCloseCommand={() => setCmdOpen(false)}
        />
        <PreviewPanel
          className={cn(mobilePane === 'customize' && 'max-lg:hidden')}
        />
      </div>
    </>
  )
}
