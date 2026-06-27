import { useEffect, useRef, useState } from 'react'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { z } from 'zod'

import { cn } from '@/registry/lib/utils'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { LabExperience } from '@/modules/create/panel'
import { DEFAULTS, useDesignSystem } from '@/modules/create/preset'
import {
  loadStoredPreset,
  saveStoredPreset,
} from '@/modules/create/preset/storage'
import { PreviewPanel } from '@/modules/create/preview/preview-panel'
import { StudioChromeProvider } from '@/modules/create/studio/chrome'
import { StudioPanel } from '@/modules/create/studio/studio-panel'
import { CreateTopBar } from '@/modules/create/studio/top-bar'

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
  const { lab, preset } = Route.useSearch()
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

  // The builder owns its top bar: the global site Header is suppressed on /create
  // (see _app/route.tsx), and CreateTopBar takes its place — same height token,
  // sticky, Logo / GitHub / ThemeToggle — carrying the builder's primary actions
  // (depth switch, surprise-me, undo, reset) from StudioChromeProvider.
  return (
    <StudioChromeProvider>
      <CreateTopBar />
      {lab ? (
        // Opt-in exploration of the redesigned control panel + floating panel lab.
        <LabExperience />
      ) : (
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
              if (next === 'customize' || next === 'preview')
                setMobilePane(next)
            }}
            className="w-full shrink-0 *:flex-1 lg:hidden"
          >
            <ToggleButton id="customize">Customize</ToggleButton>
            <ToggleButton id="preview">Preview</ToggleButton>
          </ToggleButtonGroup>
          <StudioPanel
            className={cn(mobilePane === 'preview' && 'max-lg:hidden')}
          />
          <PreviewPanel
            className={cn(mobilePane === 'customize' && 'max-lg:hidden')}
          />
        </div>
      )}
    </StudioChromeProvider>
  )
}
