import { useEffect, useRef, useState } from 'react'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { SlidersHorizontalIcon } from 'lucide-react'
import { z } from 'zod'

import { Button } from '@/registry/ui/button'
import { DialogContent } from '@/registry/ui/dialog'
import { Drawer, DrawerHandle } from '@/registry/ui/drawer'
import { ExportHeaderAction } from '@/modules/create/export'
import { CreatePanel } from '@/modules/create/panel'
import { DEFAULTS, useDesignSystem } from '@/modules/create/preset'
import {
  loadStoredPreset,
  saveStoredPreset,
} from '@/modules/create/preset/storage'
import { PreviewPanel } from '@/modules/create/preview/preview-panel'

export const createSearchSchema = z.object({
  panel: z.string().optional().catch(undefined),
  preview: z.string().default('overview').catch('overview'),
  preset: z.string().optional().catch(undefined),
  // Opens the preset gallery modal — set by the panel's Presets button and the
  // /presets permanent redirect. Coerced boolean: the search parser reads bare
  // `1`/`true` as non-strings, so a plain `z.string()` would reject them and
  // the param would be dropped.
  gallery: z.coerce.boolean().optional().catch(undefined),
})

const searchDefaults = { preview: 'overview' }

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
  // Below `lg` the preview is the whole page and the panel rides over it as a
  // bottom sheet — edits stay visible on the live stage while adjusting.
  const [sheetOpen, setSheetOpen] = useState(false)

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

  return (
    <div className="flex h-[calc(100svh-var(--header-height))] min-h-0 flex-1 flex-col gap-3 p-4 pt-2 lg:flex-row lg:gap-6 lg:p-6 lg:pt-2">
      <ExportHeaderAction />
      <CreatePanel className="max-lg:hidden" />
      <PreviewPanel />

      {/* Mobile: the panel is a bottom sheet over the live stage. */}
      <div className="contents lg:hidden">
        <Button
          onPress={() => setSheetOpen(true)}
          className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 shadow-lg lg:hidden"
        >
          <SlidersHorizontalIcon data-icon-start="" />
          Customize
        </Button>
        <Drawer
          isOpen={sheetOpen}
          onOpenChange={setSheetOpen}
          className="h-[80svh]"
        >
          <DialogContent
            aria-label="Customize"
            className="flex h-full min-h-0 flex-col gap-0 p-0"
          >
            <DrawerHandle />
            <CreatePanel className="min-h-0 flex-1" />
          </DialogContent>
        </Drawer>
      </div>
    </div>
  )
}
