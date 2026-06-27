'use client'

import { useEffect, useRef, useState } from 'react'
import { getRouteApi } from '@tanstack/react-router'
import { SparklesIcon } from 'lucide-react'

import { PreviewPanel } from '../preview/preview-panel'
import { AiBar } from './ai-bar'
import { Inspector } from './inspector'
import { Rail, type DomainId } from './rail'

const routeApi = getRouteApi('/_app/create')

/**
 * The `/create?studio` experience: a canvas-first builder shell — a persistent
 * axis rail, a wider inspector on a macro→micro spine, the live preview, and a
 * docked AI bar — composed from the existing config panels and preview iframe.
 */
export function StudioExperience() {
  const [domain, setDomain] = useState<DomainId>('style')

  // Undo history. Every design change is encoded into `?preset=` with
  // `replace: true`, so the browser back button can't step through edits — we
  // keep our own stack and walk back through it (same approach as the shipped
  // customizer panel).
  const { preset } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
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

  return (
    <>
      {/* Desktop-only: the three-zone studio needs width the shipped /create
          doesn't, so below `lg` it points to a wider screen rather than cramming. */}
      <div className="flex h-[calc(100svh-var(--header-height))] flex-col items-center justify-center gap-2 p-8 text-center lg:hidden">
        <SparklesIcon className="size-6 text-primary" />
        <p className="text-sm font-medium">
          Studio is built for a wider screen
        </p>
        <p className="max-w-xs text-sm text-fg-muted">
          Open this experiment on a desktop, or use the standard editor for now.
        </p>
      </div>

      <div className="hidden h-[calc(100svh-var(--header-height))] min-h-0 flex-1 gap-3 p-4 pt-2 lg:flex lg:gap-4 lg:p-6 lg:pt-2">
        <Rail domain={domain} onSelect={setDomain} />
        <Inspector domain={domain} canUndo={canUndo} onUndo={undo} />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <PreviewPanel className="flex-1" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center p-4">
            <AiBar className="pointer-events-auto" />
          </div>
        </div>
      </div>
    </>
  )
}
