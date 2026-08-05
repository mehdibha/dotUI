"use client"

/* The panel chrome — the CURRENT /create layout (control-panel.tsx): every
   section its own bordered card in a story scroll, floating glass header and
   footer bars the cards dip under. Chapter-agnostic: each version supplies
   its own chapter list (see versions.tsx), so the chrome is shared and only
   the sections differ between versions. */

import type { CSSProperties } from "react"
import { ChevronsUpDownIcon, SearchIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { useTweak } from "@/dev/tweaker"

import type { Lab } from "../data"
import { PreviewModeContext } from "../hero"
import { ChapterCard } from "./chapter"
import type { Chapter } from "./chapter"

export function PanelFrame({
  chapters,
  lab,
}: {
  chapters: Chapter[]
  lab: Lab
}) {
  const sectionGap = useTweak("Section gap", {
    type: "number",
    min: 0,
    max: 32,
    step: 1,
    default: 12,
    group: "Spacing",
  })
  const controlGap = useTweak("Control gap", {
    type: "number",
    min: 0,
    max: 16,
    step: 1,
    default: 6,
    group: "Spacing",
  })
  const preview = useTweak("Section opens on", {
    type: "select",
    options: ["hero", "none"],
    default: "hero",
    group: "Preview",
  })

  return (
    <PreviewModeContext.Provider value={preview}>
      <div
        className="relative flex h-full min-h-0 flex-col"
        style={
          {
            "--lab-gap-section": `${sectionGap}px`,
            "--lab-gap-control": `${controlGap}px`,
          } as CSSProperties
        }
      >
        {/* Floating glass header — cards dip under it, never past it. */}
        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 rounded-xl border border-border/45 bg-neutral/90 p-1.5 shadow-[0_4px_16px_-4px_rgb(0_0_0/0.2),0_2px_6px_-2px_rgb(0_0_0/0.12)] backdrop-blur-sm">
          <Button
            variant="quiet"
            size="sm"
            className="min-w-0 justify-start gap-1.5 font-medium"
          >
            <span className="truncate">Acme design system</span>
            <ChevronsUpDownIcon className="size-3.5 shrink-0 text-fg-muted" />
          </Button>
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Search controls"
            className="shrink-0"
          >
            <SearchIcon />
          </Button>
        </div>

        {/* The story scroll: every chapter its own card. */}
        <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-[var(--lab-gap-section,0.75rem)] overflow-y-auto overscroll-contain rounded-xl pt-[56px] pb-[62px] *:shrink-0">
          {chapters.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} lab={lab} />
          ))}
        </div>

        {/* Floating glass footer — same treatment as the header. */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 rounded-xl border border-border/45 bg-neutral/90 p-2 shadow-[0_-4px_16px_-4px_rgb(0_0_0/0.2),0_-2px_6px_-2px_rgb(0_0_0/0.12)] backdrop-blur-sm">
          <Button size="sm" className="flex-1">
            Save
          </Button>
          <Button variant="primary" size="sm" className="flex-1">
            Export
          </Button>
        </div>
      </div>
    </PreviewModeContext.Provider>
  )
}
