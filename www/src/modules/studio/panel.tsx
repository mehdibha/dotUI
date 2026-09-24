"use client"

/* The panel chrome, after DialKit: one 14px-radius card that scrolls as a
   whole, its header pinned — the open system's name (press to rename) and
   the switcher on the left, reset and search on the right — over a hairline.
   Docked under the preview, the header and strip pin to the bottom edge
   instead, so they stay put as the dock hugs each chapter. */

import { useState } from "react"
import type { ReactNode } from "react"
import { ChevronsUpDownIcon, RotateCcwIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"

/** The open design system, as the chrome acts on it. */
export interface PanelSystem {
  name: string
  onRename: (name: string) => void
  /** Present while the state differs from where the system started. */
  reset?: { label: string; onReset: () => void }
  /** Wraps the switcher button in the design-system picker's trigger. */
  renderSwitcher: (trigger: ReactNode) => ReactNode
}

function NameField({
  name,
  onRename,
}: {
  name: string
  onRename: (name: string) => void
}) {
  const [editing, setEditing] = useState(false)

  if (!editing)
    return (
      <Button
        variant="quiet"
        size="sm"
        aria-label={`Rename ${name}`}
        onPress={() => setEditing(true)}
        className="min-w-0 justify-start font-medium"
      >
        <span className="truncate">{name}</span>
      </Button>
    )

  return (
    <input
      aria-label="Design system name"
      defaultValue={name}
      maxLength={64}
      autoFocus
      onFocus={(e) => e.currentTarget.select()}
      onBlur={(e) => {
        onRename(e.currentTarget.value)
        setEditing(false)
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur()
        if (e.key === "Escape") {
          e.currentTarget.value = name
          e.currentTarget.blur()
        }
      }}
      className="h-7 min-w-0 flex-1 rounded-md bg-transparent px-2 text-sm font-medium focus-reset inset-ring-1 inset-ring-fg/15 focus-visible:focus-ring pointer-coarse:h-9"
    />
  )
}

export function PanelChrome({
  system,
  actions,
  strip,
  className,
  children,
}: {
  system: PanelSystem
  /** Search and the dock toggle, supplied by the page (it owns navigation). */
  actions: ReactNode
  /** Mobile chapter navigation, pinned with the header. */
  strip?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "relative no-scrollbar flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain rounded-[14px] border border-fg/6 bg-card px-2 pb-2 [--panel-surface:var(--color-card)] max-lg:pb-0",
        className,
      )}
    >
      <div className="sticky top-0 z-20 -mx-2 mb-2 flex shrink-0 flex-col border-b border-fg/6 bg-card p-2 max-lg:mb-0 max-lg:py-1.5 dock-stacked:top-auto dock-stacked:bottom-0 dock-stacked:order-last dock-stacked:border-t dock-stacked:border-b-0">
        <div className="flex items-center justify-between gap-2">
          <span className="flex min-w-0 flex-1 items-center">
            <NameField
              key={system.name}
              name={system.name}
              onRename={system.onRename}
            />
            {system.renderSwitcher(
              <Button
                variant="quiet"
                size="sm"
                isIconOnly
                aria-label="Switch design system"
                className="shrink-0 text-fg-muted pointer-coarse:data-icon-only:size-9"
              >
                <ChevronsUpDownIcon />
              </Button>,
            )}
          </span>
          <span className="flex shrink-0 items-center pointer-coarse:gap-1">
            {system.reset && (
              <Tooltip delay={0}>
                <Button
                  size="sm"
                  variant="quiet"
                  isIconOnly
                  aria-label={system.reset.label}
                  onPress={system.reset.onReset}
                  className="text-fg-muted pointer-coarse:data-icon-only:size-9"
                >
                  <RotateCcwIcon />
                </Button>
                <TooltipContent>{system.reset.label}</TooltipContent>
              </Tooltip>
            )}
            {actions}
          </span>
        </div>
        {strip}
      </div>
      {children}
    </div>
  )
}
