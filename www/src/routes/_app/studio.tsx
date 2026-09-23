import { useEffect, useRef, useState } from "react"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import type { SearchSchemaInput } from "@tanstack/react-router"

import { DialogContent } from "@/registry/ui/dialog"
import { Drawer, DrawerHandle } from "@/registry/ui/drawer"
import { LEGACY_ORIGIN, ORIGIN } from "@/modules/presets/presets-data"
import { StudioPanel } from "@/modules/studio/create"
import { ExportHeaderAction } from "@/modules/studio/export"
import {
  DEFAULT_PRESET,
  decodePreset,
  encodePreset,
} from "@/modules/studio/preset/codec"
import {
  loadStoredPreset,
  saveStoredPreset,
} from "@/modules/studio/preset/storage"
import { PreviewPanel } from "@/modules/studio/preview/preview-panel"
import { PanelPopoverBoundary } from "@/modules/studio/rows"
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

/** Undefined on the server and first render (SSR ships the desktop layout). */
function useIsBelowLg() {
  const [isBelow, setIsBelow] = useState<boolean>()
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)")
    const onChange = () => setIsBelow(mql.matches)
    mql.addEventListener("change", onChange)
    onChange()
    return () => mql.removeEventListener("change", onChange)
  }, [])
  return isBelow
}

export const Route = createFileRoute("/_app/studio")({
  validateSearch: createSearchSchema,
  search: {
    middlewares: [stripSearchParams(searchDefaults)],
  },
  component: StudioPage,
})

function StudioPage() {
  const { preset, gallery } = Route.useSearch()
  const { preset: current, setPreset, setState } = useStudio()
  // Below `lg` the preview is the whole page and the panel rides over it as a
  // bottom sheet — edits stay visible on the live stage while adjusting. One
  // panel is mounted at a time: each owns the preset picker and ⌘P.
  const isBelowLg = useIsBelowLg()
  const [sheetOpen, setSheetOpen] = useState(false)
  useEffect(() => {
    // The sheet portals out of the layout: close it past lg.
    if (isBelowLg === false) setSheetOpen(false)
    // ?gallery= (the /presets redirect) needs the panel that owns the picker.
    else if (isBelowLg && gallery) setSheetOpen(true)
  }, [isBelowLg, gallery])
  const [boundary, setBoundary] = useState<HTMLDivElement | null>(null)

  // The user's selected preset is persisted in localStorage so every docs
  // component demo renders in it. Seed the editor from it on open (unless a
  // shared ?preset= link is being viewed), then persist back as it's edited.
  // First visit — nothing stored — starts on Origin, the default preset.
  const seededFromStorage = useRef(false)
  const skipPersists = useRef(1)
  useEffect(() => {
    if (seededFromStorage.current) return
    seededFromStorage.current = true
    // A shared / deep-linked preset wins over the saved one. An old link
    // loads in today's encoding (the pinned Origin as Origin, which is none).
    if (preset) {
      const next =
        preset === LEGACY_ORIGIN
          ? { state: ORIGIN.state }
          : decodePreset(preset)
      if (encodePreset(next) !== preset) {
        // Still the link's initial value, not an edit to persist.
        skipPersists.current++
        setPreset(next)
      }
      return
    }
    const stored = loadStoredPreset()
    if (stored === DEFAULT_PRESET || encodePreset(stored) === LEGACY_ORIGIN)
      setState(ORIGIN.state)
    else setPreset(stored)
  }, [preset, setPreset, setState])

  useEffect(() => {
    // Skip the initial value so merely opening a shared link doesn't overwrite
    // the saved preset; persist once the user actually changes something.
    if (skipPersists.current > 0) {
      skipPersists.current--
      return
    }
    saveStoredPreset(current)
  }, [current])

  return (
    // lg:pr-4 matches the header's md:pr-4 so the preview panel's right edge
    // lines up with the Export button above it.
    <div className="h-[calc(100svh-var(--header-height))] min-h-0 flex-1 p-4 pt-2 lg:p-6 lg:pt-2 lg:pr-4">
      <ExportHeaderAction />
      {/* The row is the panel's height: panel popovers stay within it. */}
      <PanelPopoverBoundary.Provider value={boundary}>
        <div
          ref={setBoundary}
          className="flex h-full min-h-0 flex-col gap-3 lg:flex-row lg:gap-6"
        >
          {!isBelowLg && (
            <StudioPanel
              className="max-lg:hidden"
              galleryReady={isBelowLg !== undefined}
            />
          )}
          <PreviewPanel onCustomize={() => setSheetOpen(true)} />
        </div>
      </PanelPopoverBoundary.Provider>

      {/* Mobile: the panel is a bottom sheet over the live stage, opened from
          the preview's floating toolbar. */}
      {isBelowLg && (
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
      )}
    </div>
  )
}
