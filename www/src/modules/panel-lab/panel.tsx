"use client"

/* The panel chrome: one enclosed surface — header (system switcher, global
   reset, search) and footer (save, export) are flush hairline bars on the
   card, plus the spacing/radius tweak vars. The drill-in frame supplies the
   middle. Real behavior arrives through `system` (wired by LabCreatePanel on
   /create); without it the chrome stays the lab's inert design shell. */

import type { CSSProperties, ReactNode } from "react"
import { ChevronsUpDownIcon, RotateCcwIcon, SearchIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { useTweak } from "@/dev/tweaker"

import { DEFAULTS } from "./state"
import type { Lab } from "./state"

const RADIUS_STEPS: Record<string, string> = {
  none: "0px",
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
}

/** The create-engine wiring the chrome acts through. Everything here operates
 *  on the real design system (URL preset + localStorage); the lab's own axes
 *  reset alongside it but aren't persisted until their chapters are wired. */
export interface PanelSystem {
  /** What's being edited: the active saved system's name, else the working name. */
  name: string
  /** Edits past the active saved snapshot (or any built-in) — unsaved work. */
  dirty: boolean
  /** Engine state differs from the defaults. */
  modified: boolean
  onReset: () => void
  onSave: () => void
  /** Wraps the header name button in the preset picker's trigger. */
  renderSwitcher: (trigger: ReactNode) => ReactNode
  /** Wraps the footer Export button in the export dialog's trigger. */
  renderExport: (trigger: ReactNode) => ReactNode
}

/** Header + footer + tweak vars. Children own the middle region (and its
 *  scrolling) — they must claim flex-1 min-h-0 and pad for the overlaid bars
 *  (44px header, 52px footer, plus the body's 12px gap). */
export function PanelChrome({
  lab,
  system,
  search,
  children,
}: {
  lab: Lab
  system?: PanelSystem
  /** Search trigger + overlay, supplied by the frame (it owns navigation). */
  search?: ReactNode
  children: React.ReactNode
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
    default: 12,
    group: "Spacing",
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

  // The only reset in the panel — chapters carry a modified dot, never a
  // button of their own. It clears the lab axes and the engine state as one.
  const whole = lab.section(DEFAULTS)
  const modified = whole.modified || (system?.modified ?? false)
  const resetAll = () => {
    whole.onReset()
    system?.onReset()
  }

  const switcherTrigger = (
    <Button
      variant="quiet"
      size="sm"
      className="min-w-0 justify-start gap-1.5 font-medium"
    >
      <span className="truncate">{system?.name ?? "Acme design system"}</span>
      {system?.dirty && (
        <span
          aria-label="Unsaved changes"
          className="size-1.5 shrink-0 rounded-full bg-fg-muted"
        />
      )}
      <ChevronsUpDownIcon className="size-3.5 shrink-0 text-fg-muted" />
    </Button>
  )

  const exportButton = (
    <Button variant="primary" size="sm" className="flex-1">
      Export
    </Button>
  )

  return (
    <div
      className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border/45 bg-card"
      style={
        {
          "--lab-gap-section": `${sectionGap}px`,
          "--lab-gap-control": `${controlGap}px`,
          "--radius": RADIUS_STEPS[radius] ?? RADIUS_STEPS.md,
        } as CSSProperties
      }
    >
      {/* Header bar — flush to the panel, content dips under it. */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 border-b border-border/45 bg-card/85 p-2 backdrop-blur-sm">
        {system ? system.renderSwitcher(switcherTrigger) : switcherTrigger}
        <span className="flex shrink-0 items-center">
          {modified && (
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label="Reset design system"
              onPress={resetAll}
              className="text-fg-muted"
            >
              <RotateCcwIcon />
            </Button>
          )}
          {search ?? (
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label="Search settings"
            >
              <SearchIcon />
            </Button>
          )}
        </span>
      </div>

      {children}

      {/* Footer bar — same treatment as the header. */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 border-t border-border/45 bg-card/85 p-3 backdrop-blur-sm">
        <Button size="sm" className="flex-1" onPress={system?.onSave}>
          Save
        </Button>
        {system ? system.renderExport(exportButton) : exportButton}
      </div>
    </div>
  )
}
