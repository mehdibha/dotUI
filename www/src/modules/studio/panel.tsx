"use client"

/* The panel chrome, after DialKit: one 14px-radius card, its header fixed
   over a hairline — the system switcher on the left, global reset and search
   on the right — and only the body below it scrolls. Docked under the
   preview, the header and strip sit at the bottom edge instead, so they stay
   put as the dock hugs each chapter. Real behavior arrives through `system` (wired by
   StudioPanel on /studio); without it the chrome is the studio's inert
   design shell. */

import type { ReactNode } from "react"
import { ChevronsUpDownIcon, RotateCcwIcon, SearchIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"

import { DEFAULTS } from "./state"
import type { Studio } from "./state"

/** The create-engine wiring the chrome acts through. Everything here operates
 *  on the real design system (URL preset + localStorage); the studio's own axes
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
  /** Wraps the Export button in the export dialog's trigger. */
  renderExport: (trigger: ReactNode) => ReactNode
}

export function PanelChrome({
  studio,
  system,
  actions,
  strip,
  className,
  children,
}: {
  studio: Studio
  system?: PanelSystem
  /** Search and the dock toggle, supplied by the page (it owns navigation). */
  actions?: ReactNode
  /** Mobile chapter navigation, pinned with the header. */
  strip?: ReactNode
  className?: string
  children: ReactNode
}) {
  // The only reset in the panel. It clears the studio axes and the engine
  // state as one.
  const whole = studio.section(DEFAULTS)
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

  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col overflow-clip rounded-[14px] border border-fg/6 bg-card [--panel-surface:var(--color-card)]",
        className,
      )}
    >
      <div className="flex shrink-0 flex-col border-b border-fg/6 p-2 max-lg:py-1.5 dock-stacked:order-last dock-stacked:border-t dock-stacked:border-b-0">
        <div className="flex items-center justify-between gap-2">
          {system ? system.renderSwitcher(switcherTrigger) : switcherTrigger}
          <span className="flex shrink-0 items-center pointer-coarse:gap-1">
            {modified && (
              <Button
                size="sm"
                variant="quiet"
                isIconOnly
                aria-label="Reset design system"
                onPress={resetAll}
                className="text-fg-muted pointer-coarse:data-icon-only:size-9"
              >
                <RotateCcwIcon />
              </Button>
            )}
            {actions ?? (
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
        {strip}
      </div>
      <div className="no-scrollbar flex min-h-0 grow scroll-pt-2 flex-col overflow-y-auto overscroll-contain p-2 max-lg:py-0">
        {children}
      </div>
    </div>
  )
}
