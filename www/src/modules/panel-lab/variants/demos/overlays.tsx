"use client"

/* Card demos for the overlay and navigation chapters — inert, span-based
   specimens of each chapter's hero, sized for the index card's demo strip
   (see demo.tsx). Panels taller than the card top-align via self-start
   pt-3.5 and crop at the bottom edge. */

import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"

import {
  CONTAINER as ACCORDION_CONTAINER,
  Marker,
} from "../../sections/accordion"
import { CRUMB_REST, Separator } from "../../sections/breadcrumbs"
import { buttonRadiusPx, styleLook } from "../../sections/buttons"
import { BACKDROP, DIALOG_POSITION } from "../../sections/dialogs"
import { HIGHLIGHT as MENU_HIGHLIGHT } from "../../sections/menus"
import { TAB_FAMILY, TAB_STRIP } from "../../sections/tabs"
import { TOOLTIP } from "../../sections/tooltips"
import type { LabState } from "../../state"

/** A mini menu panel: the first item selected and highlighted so indicator
 *  and highlight both land in the visible band; the rest crop below. */
export function MenusDemo({ state }: { state: LabState }) {
  const inset = state.menuInset === "inset"
  const indicator = state.menuIndicator
  const item = (
    label: string,
    flags: { selected?: boolean; highlighted?: boolean } = {},
  ) => (
    <span
      key={label}
      className={cn(
        "relative flex items-center gap-1.5 py-1.5 text-[0.8125rem]",
        inset ? "rounded-md px-2" : "px-3",
        flags.highlighted
          ? MENU_HIGHLIGHT[state.menuHighlight as keyof typeof MENU_HIGHLIGHT]
          : "text-fg",
      )}
    >
      {flags.highlighted && state.menuHighlight === "edge" && (
        <span className="absolute inset-y-0 left-0 w-0.5 bg-accent" />
      )}
      {indicator === "check-start" && (
        <span className="flex size-3.5 shrink-0 items-center justify-center">
          {flags.selected && <CheckIcon className="size-3.5" />}
        </span>
      )}
      <span className="flex-1 truncate">{label}</span>
      {indicator === "check-end" && flags.selected && (
        <CheckIcon className="size-3.5 shrink-0" />
      )}
    </span>
  )
  return (
    <span className="flex shrink-0 self-start pt-3.5">
      <span
        className={cn(
          "flex w-40 flex-col rounded-lg border border-border/60 bg-card shadow-lg",
          inset ? "p-1" : "py-1",
        )}
      >
        {item("In progress", { selected: true, highlighted: true })}
        {item("Backlog")}
        {item("Done")}
      </span>
    </span>
  )
}

/** A mini app viewport: skeleton page, the chosen backdrop over it, the
 *  dialog card resting at the chosen position — center sinks into the crop. */
export function DialogsDemo({ state }: { state: LabState }) {
  return (
    <span className="flex shrink-0 self-start pt-3.5">
      <span className="relative h-24 w-48 overflow-hidden rounded-md border border-border/60 bg-bg">
        <span className="flex flex-col gap-1.5 p-2">
          <span className="h-1.5 w-14 rounded-full bg-fg/20" />
          <span className="h-1 w-4/5 rounded-full bg-fg/10" />
          <span className="h-1 w-full rounded-full bg-fg/10" />
          <span className="h-1 w-3/5 rounded-full bg-fg/10" />
        </span>
        <span
          className={cn(
            "absolute inset-0",
            BACKDROP[state.dialogBackdrop as keyof typeof BACKDROP],
          )}
        />
        <span
          className={cn(
            "absolute left-1/2 flex w-28 -translate-x-1/2 flex-col rounded-md border border-border/60 bg-card p-2 shadow-xl",
            DIALOG_POSITION[
              state.dialogPosition as keyof typeof DIALOG_POSITION
            ],
          )}
        >
          <span className="h-1 w-10 rounded-full bg-fg/60" />
          <span className="mt-1.5 h-1 w-16 rounded-full bg-fg/15" />
          <span className="mt-2 flex justify-end gap-1">
            <span className="h-3 w-7 rounded-[3px] border border-border bg-muted" />
            <span className="h-3 w-7 rounded-[3px] bg-accent" />
          </span>
        </span>
      </span>
    </span>
  )
}

/** The anchored panel alone, wearing the tip and header treatments. */
export function PopoversDemo({ state }: { state: LabState }) {
  const header = state.popoverHeader
  const title = "Share project"
  return (
    <span className="flex shrink-0 self-start pt-3.5">
      <span className="relative w-44 rounded-lg border border-border/60 bg-card text-xs shadow-lg">
        {state.popoverTip === "tip" && (
          <span className="absolute -top-[4.5px] left-1/2 size-2 -translate-x-1/2 rotate-45 rounded-[1px] border-t border-l border-border/60 bg-card" />
        )}
        {header === "band" && (
          <span className="block rounded-t-lg border-b border-border/60 bg-muted/50 px-2.5 py-1 font-medium text-fg">
            {title}
          </span>
        )}
        <span className="flex flex-col gap-0.5 p-2.5">
          {header === "title" && (
            <span className="font-medium text-fg">{title}</span>
          )}
          <span className="text-[0.6875rem] text-fg-muted">
            Anyone with the link can view.
          </span>
          <span className="mt-1 h-5 rounded-md border border-border/60 bg-bg" />
        </span>
      </span>
    </span>
  )
}

/** The tooltip chip pinned over the icon it names, wearing the style axis. */
export function TooltipsDemo({ state }: { state: LabState }) {
  return (
    <span className="flex shrink-0 flex-col items-center gap-1.5">
      <span
        className={cn(
          "rounded-md px-1.5 py-0.5 text-[0.6875rem] font-medium",
          TOOLTIP[state.tooltipStyle as keyof typeof TOOLTIP],
        )}
      >
        Copy
      </span>
      <span className="flex size-6 items-center justify-center rounded-md border border-border/60 bg-card">
        <CopyIcon className="size-3 text-fg-muted" />
      </span>
    </span>
  )
}

/** The hero's strip with its content edge — first tab selected so the
 *  signature (line, pill, enclosed fuse) is fully visible before the fade. */
export function TabsDemo({ state }: { state: LabState }) {
  const style = state.tabStyle as keyof typeof TAB_FAMILY
  const tab = TAB_FAMILY[style]
  return (
    <span className="flex w-52 shrink-0 flex-col self-start pt-3.5 text-[0.8125rem] whitespace-nowrap">
      <span className={cn("flex", TAB_STRIP[style])}>
        {["Overview", "Activity", "Settings"].map((label) => {
          const selected = label === "Overview"
          return (
            <span
              key={label}
              className={cn(tab.base, selected ? tab.selected : tab.idle)}
            >
              {label}
            </span>
          )
        })}
      </span>
      <span
        className={cn(
          "flex flex-col gap-1.5 p-2.5",
          style === "enclosed" && "border-t border-border bg-card",
        )}
      >
        <span className="h-1.5 w-4/5 rounded-full bg-muted" />
        <span className="h-1.5 w-3/5 rounded-full bg-muted" />
      </span>
    </span>
  )
}

/** The trail at true size: two ancestor crumbs in the tone, current on fg. */
export function BreadcrumbsDemo({ state }: { state: LabState }) {
  const tone = state.breadcrumbTone as keyof typeof CRUMB_REST
  return (
    <span className="flex shrink-0 items-center gap-1.5 text-[0.8125rem] whitespace-nowrap">
      <span className={CRUMB_REST[tone]}>Home</span>
      <Separator state={state} />
      <span className={CRUMB_REST[tone]}>Projects</span>
      <Separator state={state} />
      <span className="text-fg">Settings</span>
    </span>
  )
}

const PAGE_ITEM =
  "flex h-8 min-w-8 shrink-0 items-center justify-center px-1 text-[0.8125rem] font-medium"

/** A short page run: quiet items in Buttons' language, the current page
 *  wearing its filled or outline emphasis. */
export function PaginationDemo({ state }: { state: LabState }) {
  const look = styleLook(state)
  const radius = buttonRadiusPx(state)
  const current =
    state.paginationCurrent === "outline"
      ? look.secondary
      : cn("bg-primary text-fg-on-primary", look.fill)
  const quiet = (key: string, children: React.ReactNode) => (
    <span
      key={key}
      className={cn(PAGE_ITEM, "text-fg")}
      style={{ borderRadius: radius }}
    >
      {children}
    </span>
  )
  return (
    <span className="flex shrink-0 items-center gap-1">
      {quiet("prev", <ChevronLeftIcon className="size-4" />)}
      {quiet("1", "1")}
      <span className={cn(PAGE_ITEM, current)} style={{ borderRadius: radius }}>
        2
      </span>
      {quiet("3", "3")}
      {quiet("next", <ChevronRightIcon className="size-4" />)}
    </span>
  )
}

/** Two collapsed rows wearing the container, marker and position axes —
 *  the second row crops at the card's bottom edge. */
export function AccordionDemo({ state }: { state: LabState }) {
  const container =
    ACCORDION_CONTAINER[
      state.accordionContainer as keyof typeof ACCORDION_CONTAINER
    ]
  const trailing = state.accordionMarkerPosition === "trailing"
  const row = (label: string) => (
    <span
      key={label}
      className={cn(
        "flex items-center gap-2 py-2.5",
        trailing && "justify-between",
        container.item,
      )}
    >
      {!trailing && <Marker open={false} state={state} />}
      <span className="text-[0.8125rem] font-medium text-fg">{label}</span>
      {trailing && <Marker open={false} state={state} />}
    </span>
  )
  return (
    <span className="flex shrink-0 self-start pt-3.5">
      <span className={cn("flex w-44 flex-col", container.list)}>
        {row("Shipping")}
        {row("Returns")}
      </span>
    </span>
  )
}
