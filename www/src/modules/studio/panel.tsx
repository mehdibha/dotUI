"use client"

/* The panel chrome, after DialKit: one 14px-radius card, its header fixed
   over a hairline — the design-system picker's trigger on the left, Reset,
   Save and search on the right — and only the body below it scrolls, an open
   page's Back and title pinned at its top over a progressive blur. Docked
   under the preview, the header and strip sit at the bottom edge instead, so
   they stay put as the dock hugs each chapter. */

import type { ReactNode, Ref } from "react"
import { ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { ProgressiveBlur } from "@/components/progressive-blur"

/** The current design system, as the chrome shows it. */
export interface PanelSystem {
  name: string
  /** The end of the name that stays when the rest truncates. */
  note?: string
  swatch: string
  /** Reset and Save. */
  buttons: ReactNode
  /** Wraps the trigger in the design-system picker. */
  renderSwitcher: (trigger: ReactNode) => ReactNode
  triggerRef?: Ref<HTMLButtonElement>
}

export function PanelChrome({
  system,
  actions,
  strip,
  page,
  scrollRef,
  className,
  children,
}: {
  system: PanelSystem
  /** Search and the dock toggle, supplied by the page (it owns navigation). */
  actions: ReactNode
  /** Mobile chapter navigation, pinned with the header. */
  strip?: ReactNode
  /** An open page's Back and title, pinned at the top of the body. */
  page?: ReactNode
  scrollRef?: Ref<HTMLDivElement>
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        "relative flex h-full min-h-0 flex-col overflow-clip rounded-[14px] border border-fg/6 bg-card [--panel-surface:var(--color-card)]",
        className,
      )}
    >
      <div className="flex shrink-0 flex-col border-b border-fg/6 p-2 max-lg:py-1.5 dock-stacked:order-last dock-stacked:border-t dock-stacked:border-b-0">
        <div className="flex items-center justify-between gap-1">
          {system.renderSwitcher(
            <Tooltip>
              <Button
                ref={system.triggerRef}
                variant="quiet"
                size="sm"
                aria-label={`Design system: ${system.name}. Change design system`}
                className="min-w-0 shrink justify-start gap-1 pl-2 font-medium has-data-[icon=inline-end]:pr-1"
              >
                <span
                  aria-hidden
                  className="mr-0.5 size-2 shrink-0 rounded-full ring-1 ring-fg/10 ring-inset"
                  style={{ background: system.swatch }}
                />
                <span dir="auto" className="min-w-0 truncate">
                  {system.note
                    ? system.name.slice(0, -system.note.length).trimEnd()
                    : system.name}
                </span>
                {system.note && <span className="shrink-0">{system.note}</span>}
                <ChevronsUpDownIcon
                  data-icon="inline-end"
                  className="size-3 shrink-0 text-fg-muted"
                />
              </Button>
              <TooltipContent>{system.name}</TooltipContent>
            </Tooltip>,
          )}
          <span className="flex shrink-0 items-center gap-1">
            {system.buttons}
            {actions}
          </span>
        </div>
        {strip}
      </div>
      <div
        ref={scrollRef}
        className={cn(
          "no-scrollbar flex min-h-0 grow flex-col overflow-y-auto overscroll-contain px-2 py-4 max-lg:py-0",
          // Rows land below the pinned page header.
          page ? "scroll-pt-14" : "scroll-pt-4",
        )}
      >
        {page && (
          <div className="sticky -top-4 z-10 -mx-2 -mt-4 flex h-11 shrink-0 items-center px-2 not-supports-[animation-timeline:scroll()]:bg-card max-lg:top-0 max-lg:mt-0">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[140%] blur-reveal-nearest [--blur-reveal-range:3rem] [--blur-tint:var(--panel-surface)]"
            >
              <ProgressiveBlur />
            </div>
            {page}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
