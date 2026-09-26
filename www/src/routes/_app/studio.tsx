import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import type { ComponentProps } from "react"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import type { SearchSchemaInput } from "@tanstack/react-router"

import { toastManager, ToastProvider } from "@/registry/ui/toast"
import { getPreset } from "@/modules/presets"
import { StudioPanel } from "@/modules/studio/create"
import { StudioHeaderActions } from "@/modules/studio/export"
import { useHistory } from "@/modules/studio/history"
import { KeepDialog, leave } from "@/modules/studio/keep-dialog"
import { PreviewPanel } from "@/modules/studio/preview/preview-panel"
import { PanelPopoverBoundary } from "@/modules/studio/rows"
import { getCurrent, select, useCurrent } from "@/modules/studio/selection"
import { fetchSnapshot, flush } from "@/modules/studio/workspace"

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
    // The view on screen: a published snapshot, or a preset.
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

const linkKey = (s?: string, preset?: string) =>
  s !== undefined
    ? `shared:${s}`
    : preset !== undefined
      ? `preset:${preset}`
      : ""

/** Keeps the URL on the current selection: `?preset=` and `?s=` for views,
 *  bare `/studio` for the user's systems. A link that isn't the current
 *  selection opens it (asking first when leaving a changed draft); a broken
 *  one is dropped with a toast. */
function useSelectionUrl() {
  const { s, preset } = Route.useSearch()
  const navigate = Route.useNavigate()
  const { doc, key } = useCurrent()
  const url = linkKey(s, preset)
  const wanted = doc ? "" : key
  // The link the URL last held that has been dealt with.
  const seen = useRef<string>(undefined)

  useEffect(() => {
    if (url === wanted) {
      seen.current = url
      return
    }
    // Reads the selection live: an effect run can be a render behind.
    const sync = () => {
      const { sel, doc } = getCurrent()
      navigate({
        search: (prev) => ({
          ...prev,
          s: !doc && sel.kind === "shared" ? sel.id : undefined,
          preset: !doc && sel.kind === "preset" ? sel.id : undefined,
        }),
        replace: true,
      })
    }
    if (!url || url === seen.current) return void sync()
    seen.current = url
    const broken = (title: string, description?: string) => {
      toastManager.add({ title, description, type: "error" })
      sync()
    }
    if (s === undefined) {
      if (preset !== undefined && getPreset(preset))
        leave(() => select({ kind: "preset", id: preset }), sync)
      else broken(`No preset called "${preset}"`)
      return
    }
    fetchSnapshot(s).then(
      (snapshot) =>
        leave(
          () =>
            select({
              kind: "shared",
              id: s,
              name: snapshot.name,
              state: snapshot.state,
            }),
          sync,
        ),
      (error: unknown) => {
        console.error(error)
        broken("This link doesn't work", "It is broken or no longer exists.")
      },
    )
  }, [url, wanted, s, preset, navigate])
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

// Live and on top of modal overlays, the picker's drawer included: a delete's
// Undo works with the picker open.
const TOP_LAYER = {
  "data-react-aria-top-layer": "true",
  className: "relative z-60",
} as ComponentProps<typeof ToastProvider>["portalProps"]

function StudioBody() {
  useSelectionUrl()
  useHistory(useCurrent().doc?.id)
  return (
    <>
      <StudioHeaderActions />
      <ToastProvider portalProps={TOP_LAYER} />
      <KeepDialog />
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
