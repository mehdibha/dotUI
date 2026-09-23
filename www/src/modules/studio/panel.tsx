"use client"

/* The panel chrome, after DialKit: one 14px-radius card that scrolls as a
   whole, its header pinned — the system switcher on the left, save, reset
   and search on the right — over a hairline. */

import type { ReactNode } from "react"
import {
  ChevronsUpDownIcon,
  CopyPlusIcon,
  RotateCcwIcon,
  SaveIcon,
} from "lucide-react"

import { Button } from "@/registry/ui/button"

/** The studio document the chrome acts on (wired by StudioPanel). */
export interface PanelSystem {
  /** What's being edited: a saved system's name, else the base preset's. */
  name: string
  /** Edits past the saved system: marks the name. */
  dirty: boolean
  /** Work no saved system holds yet, or edits past one: shows Save. */
  unsaved: boolean
  /** Shows Reset, back to the base preset. */
  modified: boolean
  /** A shared link: Save makes it a copy of this browser's own. */
  shared: boolean
  onReset: () => void
  onSave: () => void
  /** Wraps the header name button in the preset picker's trigger. */
  renderSwitcher: (trigger: ReactNode) => ReactNode
}

export function PanelChrome({
  system,
  search,
  children,
}: {
  system: PanelSystem
  /** Search trigger + overlay, supplied by the page (it owns navigation). */
  search: ReactNode
  children: ReactNode
}) {
  const switcherTrigger = (
    <Button
      variant="quiet"
      size="sm"
      className="min-w-0 shrink justify-start gap-1.5 font-medium"
    >
      <span className="truncate">{system.name}</span>
      {system.dirty && (
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
        {system.renderSwitcher(switcherTrigger)}
        <span className="flex shrink-0 items-center">
          {(system.shared || system.unsaved) && (
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label={system.shared ? "Save a copy" : "Save design system"}
              onPress={system.onSave}
              className="text-fg-muted"
            >
              {system.shared ? <CopyPlusIcon /> : <SaveIcon />}
            </Button>
          )}
          {system.modified && (
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label="Reset design system"
              onPress={system.onReset}
              className="text-fg-muted"
            >
              <RotateCcwIcon />
            </Button>
          )}
          {search}
        </span>
      </div>
      {children}
    </div>
  )
}
