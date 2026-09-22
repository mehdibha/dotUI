"use client"

/* The panel chrome, after DialKit: one 14px-radius card that scrolls as a
   whole, its header pinned — the system switcher on the left, global reset
   and search on the right — over a hairline. Real behavior arrives through
   `system` (wired by StudioPanel on /studio); without it the chrome is the
   studio's inert design shell. */

import type { ReactNode } from "react"
import { ChevronsUpDownIcon, RotateCcwIcon, SearchIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"

import { DEFAULTS } from "./state"
import type { Studio } from "./state"

/** The create-engine wiring the chrome acts through. Everything here operates
 *  on the real design system (URL preset + localStorage). */
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
  /** Wraps the Export button in the export dialog's trigger. */
  renderExport: (trigger: ReactNode) => ReactNode
}

export function PanelChrome({
  studio,
  system,
  search,
  children,
}: {
  studio: Studio
  system?: PanelSystem
  /** Search trigger + overlay, supplied by the page (it owns navigation). */
  search?: ReactNode
  children: ReactNode
}) {
  // The only reset in the panel. The system's reset (guarded over unsaved
  // work) reapplies Origin, a whole state, so it covers the axes too.
  const whole = studio.section(DEFAULTS)
  const modified = whole.modified || (system?.modified ?? false)
  const resetAll = system ? system.onReset : whole.onReset

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

  return (
    <div className="relative no-scrollbar flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain rounded-[14px] border border-fg/6 bg-card px-2 pb-2 [--panel-surface:var(--color-card)]">
      <div className="sticky top-0 z-20 -mx-2 mb-2 flex shrink-0 items-center justify-between gap-2 border-b border-fg/6 bg-card p-2">
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
    </div>
  )
}
