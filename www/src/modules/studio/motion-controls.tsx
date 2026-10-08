"use client"

/* Every animated component once, with its state and control. Followers
   (synced group members) ride their lead's key, never a second one. */

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { cn } from "@/registry/lib/utils"

import type { StudioStateInput } from "./axes"
import { MOTION_PATTERNS as ACCORDION_PATTERNS } from "./axes/accordion"
import { MOTION_OPTIONS as CHART_MOTION } from "./axes/charts"
import { MODAL_PATTERNS } from "./axes/dialogs"
import { MOTION_PATTERNS as MESSAGE_SCROLLER_PATTERNS } from "./axes/message-scroller"
import { bezierCss, curveTiming, formatMs } from "./axes/motion"
import type { Curve, Entrance, Loop, StateChange } from "./axes/motion"
import type { MotionPreset } from "./axes/motion-presets"
import { MOTION_PATTERNS as POPOVER_PATTERNS } from "./axes/popovers"
import { sameValue } from "./axes/schema"
import { MOTION_PATTERNS as TOAST_PATTERNS } from "./axes/toast"
import { MOTION_PATTERNS as TOOLTIP_PATTERNS } from "./axes/tooltips"
import {
  DIAL_CHEVRON,
  DIAL_LABEL,
  DIAL_PRESS,
  DIAL_ROW,
  DialChips,
  DialGlyph,
  ModifiedDot,
  optionLabel,
} from "./dial"
import {
  CurveGlyph,
  DialLoop,
  DialMotion,
  DialStateMotion,
} from "./dial-motion"
import type { Studio, StudioState } from "./state"

type Pattern = { value: string; label: string }

type KeyOf<T> = {
  [K in keyof StudioStateInput]: StudioStateInput[K] extends T ? K : never
}[keyof StudioStateInput]

export interface MotionEntry {
  id: string
  label: string
  kind: "entrance" | "state" | "loop" | "js"
  /** Its state; the first key is the one timed. */
  keys: [keyof StudioStateInput, ...(keyof StudioStateInput)[]]
  /** Entrance patterns, for the summary. */
  patterns?: Pattern[]
  /** Components riding this entry's state (one key, one var id). */
  followers?: string[]
  Control: React.ComponentType<{ studio: Studio }>
}

type Kind = Pick<MotionEntry, "kind" | "keys" | "patterns" | "Control">

const entrance = (
  key: KeyOf<Entrance>,
  patterns: Pattern[],
  swipe?: KeyOf<StateChange>,
): Kind => ({
  kind: "entrance",
  keys: swipe ? [key, swipe] : [key],
  patterns,
  Control: function EntranceMotion({ studio }) {
    return (
      <DialMotion
        value={studio.state[key]}
        onChange={studio.set(key)}
        patterns={patterns}
        swipe={
          swipe && {
            value: studio.state[swipe],
            onChange: studio.set(swipe),
          }
        }
      />
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

/* ------------------------------- The registry ------------------------------ */

/* In the Components chapter's family order. */
export const MOTION: MotionEntry[] = [
  {
    id: "button",
    label: "Button",
    followers: ["Toggle button"],
    ...stateChange("buttonMotion"),
  },
  {
    id: "segmented-control",
    label: "Segmented control",
    ...stateChange("segmentedControlMotion"),
  },
  {
    id: "input",
    label: "Input",
    ...stateChange("inputMotion"),
  },
  {
    id: "checkbox",
    label: "Checkbox",
    followers: ["Radio"],
    ...stateChange("checkboxMotion"),
  },
  {
    id: "switch",
    label: "Switch",
    ...stateChange("switchMotion"),
  },
  {
    id: "questionnaire",
    label: "Questionnaire",
    ...stateChange("questionnaireMotion"),
  },
  {
    id: "calendar",
    label: "Calendar",
    ...stateChange("calendarMotion"),
  },
  {
    id: "time-picker",
    label: "Time picker",
    ...stateChange("timePickerMotion"),
  },
  {
    id: "color-swatch-picker",
    label: "Swatch picker",
    ...stateChange("colorSwatchPickerMotion"),
  },
  {
    id: "slider",
    label: "Slider",
    ...stateChange("sliderMotion"),
  },
  {
    id: "modal",
    label: "Dialog",
    ...entrance("modalMotion", MODAL_PATTERNS),
  },
  {
    id: "popover",
    label: "Popover",
    followers: ["Menu", "Select & combobox"],
    ...entrance("popoverMotion", POPOVER_PATTERNS),
  },
  {
    id: "tooltip",
    label: "Tooltip",
    ...entrance("tooltipMotion", TOOLTIP_PATTERNS),
  },
  {
    id: "toast",
    label: "Toast",
    // How one swiped away finishes the throw rides the entrance's rows.
    ...entrance("toastMotion", TOAST_PATTERNS, "toastSwipeMotion"),
  },
  {
    id: "link",
    label: "Link",
    ...stateChange("linkMotion"),
  },
  {
    id: "tabs",
    label: "Tabs",
    ...stateChange("tabsMotion"),
  },
  {
    id: "breadcrumbs",
    label: "Breadcrumbs",
    ...stateChange("breadcrumbsMotion"),
  },
  {
    id: "sidebar",
    label: "Sidebar",
    ...stateChange("sidebarMotion", "Collapse"),
  },
  {
    id: "message-scroller",
    label: "Scroll to latest",
    ...entrance("messageScrollerMotion", MESSAGE_SCROLLER_PATTERNS),
  },
  {
    id: "loader",
    label: "Spinner",
    // Only the ring's turn bends: blades tick in steps, dots keep their breath.
    ...loop("loaderMotion", (state) => state.spinnerStyle === "ring"),
  },
  {
    id: "skeleton",
    label: "Skeleton",
    followers: ["Attachment"],
    ...loop("skeletonMotion"),
  },
  {
    id: "progress",
    label: "Progress",
    ...stateChange("progressMotion", "Fill"),
  },
  {
    id: "tag",
    label: "Tag",
    ...stateChange("tagMotion"),
  },
  {
    id: "table",
    label: "Table",
    ...stateChange("tableMotion"),
  },
  {
    id: "accordion",
    label: "Accordion",
    followers: ["Collapsible"],
    ...entrance(
      "accordionMotion",
      ACCORDION_PATTERNS.map(({ value, label }) => ({
        value,
        label: value === "fade" ? "Fade" : label,
      })),
    ),
  },
  {
    // Charts animate their marks' geometry in JS, not CSS: the motion is a
    // named transition the publisher folds to its literal, not a timing.
    id: "chart",
    label: "Chart",
    kind: "js",
    keys: ["chartMotion"],
    Control: function ChartMotion({ studio }) {
      return (
        <DialChips
          label="Transition"
          value={studio.state.chartMotion}
          onChange={studio.set("chartMotion")}
          options={CHART_MOTION}
        />
      )
    },
  },
]

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
    const option = CHART_MOTION.find((o) => o.value === value)
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

/** The row's value: the pattern and how long it takes, or the pick. */
export function summaryOf(entry: MotionEntry, state: StudioState): string {
  if (entry.kind === "js") return optionLabel(CHART_MOTION, state.chartMotion)
  const timing = timingOf(entry, state)
  if (entry.kind !== "entrance" || (entry.patterns?.length ?? 0) < 2)
    return timing.off ? "None" : formatMs(timing.enter)
  const pattern = optionLabel(entry.patterns ?? [], timing.pattern ?? "")
  return timing.off ? pattern : `${pattern} · ${formatMs(timing.enter)}`
}

/** Whether an entry leaves the preset the system sits on. */
export const differs = (
  entry: MotionEntry,
  state: StudioState,
  base: MotionPreset,
) => entry.keys.some((key) => !sameValue(state[key], base.values[key as never]))

/** The span of the entries' timed legs, e.g. "100–450ms". */
export function tempo(entries: MotionEntry[], state: StudioState) {
  const legs = entries.flatMap((entry) => {
    const t = timingOf(entry, state)
    return t.off ? [] : [t.enter, t.exit ?? t.enter].filter((ms) => ms > 0)
  })
  if (legs.length === 0) return "Instant"
  const [low, high] = [Math.min(...legs), Math.max(...legs)]
  return low === high ? formatMs(low) : `${Math.round(low)}–${formatMs(high)}`
}

/* ---------------------------------- Rows ---------------------------------- */

/** A component's row in the Motion panel; it drills into its detail. */
export function MotionRow({
  entry,
  state,
  base,
  autoFocus,
  onOpen,
}: {
  entry: MotionEntry
  state: StudioState
  base: MotionPreset
  autoFocus: boolean
  onOpen: () => void
}) {
  const timing = timingOf(entry, state)
  return (
    <RacButton
      data-motion-row={entry.id}
      autoFocus={autoFocus}
      onPress={onOpen}
      className={cn(DIAL_ROW, DIAL_PRESS)}
    >
      <span className={DIAL_LABEL}>{entry.label}</span>
      <span className="flex min-w-0 items-center gap-2 text-[13px] font-medium text-fg/70">
        {differs(entry, state, base) && <ModifiedDot />}
        <span className="truncate">{summaryOf(entry, state)}</span>
        {!timing.off && timing.curve && (
          <DialGlyph>
            <CurveGlyph curve={timing.curve} />
          </DialGlyph>
        )}
        <ChevronRightIcon className={DIAL_CHEVRON} />
      </span>
    </RacButton>
  )
}

/** One component's controls, under a header that goes back. */
export function MotionDetail({
  entry,
  studio,
  base,
  onBack,
}: {
  entry: MotionEntry
  studio: Studio
  base: MotionPreset
  onBack: () => void
}) {
  return (
    <>
      <div className="flex h-9 shrink-0 items-center gap-1">
        <RacButton
          autoFocus
          aria-label="Back to all motion"
          onPress={onBack}
          className="flex size-7 cursor-interactive items-center justify-center rounded-md text-fg/60 focus-reset transition-colors hover:tint-10 hover:text-fg focus-visible:focus-ring pointer-coarse:size-9"
        >
          <ChevronLeftIcon className="size-4" />
        </RacButton>
        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-fg/70">
          {entry.label}
        </span>
        <span className="shrink-0 px-1.5 text-xs text-fg/50">{base.label}</span>
      </div>
      {entry.followers && (
        <p className="px-1 pb-0.5 text-xs text-fg/50">
          Also {entry.followers.join(", ")}
        </p>
      )}
      <entry.Control studio={studio} />
    </>
  )
}
