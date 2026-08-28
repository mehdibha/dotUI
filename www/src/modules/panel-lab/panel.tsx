"use client"

/* The panel chrome: one enclosed surface — header (system switcher, global
   reset, search) and footer (save, export) are flush hairline bars on the
   card. The drill-in frame supplies the middle. Real behavior arrives through
   `system` (wired by LabCreatePanel on /create); without it the chrome stays
   the lab's inert design shell. */

import { useEffect } from "react"
import type { ReactNode } from "react"
import { ChevronsUpDownIcon, RotateCcwIcon, SearchIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { useTweak } from "@/dev/tweaker"

import { DEFAULTS } from "./state"
import type { Lab } from "./state"

/* Popovers portal to <body>, so the instant-feel option lands as a root
   attribute plus one injected rule that zeroes the .popover slot's
   transition — every popover surface (picker, menus, selects) opens and
   closes with no easing while it's on. Throwaway tweak scaffolding. */
const POPOVER_KILL_ID = "tweak-instant-popovers"

function useInstantPopovers(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    let style = document.getElementById(POPOVER_KILL_ID)
    if (!style) {
      style = document.createElement("style")
      style.id = POPOVER_KILL_ID
      style.textContent =
        "html[data-instant-popovers] .popover{transition-duration:0s!important}"
      document.head.appendChild(style)
    }
    document.documentElement.setAttribute("data-instant-popovers", "")
    return () =>
      document.documentElement.removeAttribute("data-instant-popovers")
  }, [enabled])
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
  const popovers = useTweak("Popovers", {
    type: "select",
    options: ["animated", "instant"],
    default: "animated",
    group: "Motion",
  })
  useInstantPopovers(popovers === "instant")

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
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border/45 bg-card">
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
