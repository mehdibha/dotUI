"use client"

/* Every animated component's motion control, bound to its state key once:
   the component's own section renders it in place, the Motion chapter
   renders them all. Synced followers ride their lead's control — menus,
   selects and pickers the popover's, collapsibles the accordion's, toggle
   buttons the button's, radios the checkbox's. */

import { MOTION_PATTERNS as ACCORDION_PATTERNS } from "./axes/accordion"
import { DRAWER_PATTERNS, MODAL_PATTERNS } from "./axes/dialogs"
import type { Entrance, StateChange } from "./axes/motion"
import { MOTION_PATTERNS as POPOVER_PATTERNS } from "./axes/popovers"
import { MOTION_PATTERNS as TOAST_PATTERNS } from "./axes/toast"
import { MOTION_PATTERNS as TOOLTIP_PATTERNS } from "./axes/tooltips"
import { DialGlyph } from "./dial"
import type { DialSelectOption } from "./dial"
import { DialMotion, DialStateMotion, withEntranceGlyphs } from "./dial-motion"
import type { Studio, StudioState } from "./state"

type KeyOf<T> = {
  [K in keyof StudioState]: StudioState[K] extends T ? K : never
}[keyof StudioState]

interface EntranceProps {
  studio: Studio
  label: string
  defaultOpen?: boolean
  children?: React.ReactNode
}

const entrance = (key: KeyOf<Entrance>, patterns: DialSelectOption[]) =>
  function EntranceMotion({ studio, ...props }: EntranceProps) {
    return (
      <DialMotion
        {...props}
        value={studio.state[key]}
        onChange={studio.set(key)}
        patterns={patterns}
      />
    )
  }

const stateChange = (key: KeyOf<StateChange>) =>
  function StateMotion({
    studio,
    ...props
  }: {
    studio: Studio
    label: string
    title?: string
  }) {
    return (
      <DialStateMotion
        {...props}
        value={studio.state[key]}
        onChange={studio.set(key)}
      />
    )
  }

/** A trigger over its open panel: arrowed when it grows, faint when it also
 *  fades, plain when it snaps open. */
function ExpandGlyph({ pattern }: { pattern: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="4" width="16" height="4" rx="1.5" fill="currentColor" />
      <rect
        x="4.75"
        y="10.75"
        width="14.5"
        height="9.5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity={pattern === "fade" ? 0.35 : 1}
      />
      {pattern !== "none" && (
        <path
          d="M12 12.75v5m0 0-2-2m2 2 2-2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

/* -------------------------------- Overlays -------------------------------- */

export const PopoverMotion = entrance(
  "popoverMotion",
  withEntranceGlyphs(POPOVER_PATTERNS),
)
export const TooltipMotion = entrance(
  "tooltipMotion",
  withEntranceGlyphs(TOOLTIP_PATTERNS),
)
export const ModalMotion = entrance(
  "modalMotion",
  withEntranceGlyphs(MODAL_PATTERNS),
)
export const DrawerMotion = entrance("drawerMotion", DRAWER_PATTERNS)

const ToastEntrance = entrance(
  "toastMotion",
  withEntranceGlyphs(TOAST_PATTERNS),
)
const ToastSwipe = stateChange("toastSwipeMotion")

/** The toast's entrance, and how one swiped away finishes the throw. */
export function ToastMotion(props: Omit<EntranceProps, "children">) {
  return (
    <ToastEntrance {...props}>
      <ToastSwipe studio={props.studio} label="Swipe" />
    </ToastEntrance>
  )
}

/* ------------------------------- Disclosure ------------------------------- */

export const AccordionMotion = entrance(
  "accordionMotion",
  ACCORDION_PATTERNS.map((option) => ({
    ...option,
    preview: (
      <DialGlyph>
        <ExpandGlyph pattern={option.value} />
      </DialGlyph>
    ),
  })),
)
export const SidebarMotion = stateChange("sidebarMotion")

/* ------------------------------- Indicators ------------------------------- */

export const TabsMotion = stateChange("tabsMotion")
export const SegmentedControlMotion = stateChange("segmentedControlMotion")
export const SwitchMotion = stateChange("switchMotion")
export const ProgressMotion = stateChange("progressMotion")

/* -------------------------------- Controls -------------------------------- */

export const ButtonMotion = stateChange("buttonMotion")
export const CheckboxMotion = stateChange("checkboxMotion")
export const InputMotion = stateChange("inputMotion")
export const SliderMotion = stateChange("sliderMotion")
export const LinkMotion = stateChange("linkMotion")
export const TagMotion = stateChange("tagMotion")
export const CalendarMotion = stateChange("calendarMotion")
