import { useEffect, useRef, useState } from "react"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import type { SearchSchemaInput } from "@tanstack/react-router"

import { DialogContent } from "@/registry/ui/dialog"
import { Drawer, DrawerHandle } from "@/registry/ui/drawer"
import { ORIGIN } from "@/modules/presets/presets-data"
import { StudioPanel } from "@/modules/studio/create"
import { ExportHeaderAction } from "@/modules/studio/export"
import { DEFAULT_PRESET } from "@/modules/studio/preset/codec"
import {
  loadStoredPreset,
  saveStoredPreset,
} from "@/modules/studio/preset/storage"
import { PreviewPanel } from "@/modules/studio/preview/preview-panel"
import { useStudio } from "@/modules/studio/use-studio"

export function createSearchSchema(
  search: {
    panel?: string
    preview?: string
    preset?: string
    gallery?: boolean
  } & SearchSchemaInput,
): {
  panel?: string
  preview: string
  preset?: string
  gallery?: boolean
} {
  return {
    panel: typeof search.panel === "string" ? search.panel : undefined,
    preview: typeof search.preview === "string" ? search.preview : "cards",
    preset: typeof search.preset === "string" ? search.preset : undefined,
    // Opens the preset gallery modal — set by the panel's Presets button and the
    // /presets permanent redirect. Coerced boolean: the search parser reads bare
    // `1`/`true` as non-strings, so a string check would reject them and the
    // param would be dropped.
    gallery: search.gallery === undefined ? undefined : Boolean(search.gallery),
  }
}

const searchDefaults = { preview: "cards" }

export const Route = createFileRoute("/_app/studio")({
  validateSearch: createSearchSchema,
  search: {
    middlewares: [stripSearchParams(searchDefaults)],
  },
  component: StudioPage,
})

function StudioPage() {
  const { preset } = Route.useSearch()
  const { preset: current, setPreset, setState } = useStudio()
  // Below `lg` the preview is the whole page and the panel rides over it as a
  // bottom sheet — edits stay visible on the live stage while adjusting.
  const [sheetOpen, setSheetOpen] = useState(false)

  // The user's selected preset is persisted in localStorage so every docs
  // component demo renders in it. Seed the editor from it on open (unless a
  // shared ?preset= link is being viewed), then persist back as it's edited.
  // First visit — nothing stored — starts on Origin, the default preset.
  const seededFromStorage = useRef(false)
  useEffect(() => {
    if (seededFromStorage.current) return
    seededFromStorage.current = true
    if (preset) return // a shared / deep-linked preset wins over the saved one
    const stored = loadStoredPreset()
    if (stored !== DEFAULT_PRESET) setPreset(stored)
    else setState(ORIGIN.state)
  }, [preset, setPreset, setState])

  const skipFirstPersist = useRef(true)
  useEffect(() => {
    // Skip the initial value so merely opening a shared link doesn't overwrite
    // the saved preset; persist once the user actually changes something.
    if (skipFirstPersist.current) {
      skipFirstPersist.current = false
      return
    }
    saveStoredPreset(current)
  }, [current])

  return (
    // lg:pr-4 matches the header's md:pr-4 so the preview panel's right edge
    // lines up with the Export button above it.
    <div className="flex h-[calc(100svh-var(--header-height))] min-h-0 flex-1 flex-col gap-3 p-4 pt-2 lg:flex-row lg:gap-6 lg:p-6 lg:pt-2 lg:pr-4">
      <ExportHeaderAction />
      <StudioPanel className="max-lg:hidden" />
      <PreviewPanel onCustomize={() => setSheetOpen(true)} />

      {/* Mobile: the panel is a bottom sheet over the live stage, opened from
          the preview's floating toolbar. */}
      <div className="contents lg:hidden">
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
            <StudioPanel className="min-h-0 flex-1" />
          </DialogContent>
        </Drawer>
      </div>
    </div>
  )
}
