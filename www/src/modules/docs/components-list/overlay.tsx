import type { ReactNode } from "react"

import { cn } from "@/registry/lib/utils"

/**
 * Frozen-open overlay compositions for the preview cards. The trigger is a real
 * component and the surface uses the real token classes, but the open state is
 * static so nothing portals out of the card or touches focus.
 */

export type SurfaceVariant = "popover" | "menu" | "modal" | "drawer" | "tooltip"

const SURFACE_FRAME: Record<SurfaceVariant, string> = {
  popover:
    "rounded-(--popover-radius) border bg-popover p-2.5 text-xs/relaxed shadow-md",
  menu: "rounded-(--popover-radius) border bg-popover p-1 shadow-md",
  modal:
    "rounded-(--modal-radius) border bg-(--modal-background) p-4 text-sm shadow-lg",
  drawer: "rounded-t-(--radius-xl) border-t bg-bg p-4 text-sm shadow-lg",
  tooltip:
    "rounded-(--tooltip-radius) bg-tooltip px-3 py-1.5 text-center text-xs text-fg-on-tooltip shadow-md",
}

// The ancestor data attribute the real Dialog* sub-components key their
// in-context padding on (`in-data-popover:` / `in-data-modal:`).
const SURFACE_DATA: Partial<Record<SurfaceVariant, Record<string, string>>> = {
  popover: { "data-popover": "" },
  menu: { "data-popover": "" },
  modal: { "data-modal": "" },
}

export function Surface({
  variant,
  className,
  children,
}: {
  variant: SurfaceVariant
  className?: string
  children: ReactNode
}) {
  return (
    <div
      {...SURFACE_DATA[variant]}
      className={cn(SURFACE_FRAME[variant], className)}
    >
      {children}
    </div>
  )
}

/**
 * Trigger + open surface, filling the card (`fill` demos). Anchored surfaces
 * hang below a top-aligned trigger (`align` picks centered or bottom-left) and crop at the card's bottom edge; modal
 * and drawer float over a dimmed backdrop.
 */
export function OverlayPreview({
  variant,
  trigger,
  align = "center",
  surfaceClassName,
  children,
}: {
  variant: SurfaceVariant
  trigger: ReactNode
  /** Where the surface sits relative to the trigger: centered under it, or
   *  flush with its left edge (bottom-left placement). */
  align?: "start" | "center"
  surfaceClassName?: string
  children: ReactNode
}) {
  if (variant === "modal" || variant === "drawer") {
    return (
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-4 flex justify-center">
          {trigger}
        </div>
        <div
          aria-hidden
          className={cn(
            "absolute inset-0",
            variant === "modal"
              ? "bg-overlay/(--modal-backdrop-opacity) backdrop-blur-(--modal-backdrop-blur)"
              : "bg-overlay/70",
          )}
        />
        {variant === "modal" ? (
          <div className="absolute inset-x-6 top-6 flex justify-center">
            <Surface
              variant="modal"
              className={cn("w-full max-w-[13rem]", surfaceClassName)}
            >
              {children}
            </Surface>
          </div>
        ) : (
          <div className="absolute inset-x-3 bottom-0">
            <Surface variant="drawer" className={surfaceClassName}>
              {children}
            </Surface>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="absolute inset-0 flex justify-center px-4 pt-4">
      <div
        className={cn(
          "flex w-full flex-col gap-2",
          align === "start" ? "items-start" : "items-center",
        )}
      >
        {trigger}
        <Surface variant={variant} className={surfaceClassName}>
          {children}
        </Surface>
      </div>
    </div>
  )
}
