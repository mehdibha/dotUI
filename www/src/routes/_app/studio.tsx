import { useEffect, useState, useSyncExternalStore } from "react"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import type { SearchSchemaInput } from "@tanstack/react-router"

import { toastManager, ToastProvider } from "@/registry/ui/toast"
import { getPreset } from "@/modules/presets"
import { StudioPanel } from "@/modules/studio/create"
import { StudioHeaderActions } from "@/modules/studio/export"
import { PreviewPanel } from "@/modules/studio/preview/preview-panel"
import { PanelPopoverBoundary } from "@/modules/studio/rows"
import {
  createFromPreset,
  fetchSnapshot,
  flush,
  importSnapshot,
} from "@/modules/studio/workspace"

export function createSearchSchema(
  search: {
    panel?: string
    preview?: string
    gallery?: boolean
    s?: string
    preset?: string
  } & SearchSchemaInput,
): {
  panel?: string
  preview: string
  gallery?: boolean
  s?: string
  preset?: string
} {
  const text = (value: unknown) =>
    typeof value === "string" ? value : undefined
  return {
    panel: text(search.panel),
    preview: text(search.preview) ?? "cards",
    // Opens the design-system switcher — set by the /presets redirect.
    // Coerced boolean: the search parser reads bare `1`/`true` as non-strings.
    gallery: search.gallery === undefined ? undefined : Boolean(search.gallery),
    // Links: a published snapshot to import, or a preset to start from.
    s: text(search.s),
    preset: text(search.preset),
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

const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

/** Opens what a link points at — never over the user's work — then drops
 *  the link from the URL. */
function useStudioLink() {
  const { s, preset } = Route.useSearch()
  const navigate = Route.useNavigate()

  useEffect(() => {
    if (s === undefined && preset === undefined) return
    const done = () =>
      navigate({
        search: (prev) => ({ ...prev, s: undefined, preset: undefined }),
        replace: true,
      })
    if (s !== undefined) {
      let live = true
      fetchSnapshot(s)
        .then(
          (snapshot) => live && importSnapshot(s, snapshot),
          (error: unknown) => {
            console.error(error)
            if (live)
              toastManager.add({
                title: "Couldn't open that design system",
                description: "The link is broken or no longer exists.",
                type: "error",
              })
          },
        )
        .finally(() => live && done())
      return () => {
        live = false
      }
    }
    if (preset !== undefined) {
      if (getPreset(preset)) createFromPreset(preset)
      else toastManager.add({ title: "Unknown preset", type: "error" })
      done()
    }
  }, [s, preset, navigate])
}

function StudioPage() {
  const hydrated = useHydrated()
  const [boundary, setBoundary] = useState<HTMLDivElement | null>(null)

  // Edits reach storage on a throttle; leaving writes the last one.
  useEffect(() => {
    const onHide = () => document.visibilityState === "hidden" && flush()
    window.addEventListener("pagehide", flush)
    document.addEventListener("visibilitychange", onHide)
    return () => {
      flush()
      window.removeEventListener("pagehide", flush)
      document.removeEventListener("visibilitychange", onHide)
    }
  }, [])

  return (
    // lg:pr-4 matches the header's md:pr-4 so the preview panel's right edge
    // lines up with the Export button above it.
    <div className="h-[calc(100svh-var(--header-height))] min-h-0 flex-1 p-4 pt-2 max-sm:px-2 max-sm:pb-2 lg:p-6 lg:pt-2 lg:pr-4">
      {/* The row is the panel's height: panel popovers stay within it. */}
      <PanelPopoverBoundary.Provider value={boundary}>
        <div
          ref={setBoundary}
          className="flex h-full min-h-0 flex-col gap-3 max-sm:gap-2 lg:flex-row lg:gap-6 dock-side:flex-row"
        >
          {/* The workspace lives in this browser: the server renders the
              frame only. */}
          {hydrated ? <StudioBody /> : <StudioSkeleton />}
        </div>
      </PanelPopoverBoundary.Provider>
    </div>
  )
}

function StudioBody() {
  useStudioLink()
  return (
    <>
      <StudioHeaderActions />
      <ToastProvider />
      {/* Below `lg` the panel docks under the preview; on short screens
          (a phone on its side) it sits beside it instead. */}
      <StudioPanel className="max-lg:flex-none dock-stacked:order-last dock-side:w-64" />
      <PreviewPanel />
    </>
  )
}

function StudioSkeleton() {
  return (
    <>
      <div className="rounded-[14px] border border-fg/6 bg-card max-lg:order-last max-lg:h-40 lg:w-64 lg:shrink-0" />
      <div className="min-h-0 flex-1 rounded-[14px] border border-fg/6 bg-card" />
    </>
  )
}
