import { useEffect, useRef, useState } from 'react'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { z } from 'zod'

import { cn } from '@/registry/lib/utils'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { BuilderPanel } from '@/modules/create/builder'
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

function CreatePage() {
  const { preset } = Route.useSearch()
  const { designSystem, setDesignSystem } = useDesignSystem()
  // Below `lg` the builder and the live preview can't sit side by side, so they
  // collapse into a single switchable pane. Both stay mounted (only CSS-hidden)
  // so switching never reloads the preview.
  const [mobilePane, setMobilePane] = useState<MobilePane>('customize')

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

  return (
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
      />
      <PreviewPanel
        className={cn(mobilePane === 'customize' && 'max-lg:hidden')}
      />
    </div>
  )
}
