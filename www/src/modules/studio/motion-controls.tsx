"use client"

/* The motion registry: every animated component once, with its family, its
   state and its control. Each Components family ends its popover with its
   entries (FamilyMotion); the Motion chapter lays them all on one timeline.
   Both render the same Control on the same state.

   Synced followers ride their lead's state and var id — never a second key.
   They surface in their own family as the lead's control, marked "Shared
   with <lead>": menus and selects ride the popover, collapsibles the
   accordion, toggle buttons the button, radios the checkbox, attachments the
   skeleton. */

import { DEFAULTS } from "./axes"
import { MOTION_PATTERNS as ACCORDION_PATTERNS } from "./axes/accordion"
import { MOTION_OPTIONS as CHART_MOTION, motionOption } from "./axes/charts"
import { DRAWER_PATTERNS, MODAL_PATTERNS } from "./axes/dialogs"
import { MOTION_PATTERNS as MESSAGE_SCROLLER_PATTERNS } from "./axes/message-scroller"
import { bezierCss, curveTiming } from "./axes/motion"
import type { Curve, Entrance, Loop, StateChange } from "./axes/motion"
import { MOTION_PATTERNS as POPOVER_PATTERNS } from "./axes/popovers"
import { MOTION_PATTERNS as TOAST_PATTERNS } from "./axes/toast"
import { MOTION_PATTERNS as TOOLTIP_PATTERNS } from "./axes/tooltips"
import {
  DialGlyph,
  DialPopover,
  DialSelect,
  DialTrigger,
  optionLabel,
} from "./dial"
import type { DialSelectOption } from "./dial"
import {
  CurveGlyph,
  DialLoop,
  DialMotion,
  DialStateMotion,
  withEntranceGlyphs,
} from "./dial-motion"
import { GroupTitle } from "./rows"
import type { Studio, StudioState } from "./state"

type KeyOf<T> = {
  [K in keyof StudioState]: StudioState[K] extends T ? K : never
}[keyof StudioState]

/** How the board's specimen acts the motion out: a layer entering by its
 *  pattern, a panel expanding, a knob crossing its track, a ring's turn, a
 *  placeholder's breath, bars growing. */
export type Specimen = "layer" | "expand" | "knob" | "spin" | "pulse" | "grow"

export interface MotionEntry {
  id: string
  label: string
  /** The Components family whose popover carries it. */
  family: string
  kind: "entrance" | "state" | "loop" | "js"
  /** Its state; the board times the first key. */
  keys: [keyof StudioState, ...(keyof StudioState)[]]
  specimen: Specimen
  /** Entrance patterns, for the summary. */
  patterns?: DialSelectOption[]
  /** Components riding this entry's state (one key, one var id). */
  followers?: { label: string; family: string }[]
  Control: React.ComponentType<{ studio: Studio }>
}

type Kind = Pick<MotionEntry, "kind" | "keys" | "patterns" | "Control">

const entrance = (
  key: KeyOf<Entrance>,
  patterns: DialSelectOption[],
  children?: (studio: Studio) => React.ReactNode,
): Kind => ({
  kind: "entrance",
  keys: [key],
  patterns,
  Control: function EntranceMotion({ studio }) {
    return (
      <DialMotion
        value={studio.state[key]}
        onChange={studio.set(key)}
        patterns={patterns}
      >
        {children?.(studio)}
      </DialMotion>
    )
  },
})

const stateChange = (key: KeyOf<StateChange>, label = "Transition"): Kind => ({
  kind: "state",
  keys: [key],
  Control: function StateMotion({ studio }) {
    return (
      <DialStateMotion
        label={label}
        value={studio.state[key]}
        onChange={studio.set(key)}
      />
    )
  },
})

/** A keyframe loop; `curve` says when the loop has one to bend. */
const loop = (
  key: KeyOf<Loop>,
  curve?: (state: StudioState) => boolean,
): Kind => ({
  kind: "loop",
  keys: [key],
  Control: function LoopMotion({ studio }) {
    return (
      <DialLoop
        label="Cycle"
        value={studio.state[key]}
        onChange={studio.set(key)}
        curve={curve?.(studio.state) ?? true}
      />
    )
  },
})

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

/* Each transition's curve as its specimen; none draws the empty entrance. */
const CHART_MOTION_OPTIONS: DialSelectOption[] = CHART_MOTION.flatMap(
  ({ curve, ...option }) =>
    curve
      ? {
          ...option,
          preview: (
            <DialGlyph>
              <CurveGlyph curve={curve} />
            </DialGlyph>
          ),
        }
      : withEntranceGlyphs([option]),
)

/* ------------------------------- The registry ------------------------------ */

/* In the Components chapter's family order. */
export const MOTION: MotionEntry[] = [
  {
    id: "button",
    label: "Button",
    family: "Buttons",
    specimen: "knob",
    followers: [{ label: "Toggle button", family: "Buttons" }],
    ...stateChange("buttonMotion"),
  },
  {
    id: "segmented-control",
    label: "Segmented control",
    family: "Buttons",
    specimen: "knob",
    ...stateChange("segmentedControlMotion"),
  },
  {
    id: "input",
    label: "Input",
    family: "Inputs",
    specimen: "knob",
    ...stateChange("inputMotion"),
  },
  {
    id: "checkbox",
    label: "Checkbox",
    family: "Selection controls",
    specimen: "knob",
    followers: [{ label: "Radio", family: "Selection controls" }],
    ...stateChange("checkboxMotion"),
  },
  {
    id: "switch",
    label: "Switch",
    family: "Selection controls",
    specimen: "knob",
    ...stateChange("switchMotion"),
  },
  {
    id: "questionnaire",
    label: "Questionnaire",
    family: "Selection controls",
    specimen: "knob",
    ...stateChange("questionnaireMotion"),
  },
  {
    id: "calendar",
    label: "Calendar",
    family: "Pickers",
    specimen: "knob",
    ...stateChange("calendarMotion"),
  },
  {
    id: "time-picker",
    label: "Time picker",
    family: "Pickers",
    specimen: "knob",
    ...stateChange("timePickerMotion"),
  },
  {
    id: "color-swatch-picker",
    label: "Swatch picker",
    family: "Pickers",
    specimen: "knob",
    ...stateChange("colorSwatchPickerMotion"),
  },
  {
    id: "slider",
    label: "Slider",
    family: "Sliders",
    specimen: "knob",
    ...stateChange("sliderMotion"),
  },
  {
    id: "modal",
    label: "Dialog",
    family: "Dialogs",
    specimen: "layer",
    ...entrance("modalMotion", withEntranceGlyphs(MODAL_PATTERNS)),
  },
  {
    id: "drawer",
    label: "Drawer",
    family: "Dialogs",
    specimen: "layer",
    ...entrance("drawerMotion", DRAWER_PATTERNS),
  },
  {
    id: "popover",
    label: "Popover",
    family: "Popovers",
    specimen: "layer",
    followers: [
      { label: "Menu", family: "Menus" },
      { label: "Select & combobox", family: "Pickers" },
    ],
    ...entrance("popoverMotion", withEntranceGlyphs(POPOVER_PATTERNS)),
  },
  {
    id: "tooltip",
    label: "Tooltip",
    family: "Popovers",
    specimen: "layer",
    ...entrance("tooltipMotion", withEntranceGlyphs(TOOLTIP_PATTERNS)),
  },
  {
    id: "toast",
    label: "Toast",
    family: "Toast",
    specimen: "layer",
    // How one swiped away finishes the throw rides the entrance's rows.
    ...entrance("toastMotion", withEntranceGlyphs(TOAST_PATTERNS), (studio) => (
      <DialStateMotion
        label="Swipe"
        value={studio.state.toastSwipeMotion}
        onChange={studio.set("toastSwipeMotion")}
      />
    )),
    keys: ["toastMotion", "toastSwipeMotion"],
  },
  {
    id: "link",
    label: "Link",
    family: "Navigation",
    specimen: "knob",
    ...stateChange("linkMotion"),
  },
  {
    id: "tabs",
    label: "Tabs",
    family: "Navigation",
    specimen: "knob",
    ...stateChange("tabsMotion"),
  },
  {
    id: "breadcrumbs",
    label: "Breadcrumbs",
    family: "Navigation",
    specimen: "knob",
    ...stateChange("breadcrumbsMotion"),
  },
  {
    id: "sidebar",
    label: "Sidebar",
    family: "Navigation",
    specimen: "knob",
    ...stateChange("sidebarMotion", "Collapse"),
  },
  {
    id: "message-scroller",
    label: "Scroll to latest",
    family: "Navigation",
    specimen: "layer",
    ...entrance("messageScrollerMotion", MESSAGE_SCROLLER_PATTERNS),
  },
  {
    id: "loader",
    label: "Spinner",
    family: "Loading",
    specimen: "spin",
    // Only the ring's turn bends: blades tick in steps, dots keep their breath.
    ...loop("loaderMotion", (state) => state.spinnerStyle === "ring"),
  },
  {
    id: "skeleton",
    label: "Skeleton",
    family: "Loading",
    specimen: "pulse",
    followers: [{ label: "Attachment", family: "Loading" }],
    ...loop("skeletonMotion"),
  },
  {
    id: "progress",
    label: "Progress",
    family: "Loading",
    specimen: "knob",
    ...stateChange("progressMotion", "Fill"),
  },
  {
    id: "tag",
    label: "Tag",
    family: "Badges",
    specimen: "knob",
    ...stateChange("tagMotion"),
  },
  {
    id: "table",
    label: "Table",
    family: "Tables",
    specimen: "knob",
    ...stateChange("tableMotion"),
  },
  {
    id: "accordion",
    label: "Accordion",
    family: "Accordion",
    specimen: "expand",
    followers: [{ label: "Collapsible", family: "Accordion" }],
    ...entrance(
      "accordionMotion",
      ACCORDION_PATTERNS.map((option) => ({
        ...option,
        preview: (
          <DialGlyph>
            <ExpandGlyph pattern={option.value} />
          </DialGlyph>
        ),
      })),
    ),
  },
  {
    // Charts animate their marks' geometry in JS, not CSS: the motion is a
    // named transition the publisher folds to its literal, not a timing.
    id: "chart",
    label: "Chart",
    family: "Charts",
    kind: "js",
    keys: ["chartMotion"],
    specimen: "grow",
    Control: function ChartMotion({ studio }) {
      return (
        <DialSelect
          label="Transition"
          value={motionOption(studio.state.chartMotion)}
          onChange={studio.set("chartMotion")}
          options={CHART_MOTION_OPTIONS}
        />
      )
    },
  },
]

/** Every motion key: the Motion chapter's slice. */
export const MOTION_DEFAULTS: Partial<StudioState> = Object.fromEntries(
  MOTION.flatMap((entry) => entry.keys.map((key) => [key, DEFAULTS[key]])),
)

/* --------------------------------- Timing --------------------------------- */

/** An entry's motion in CSS terms, in ms; `off` when nothing moves. */
export interface Timing {
  off: boolean
  enter: number
  ease: string
  exit?: number
  exitEase?: string
  pattern?: string
  /** The curve the row's glyph draws. */
  curve?: Curve
}

export function timingOf(entry: MotionEntry, state: StudioState): Timing {
  const value = state[entry.keys[0]]
  if (entry.kind === "entrance") {
    const v = value as Entrance
    const { ms, ease } = curveTiming(v.curve, v.enter)
    return {
      off: v.pattern === "none",
      enter: ms,
      ease,
      exit: v.exit,
      exitEase: v.exitEase && bezierCss(v.exitEase),
      pattern: v.pattern,
      curve: v.curve,
    }
  }
  if (entry.kind === "js") {
    const option = CHART_MOTION.find(
      (o) => o.value === motionOption(value as string),
    )
    if (!option?.curve) return { off: true, enter: 0, ease: "linear" }
    // The tween's 400ms is the chart's own; a spring times itself.
    const { ms, ease } = curveTiming(option.curve, 400)
    return { off: false, enter: ms, ease, curve: option.curve }
  }
  const v = value as StateChange | Loop
  return {
    off: false,
    enter: "cycle" in v ? v.cycle : v.duration,
    ease: bezierCss(v.ease),
    curve: { type: "easing", ease: v.ease },
  }
}

export const formatMs = (ms: number) => `${Math.round(ms)}ms`

/** The row's value: the pattern and how long it takes, or the pick. */
export function summaryOf(entry: MotionEntry, state: StudioState): string {
  if (entry.kind === "js")
    return optionLabel(CHART_MOTION, motionOption(state.chartMotion))
  const timing = timingOf(entry, state)
  if (entry.kind !== "entrance" || (entry.patterns?.length ?? 0) < 2)
    return timing.off ? "None" : formatMs(timing.enter)
  const pattern = optionLabel(entry.patterns ?? [], timing.pattern ?? "")
  return timing.off ? pattern : `${pattern} · ${formatMs(timing.enter)}`
}

export const isModified = (entry: MotionEntry, state: StudioState) =>
  entry.keys.some(
    (key) => JSON.stringify(state[key]) !== JSON.stringify(DEFAULTS[key]),
  )

/* ---------------------------------- Rows ---------------------------------- */

/** A component as a family or the board lists it: an entry under its own
 *  label, or a follower under its own label on the lead's entry. */
export interface MotionRow {
  id: string
  label: string
  entry: MotionEntry
  /** Who else the control drives, or whose it is. */
  hint?: string
  follower?: boolean
}

export function familyRows(family: string): MotionRow[] {
  const rows: MotionRow[] = []
  for (const entry of MOTION) {
    if (entry.family === family) {
      const also = entry.followers?.map((f) => f.label)
      rows.push({
        id: entry.id,
        label: entry.label,
        entry,
        hint: also?.length ? `Also drives ${also.join(", ")}` : undefined,
      })
    }
    for (const follower of entry.followers ?? []) {
      if (follower.family === family && entry.family !== family)
        rows.push({
          id: `${entry.id}/${follower.label}`,
          label: follower.label,
          entry,
          hint: `Shared with ${entry.label}`,
          follower: true,
        })
    }
  }
  return rows
}

export function MotionHint({ row }: { row: MotionRow }) {
  if (!row.hint) return null
  return <p className="px-1 pb-0.5 text-xs text-fg/50">{row.hint}</p>
}

/** A row's value: the summary, and its curve's specimen. */
export function MotionValue({
  entry,
  state,
}: {
  entry: MotionEntry
  state: StudioState
}) {
  const timing = timingOf(entry, state)
  return (
    <>
      <span className="truncate">{summaryOf(entry, state)}</span>
      {!timing.off && timing.curve && (
        <DialGlyph>
          <CurveGlyph curve={timing.curve} />
        </DialGlyph>
      )}
    </>
  )
}

/** The group that closes a family's popover: a row per animated component,
 *  each opening its control. Nothing for a family that doesn't move. */
export function FamilyMotion({
  family,
  studio,
}: {
  family: string
  studio: Studio
}) {
  const rows = familyRows(family)
  if (rows.length === 0) return null
  return (
    <>
      <GroupTitle>Motion</GroupTitle>
      {rows.map((row) => (
        <DialTrigger
          key={row.id}
          label={row.label}
          value={<MotionValue entry={row.entry} state={studio.state} />}
        >
          <DialPopover>
            <MotionHint row={row} />
            <row.entry.Control studio={studio} />
          </DialPopover>
        </DialTrigger>
      ))}
    </>
  )
}
