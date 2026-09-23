import { useEffect, useState } from "react"
import {
  createFileRoute,
  redirect,
  stripSearchParams,
} from "@tanstack/react-router"
import type { SearchSchemaInput } from "@tanstack/react-router"

import { DialogContent } from "@/registry/ui/dialog"
import { Drawer, DrawerHandle } from "@/registry/ui/drawer"
import { toastManager, ToastProvider } from "@/registry/ui/toast"
import { takeNotice } from "@/modules/studio/arrival"
import { StudioPanel } from "@/modules/studio/create"
import type { Notice } from "@/modules/studio/doc"
import { ExportHeaderAction } from "@/modules/studio/export"
import { PreviewPanel } from "@/modules/studio/preview/preview-panel"
import { PanelPopoverBoundary } from "@/modules/studio/rows"

export function createSearchSchema(
  search: {
    panel?: string
    preview?: string
    preset?: string
    d?: string
    name?: string
    system?: string
    gallery?: boolean
  } & SearchSchemaInput,
): {
  panel?: string
  preview: string
  preset?: string
  d?: string
  name?: string
  system?: string
  gallery?: boolean
} {
  const text = (value: unknown) =>
    typeof value === "string" && value ? value : undefined
  return {
    panel: text(search.panel),
    preview: text(search.preview) ?? "cards",
    preset: text(search.preset),
    d: text(search.d),
    name: text(search.name),
    system: text(search.system),
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
  // The server renders only canonical documents: a bare /studio needs this
  // browser's working document, and a link that must be rewritten carries a
  // notice. Those resolve on the client before anything renders — a cookie
  // can't stand in, as _app's document responses are publicly CDN-cached.
  ssr: async ({ search }) => {
    if (search.status !== "success") return false
    const { arrive } = await import("@/modules/studio/doc")
    return arrive(search.value).redirect === undefined
  },
  beforeLoad: async ({ search, preload }) => {
    const { settle } = await import("@/modules/studio/arrival")
    const target = settle(search, preload)
    if (target) {
      const { preset, d, name, system } = target
      throw redirect({
        to: "/studio",
        search: { ...search, preset, d, name, system },
      })
    }
  },
  pendingMinMs: 0,
  pendingComponent: StudioPending,
  component: StudioPage,
})

const NOTICE_TITLES = {
  corrupt: "This link is damaged",
  invalid: "This link isn't a design system",
  "newer-version": "This link needs a newer dotUI",
  "unknown-preset": "This link's preset doesn't exist",
}

function announce(notice: Notice) {
  if (notice.kind === "failed") {
    toastManager.add({
      title: NOTICE_TITLES[notice.reason],
      description: "Opened its starting point instead.",
      type: "warning",
    })
    return
  }
  const count = notice.settings.length
  toastManager.add({
    title:
      count === 1
        ? "1 setting from this link no longer exists"
        : `${count} settings from this link no longer exist`,
    description: notice.settings.join(", "),
    type: "warning",
  })
}

/** The page's frame, held while the client resolves the document. */
function StudioPending() {
  return (
    <div className="h-[calc(100svh-var(--header-height))] min-h-0 flex-1 p-4 pt-2 lg:p-6 lg:pt-2 lg:pr-4">
      <div className="flex h-full min-h-0 flex-col gap-3 lg:flex-row lg:gap-6">
        <div className="rounded-[14px] border border-fg/6 bg-card max-lg:hidden lg:w-64 lg:shrink-0" />
        <div className="min-w-0 flex-1 rounded-xl border border-border/45 bg-bg shadow-xs" />
      </div>
    </div>
  )
}

function StudioPage() {
  const search = Route.useSearch()
  // Below `lg` the preview is the whole page and the panel rides over it as a
  // bottom sheet — edits stay visible on the live stage while adjusting.
  const [sheetOpen, setSheetOpen] = useState(false)
  const [boundary, setBoundary] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const notice = takeNotice()
    if (notice) announce(notice)
  }, [search])

  return (
    // lg:pr-4 matches the header's md:pr-4 so the preview panel's right edge
    // lines up with the Export button above it.
    <div className="h-[calc(100svh-var(--header-height))] min-h-0 flex-1 p-4 pt-2 lg:p-6 lg:pt-2 lg:pr-4">
      <ExportHeaderAction />
      <ToastProvider />
      {/* The row is the panel's height: panel popovers stay within it. */}
      <PanelPopoverBoundary.Provider value={boundary}>
        <div
          ref={setBoundary}
          className="flex h-full min-h-0 flex-col gap-3 lg:flex-row lg:gap-6"
        >
          <StudioPanel className="max-lg:hidden" />
          <PreviewPanel onCustomize={() => setSheetOpen(true)} />
        </div>
      </PanelPopoverBoundary.Provider>

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
