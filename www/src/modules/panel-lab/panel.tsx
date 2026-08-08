"use client"

/* The panel chrome — the CURRENT /create layout (control-panel.tsx): every
   section its own bordered card in a story scroll, floating glass header and
   footer bars the cards dip under. Chapter-agnostic: the list comes from
   state.ts, so the chrome never has to know which sections exist. */

import type { CSSProperties } from "react"
import { ChevronsUpDownIcon, SearchIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { useTweak } from "@/dev/tweaker"

import { ChapterCard } from "./chapter"
import { PreviewModeContext } from "./hero"
import type { Chapter, Lab } from "./state"

const RADIUS_STEPS: Record<string, string> = {
  none: "0px",
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
}

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
  /* Every rounded class in the panel resolves off --radius (xl = ×1.5, sm =
     ×0.5), so overriding it here rescales the whole ladder at once — cards,
     rows, groups and the controls nested in them stay in proportion. The
     steps name the panel's own roundness, not the ladder they drive; `md` is
     the shipped 10px. */
  const radius = useTweak("Radius", {
    type: "select",
    options: ["none", "sm", "md", "lg", "xl"],
    default: "md",
    group: "Shape",
  })

  return (
    <PreviewModeContext.Provider value={preview}>
      <div
        className="relative flex h-full min-h-0 flex-col"
        style={
          {
            "--lab-gap-section": `${sectionGap}px`,
            "--lab-gap-control": `${controlGap}px`,
            "--radius": RADIUS_STEPS[radius] ?? RADIUS_STEPS.md,
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
