import { useEffect, useRef, useState } from 'react'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { z } from 'zod'

import { cn } from '@/registry/lib/utils'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { CustomizerPanel } from '@/modules/create/customizer-panel'
import { LabExperience } from '@/modules/create/panel'
import { DEFAULTS, useDesignSystem } from '@/modules/create/preset'
import {
  loadStoredPreset,
  saveStoredPreset,
} from '@/modules/create/preset/storage'
import { PreviewPanel } from '@/modules/create/preview/preview-panel'
import { StudioExperience } from '@/modules/create/studio'

type MobilePane = 'customize' | 'preview'

export const createSearchSchema = z.object({
  panel: z.string().optional().catch(undefined),
  preview: z.string().default('cards').catch('cards'),
  preset: z.string().optional().catch(undefined),
  // Opt-in flag for the in-progress control-panel redesign + panel lab. Keeps
  // the shipped /create untouched while the new IA is explored at /create?lab=true.
  // Coerced boolean: the search parser reads bare `1`/`true` as non-strings, so a
  // plain `z.string()` would reject them and the param would be dropped.
  lab: z.coerce.boolean().optional().catch(undefined),
  // Opt-in flag for the AI-native "Studio" rethink of /create. Same coercion
  // rationale as `lab`; keeps the shipped page and the lab untouched.
  studio: z.coerce.boolean().optional().catch(undefined),
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
  const { lab, studio, preset } = Route.useSearch()
  const { designSystem, setDesignSystem } = useDesignSystem()
  // Below `lg` the customizer and the live preview can't sit side by side (the iframe
  // would be a ~15px sliver), so they collapse into a single switchable pane toggled
  // by the segmented control. Both stay mounted — only CSS-hidden, never unmounted —
  // so switching never reloads the preview. Above `lg` this state is inert; both show.
  const [mobilePane, setMobilePane] = useState<MobilePane>('customize')

  // The user's selected preset is persisted in localStorage so every docs
  // component demo renders in it. Seed the editor from it on open (unless a
  // shared ?preset= link is being viewed), then persist back as it's edited.
  const seededFromStorage = useRef(false)
  useEffect(() => {
    if (seededFromStorage.current) return
    seededFromStorage.current = true
    if (preset) return // a shared / deep-linked preset wins over the saved one
    const stored = loadStoredPreset()
    if (stored !== DEFAULTS) setDesignSystem(stored)
  }, [preset, setDesignSystem])

  const skipFirstPersist = useRef(true)
  useEffect(() => {
    // Skip the initial value so merely opening a shared link doesn't overwrite
    // the saved preset; persist once the user actually changes something.
    if (skipFirstPersist.current) {
      skipFirstPersist.current = false
      return
    }
    saveStoredPreset(designSystem)
  }, [designSystem])

  // Opt-in exploration of the redesigned control panel + floating panel lab.
  if (lab) return <LabExperience />

  // Opt-in AI-native rethink of the builder.
  if (studio) return <StudioExperience />

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
      <CustomizerPanel
        className={cn(mobilePane === 'preview' && 'max-lg:hidden')}
      />
      <PreviewPanel
        className={cn(mobilePane === 'customize' && 'max-lg:hidden')}
      />
    </div>
  )
}
