import type { ReactNode } from "react"

import { cn } from "@/registry/lib/utils"
import { useStyles as useDrawerStyles } from "@/registry/ui/drawer/styles"
import { useStyles as useModalStyles } from "@/registry/ui/modal/styles"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
import { useStyles as useTooltipStyles } from "@/registry/ui/tooltip/styles"

/**
 * Frozen-open overlay compositions for the preview cards. Triggers and surfaces
 * use the real components' styles, but the open state is static so nothing
 * portals out of the card or touches focus.
 */

export type SurfaceVariant = "popover" | "menu" | "modal" | "tooltip"

// The ancestor data attribute the real Dialog* sub-components key their
// in-context padding on (`in-data-popover:` / `in-data-modal:`).
const SURFACE_DATA: Partial<Record<SurfaceVariant, Record<string, string>>> = {
  popover: { "data-popover": "" },
  menu: { "data-popover": "" },
  modal: { "data-modal": "" },
}

const SURFACE_EXTRA: Record<SurfaceVariant, string> = {
  popover: "p-2.5 text-xs/relaxed",
  menu: "p-1",
  modal: "p-4 text-sm",
  tooltip: "",
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
  const { popover } = usePopoverStyles()()
  const { modal } = useModalStyles()()
  const { content: tooltip } = useTooltipStyles()()
  const frame = { popover, menu: popover, modal, tooltip }[variant]
  return (
    <div
      {...SURFACE_DATA[variant]}
      className={frame({ className: cn(SURFACE_EXTRA[variant], className) })}
    >
      {children}
    </div>
  )
}

/** A page mock (header + text and card blocks) for modal and drawer scenes, so
 *  the overlay reads as opened over real content. */
export function PageMock() {
  return (
    <div className="absolute inset-0 flex flex-col gap-3 p-4 *:shrink-0">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded-full bg-muted" />
        <div className="size-6 rounded-full bg-muted" />
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-muted" />
      <div className="h-1.5 w-5/6 rounded-full bg-muted" />
      <div className="h-1.5 w-2/3 rounded-full bg-muted" />
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div className="h-16 rounded-lg bg-muted" />
        <div className="h-16 rounded-lg bg-muted" />
      </div>
    </div>
  )
}

/** A bottom drawer over a page mock, built from the real drawer slots so its
 *  edge, radius and surface follow the design system. */
export function DrawerPreview({ children }: { children: ReactNode }) {
  const { overlay, backdrop, viewport, popup } = useDrawerStyles()()
  return (
    <div className={overlay({ className: "absolute z-0" })}>
      <PageMock />
      <div aria-hidden className={backdrop()} />
      <div className={viewport({ placement: "bottom", className: "absolute" })}>
        <div data-drawer="" className={popup({ placement: "bottom" })}>
          <div className="p-4 text-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}

/**
 * Trigger + open surface, filling the card (`fill` demos). Anchored surfaces
 * hang below a top-aligned trigger (`align` picks centered or bottom-left) and
 * crop at the card's bottom edge; a modal floats over a dimmed page.
 */
export function OverlayPreview({
  variant,
  trigger,
  align = "center",
  className,
  surfaceClassName,
  children,
}: {
  variant: Exclude<SurfaceVariant, "tooltip">
  trigger?: ReactNode
  /** Extra classes for the anchored scene, e.g. a roomier inset. */
  className?: string
  align?: "start" | "center"
  surfaceClassName?: string
  children: ReactNode
}) {
  const { backdrop } = useModalStyles()()
  if (variant === "modal") {
    return (
      <div className="absolute inset-0">
        <PageMock />
        <div aria-hidden className={backdrop()} />
        <div className="absolute inset-0 flex items-center justify-center">
          {/* A real-width modal scaled down, so it reads as a dialog over a
              page rather than a card. */}
          <Surface
            variant="modal"
            className={cn("w-96 shrink-0 scale-[0.55]", surfaceClassName)}
          >
            {children}
          </Surface>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-start justify-center px-4 pt-4",
        className,
      )}
    >
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
