import { useEffect, useRef, useState, useSyncExternalStore } from "react"
import type { ComponentProps } from "react"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import type { SearchSchemaInput } from "@tanstack/react-router"

import { siteConfig } from "@/config/site"
import { useIsMobile } from "@/registry/hooks/use-mobile"
import { toastManager, ToastProvider } from "@/registry/ui/toast"
import { getPreset } from "@/modules/presets"
import { StudioHeaderActions } from "@/modules/studio/export"
import { PreviewPanel } from "@/modules/studio/preview/preview-panel"
import { PanelPopoverBoundary } from "@/modules/studio/rows"
import { getCurrent, select } from "@/modules/studio/selection"
import { fetchSnapshot } from "@/modules/studio/share"
import { StudioPanel } from "@/modules/studio/studio-panel"
import { flush, isUnreadable, storageFailed } from "@/modules/studio/workspace"

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
  // An empty param (`?preset=`) is no param.
  const text = (value: unknown) =>
    typeof value === "string" && value ? value : undefined
  return {
    panel: text(search.panel),
    preview: text(search.preview) ?? "cards",
    // Opens the design-system switcher — set by the /presets redirect.
    // Coerced boolean: the search parser reads bare `1`/`true` as non-strings.
    gallery: search.gallery === undefined ? undefined : Boolean(search.gallery),
    // A link to open: a shared snapshot, or a preset.
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
  head: () => {
    const title = `${siteConfig.name} Studio - Build your design system`
    const description =
      "Compose colors, typography, icons, density, radius and per-component styles, preview every change on real components, then export code you own."
    const url = `${siteConfig.url}/studio`
    const image = `${siteConfig.url}/images/og-studio.png`
    const imageAlt =
      "dotUI Studio: the design-system panel beside a live wall of components"

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "og:image:type", content: "image/png" },
        { property: "og:image:width", content: "2400" },
        { property: "og:image:height", content: "1260" },
        { property: "og:image:alt", content: imageAlt },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
        { name: "twitter:image:alt", content: imageAlt },
      ],
      links: [{ rel: "canonical", href: url }],
    }
  },
  component: StudioPage,
})

const useHydrated = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

/** Opens a `?preset=` or `?s=` link once, as a read-only view, then strips
 *  it from the URL; until then the studio waits. After hydration, so its
 *  toast has a provider. */
function useOpenLink(hydrated: boolean): boolean {
  const { s, preset } = Route.useSearch()
  const navigate = Route.useNavigate()
  const opened = useRef<string>(undefined)

  useEffect(() => {
    const link = s !== undefined ? `s:${s}` : preset && `preset:${preset}`
    if (!link) {
      opened.current = undefined
      return
    }
    if (!hydrated || link === opened.current) return
    opened.current = link
    const done = () =>
      navigate({
        search: (prev) => ({ ...prev, s: undefined, preset: undefined }),
        replace: true,
      })
    const broken = () =>
      toastManager.add({ title: "This link doesn't work", type: "error" })
    if (s === undefined) {
      if (preset && getPreset(preset)) select({ kind: "preset", id: preset })
      else broken()
      done()
      return
    }
    const from = getCurrent().key
    fetchSnapshot(s)
      .then(
        (snapshot) => {
          if (!snapshot) return broken()
          // A pick made meanwhile, in another tab, wins.
          if (getCurrent().key !== from) return
          select({
            kind: "link",
            id: s,
            name: snapshot.name,
            state: snapshot.state,
          })
        },
        (error: unknown) => {
          console.error(error)
          broken()
        },
      )
      .finally(done)
  }, [hydrated, s, preset, navigate])
  return s !== undefined || preset !== undefined
}

function StudioPage() {
  const hydrated = useHydrated()
  const opening = useOpenLink(hydrated)
  const isMobile = useIsMobile()
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
              frame only, and a shared link shows once it has loaded. */}
          {hydrated && !opening ? <StudioBody /> : <StudioSkeleton />}
        </div>
      </PanelPopoverBoundary.Provider>
      {hydrated && (
        <ToastProvider
          portalProps={TOP_LAYER}
          position={isMobile ? "top-center" : undefined}
        />
      )}
    </div>
  )
}

// Live and on top of modal overlays, the picker's drawer included. On phones
// they sit at the top, clear of the drawers and below the header's Share and
// Export.
const TOP_LAYER = {
  "data-react-aria-top-layer": "true",
  // Portaled out of the layout's --header-height: 14 plus a gap.
  className: "relative z-60 max-md:*:data-[slot=toast-viewport]:top-16!",
} as ComponentProps<typeof ToastProvider>["portalProps"]

function StudioBody() {
  // Said on arrival, before the list looks emptied.
  useEffect(() => {
    if (isUnreadable()) storageFailed(true)
  }, [])
  return (
    <>
      <StudioHeaderActions />
      {/* Below `lg` the panel docks under the preview; on short screens
          (a phone on its side) it sits beside it instead. */}
      <StudioPanel className="max-lg:flex-none dock-stacked:order-last dock-side:w-72" />
      <PreviewPanel />
    </>
  )
}

function StudioSkeleton() {
  return (
    <>
      <div className="rounded-[14px] border border-fg/6 bg-card max-lg:order-last max-lg:h-40 lg:w-64 lg:shrink-0" />
      <div className="flex-1 rounded-[14px] border border-fg/6 bg-card" />
    </>
  )
}
