import { useEffect, useRef } from 'react'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { z } from 'zod'

import { LabExperience } from '@/modules/create/panel'
import { DEFAULTS, useDesignSystem } from '@/modules/create/preset'
import {
  loadStoredPreset,
  saveStoredPreset,
} from '@/modules/create/preset/storage'
import { Studio } from '@/modules/create/studio'

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

  // Opt-in exploration of the legacy data-driven control panel + floating lab.
  if (lab) return <LabExperience />

  return <Studio />
}
