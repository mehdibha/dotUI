/* Motion: role tables copied from real systems, each member timed by its component's own Motion (else the global one) into its `--studio-<id>-*` vars. */

import { defineChapter } from "./core/types"
import type { Follow } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { AxisSchema, ChapterSchema } from "./schema"

type Bezier = [number, number, number, number]

type Curve =
  | { type: "easing"; ease: Bezier }
  | { type: "physics"; stiffness: number; damping: number; mass: number }

/* --------------------------------- Springs -------------------------------- */

type Spring = Extract<Curve, { type: "physics" }>

/** Normalized position `t` seconds from rest; overshoots when underdamped. */
export function springProgress(
  t: number,
  { stiffness, damping, mass }: Spring,
): number {
  if (t <= 0) return 0
  const w0 = Math.sqrt(stiffness / mass)
  const zeta = damping / (2 * Math.sqrt(stiffness * mass))
  if (zeta < 0.9999) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta)
    return (
      1 -
      Math.exp(-zeta * w0 * t) *
        (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
    )
  }
  if (zeta < 1.0001) return 1 - Math.exp(-w0 * t) * (1 + w0 * t)
  const wd = w0 * Math.sqrt(zeta * zeta - 1)
  const r1 = -zeta * w0 + wd
  const r2 = -zeta * w0 - wd
  return 1 + (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r1 - r2)
}

/** Milliseconds until the spring stays within 0.1% of rest, to 10ms. */
export function springSettleMs(spring: Spring): number {
  let last = 0
  for (let ms = 0; ms <= 5000; ms += 5)
    if (Math.abs(1 - springProgress(ms / 1000, spring)) > 0.001) last = ms
  return Math.ceil((last + 5) / 10) * 10
}

/** Ramer–Douglas–Peucker: the samples a straight line would miss. */
function keep(
  ys: number[],
  from: number,
  to: number,
  tolerance: number,
): number[] {
  const y0 = ys[from] ?? 0
  const y1 = ys[to] ?? 0
  let worst = 0
  let at = 0
  for (let i = from + 1; i < to; i++) {
    const line = y0 + ((y1 - y0) * (i - from)) / (to - from)
    const off = Math.abs((ys[i] ?? 0) - line)
    if (off > worst) [worst, at] = [off, i]
  }
  if (worst <= tolerance) return []
  return [...keep(ys, from, at, tolerance), at, ...keep(ys, at, to, tolerance)]
}

/** The spring over `ms` as CSS `linear()`, sampled at every percent. */
function springLinear(spring: Spring, ms: number): string {
  const ys = Array.from({ length: 101 }, (_, i) =>
    springProgress((i / 100) * (ms / 1000), spring),
  )
  const stops = keep(ys, 0, 100, 0.005).map(
    (i) => `${Number((ys[i] ?? 0).toFixed(3))} ${i}%`,
  )
  return `linear(${["0", ...stops, "1"].join(", ")})`
}

/* ---------------------------------- CSS ----------------------------------- */

export function bezierCss([x1, y1, x2, y2]: Bezier): string {
  return x1 === 0 && y1 === 0 && x2 === 1 && y2 === 1
    ? "linear"
    : `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`
}

/** A leg in CSS terms; a spring runs for its settle time. */
export function legTiming({ ms, curve }: Leg) {
  if (curve.type === "easing") return { ease: bezierCss(curve.ease), ms }
  const settle = springSettleMs(curve)
  return { ease: springLinear(curve, settle), ms: settle }
}

/* ---------------------------------- Roles ---------------------------------- */

interface Leg {
  ms: number
  curve: Curve
}

interface RoleTiming {
  enter: Leg
  exit?: { ms: number; ease: Bezier }
}

type Role =
  | "micro" // fills: hover, press, focus, selection, colors
  | "travel" // something glides: thumb, indicator, progress fill
  | "layout" // the sidebar edge
  | "anchored" // popover, menu, select, combobox
  | "hint" // tooltip
  | "modal"
  | "sheet" // the drawer
  | "disclosure" // accordion, collapsible
  | "notification" // toast, jump-to-latest
  | "swipe" // a swiped toast finishing its throw

type MotionTable = Record<Role, RoleTiming>

const easing = (ms: number, ease: Bezier): Leg => ({
  ms,
  curve: { type: "easing", ease },
})
const spring = (stiffness: number, ratio: number): Leg => ({
  ms: 0,
  curve: {
    type: "physics",
    stiffness,
    damping: Number((ratio * 2 * Math.sqrt(stiffness)).toFixed(2)),
    mass: 1,
  },
})

const TAILWIND: Bezier = [0.4, 0, 0.2, 1]
const CSS_EASE: Bezier = [0.25, 0.1, 0.25, 1]
const CSS_EASE_OUT: Bezier = [0, 0, 0.58, 1]
const CSS_EASE_IN: Bezier = [0.42, 0, 1, 1]
const TAILWIND_OUT: Bezier = [0, 0, 0.2, 1]
const LINEAR: Bezier = [0, 0, 1, 1]
const EXPO_OUT: Bezier = [0.16, 1, 0.3, 1]

// shadcn (style-nova, Base UI drawer, Sonner).
const STANDARD: MotionTable = {
  micro: { enter: easing(150, TAILWIND) },
  travel: { enter: easing(150, TAILWIND) },
  layout: { enter: easing(200, LINEAR) },
  anchored: { enter: easing(100, CSS_EASE), exit: { ms: 100, ease: CSS_EASE } },
  hint: { enter: easing(150, CSS_EASE), exit: { ms: 150, ease: CSS_EASE } },
  modal: { enter: easing(100, CSS_EASE), exit: { ms: 100, ease: CSS_EASE } },
  sheet: {
    enter: easing(450, [0.22, 1, 0.36, 1]),
    exit: { ms: 400, ease: [0.22, 1, 0.36, 1] },
  },
  disclosure: { enter: easing(200, CSS_EASE_OUT) },
  notification: {
    enter: easing(400, CSS_EASE),
    exit: { ms: 400, ease: CSS_EASE },
  },
  swipe: { enter: easing(200, TAILWIND_OUT) },
}

// Radix Themes; accordion and toast from Radix Primitives' docs, the sheet from Vaul.
const SMOOTH: MotionTable = {
  micro: { enter: easing(120, CSS_EASE) },
  travel: { enter: easing(140, [0.45, 0.05, 0.55, 0.95]) },
  layout: { enter: easing(200, EXPO_OUT) },
  anchored: { enter: easing(160, EXPO_OUT), exit: { ms: 100, ease: EXPO_OUT } },
  hint: { enter: easing(140, EXPO_OUT), exit: { ms: 0, ease: EXPO_OUT } },
  modal: { enter: easing(200, EXPO_OUT), exit: { ms: 100, ease: EXPO_OUT } },
  sheet: {
    enter: easing(500, [0.32, 0.72, 0, 1]),
    exit: { ms: 500, ease: [0.32, 0.72, 0, 1] },
  },
  disclosure: { enter: easing(300, [0.87, 0, 0.13, 1]) },
  notification: {
    enter: easing(150, EXPO_OUT),
    exit: { ms: 100, ease: CSS_EASE_IN },
  },
  swipe: { enter: easing(100, CSS_EASE_OUT) },
}

// Material 3 Expressive: spatial springs move, effects springs fill, exits on emphasized accelerate.
const M3_EXIT = { ms: 200, ease: [0.3, 0, 0.8, 0.15] as Bezier }
const EXPRESSIVE: MotionTable = {
  micro: { enter: spring(3800, 1) },
  travel: { enter: spring(800, 0.6) },
  layout: { enter: spring(380, 0.8) },
  anchored: { enter: spring(380, 0.8), exit: M3_EXIT },
  hint: { enter: spring(380, 0.8), exit: M3_EXIT },
  modal: { enter: spring(380, 0.8), exit: M3_EXIT },
  sheet: { enter: spring(200, 0.8), exit: M3_EXIT },
  disclosure: { enter: spring(1600, 1) },
  notification: { enter: spring(380, 0.8), exit: M3_EXIT },
  swipe: { enter: easing(200, [0.05, 0.7, 0.1, 1]) },
}

const NONE = Object.fromEntries(
  Object.entries(STANDARD).map(([role, { enter, exit }]) => [
    role,
    {
      enter: { ...enter, ms: 0 },
      ...(exit ? { exit: { ...exit, ms: 0 } } : {}),
    },
  ]),
) as MotionTable

const TABLES: Record<string, MotionTable> = {
  none: NONE,
  standard: STANDARD,
  smooth: SMOOTH,
  expressive: EXPRESSIVE,
}

export const tableOf = (motion: string) => TABLES[motion] ?? STANDARD

/* ---------------------------------- Members -------------------------------- */

// `--studio-<id>-state-*`; radio rides checkbox's, toggle-button button's, token-field input's.
const STATE_MEMBERS: Record<string, Role> = {
  button: "micro",
  input: "micro",
  checkbox: "micro",
  slider: "micro",
  link: "micro",
  breadcrumbs: "micro",
  tag: "micro",
  table: "micro",
  calendar: "micro",
  "time-picker": "micro",
  "color-swatch-picker": "micro",
  questionnaire: "micro",
  switch: "travel",
  "segmented-control": "travel",
  tabs: "travel",
  progress: "travel",
  sidebar: "layout",
  "toast-swipe": "swipe",
}

// Colors on a gliding member: `--studio-<id>-color-*`, so a spatial spring never overshoots a fill.
const COLOR_MEMBERS = ["switch", "segmented-control", "tabs"]

// `--studio-<id>-enter-duration` / `-ease`, plus the exit pair; menu, select and combobox ride popover's.
const LAYER_MEMBERS: Record<string, { role: Role; exit: boolean }> = {
  popover: { role: "anchored", exit: true },
  tooltip: { role: "hint", exit: true },
  modal: { role: "modal", exit: true },
  drawer: { role: "sheet", exit: true },
  accordion: { role: "disclosure", exit: false },
  toast: { role: "notification", exit: true },
  "message-scroller": { role: "notification", exit: true },
}

/** Each member's vars, timed by its own table. */
export function motionVars(
  tableFor: (member: string) => MotionTable,
): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const [id, role] of Object.entries(STATE_MEMBERS)) {
    const { ms, ease } = legTiming(tableFor(id)[role].enter)
    vars[`--studio-${id}-state-duration`] = `${ms}ms`
    vars[`--studio-${id}-state-ease`] = ease
  }
  for (const id of COLOR_MEMBERS) {
    const color = legTiming(tableFor(id).micro.enter)
    vars[`--studio-${id}-color-duration`] = `${color.ms}ms`
    vars[`--studio-${id}-color-ease`] = color.ease
  }
  for (const [id, member] of Object.entries(LAYER_MEMBERS)) {
    const { enter, exit } = tableFor(id)[member.role]
    const { ms, ease } = legTiming(enter)
    vars[`--studio-${id}-enter-duration`] = `${ms}ms`
    vars[`--studio-${id}-ease`] = ease
    if (member.exit && exit) {
      vars[`--studio-${id}-exit-duration`] = `${exit.ms}ms`
      vars[`--studio-${id}-exit-ease`] = bezierCss(exit.ease)
    }
  }
  return vars
}

/* ---------------------------------- Chapter -------------------------------- */

export const MOTION_VALUES = ["standard", "smooth", "expressive"] as const

/** A component's own Motion can also stop it. */
export const COMPONENT_MOTION_VALUES = ["none", ...MOTION_VALUES] as const

export const ENTRANCE_VALUES = ["zoom", "slide", "fade"] as const

const ENTRANCE_PARAM: Record<string, string> = {
  zoom: "scale",
  slide: "slide",
  fade: "fade",
}

/** Each component's own Motion and the members it times; the rest ride
 *  `motion`. Radio rides checkbox's vars, so Checkbox times it. */
const COMPONENTS = {
  buttonMotion: ["button", "toggle-button"],
  segmentedMotion: ["segmented-control"],
  fieldMotion: ["input", "token-field"],
  checkboxMotion: ["checkbox"],
  switchMotion: ["switch"],
  sliderMotion: ["slider"],
  popoverMotion: ["popover"],
  tooltipMotion: ["tooltip"],
  dialogMotion: ["modal"],
  sheetMotion: ["drawer"],
  tabsMotion: ["tabs"],
  sidebarMotion: ["sidebar"],
  linkMotion: ["link", "breadcrumbs"],
  tableMotion: ["table"],
  accordionMotion: ["accordion", "collapsible"],
  calendarMotion: ["calendar", "time-picker"],
  toastMotion: ["toast", "toast-swipe"],
  progressMotion: ["progress"],
} as const

export type ComponentMotionKey = keyof typeof COMPONENTS

export const COMPONENT_MOTION_KEYS = Object.keys(
  COMPONENTS,
) as ComponentMotionKey[]

const KEY_OF: Record<string, ComponentMotionKey> = Object.fromEntries(
  COMPONENT_MOTION_KEYS.flatMap((key) =>
    COMPONENTS[key].map((id) => [id, key]),
  ),
)

export const MOTION_DEFAULTS = {
  motion: "standard",
  popoverEntrance: "zoom",
  tooltipEntrance: "zoom",
  ...(Object.fromEntries(
    COMPONENT_MOTION_KEYS.map((key) => [key, "same"]),
  ) as Record<ComponentMotionKey, string>),
}

export const MOTION_SCHEMA: ChapterSchema<typeof MOTION_DEFAULTS> = {
  motion: oneOf(MOTION_VALUES),
  popoverEntrance: oneOf(ENTRANCE_VALUES),
  tooltipEntrance: oneOf(ENTRANCE_VALUES),
  ...(Object.fromEntries(
    COMPONENT_MOTION_KEYS.map((key) => [key, oneOf(COMPONENT_MOTION_VALUES)]),
  ) as Record<ComponentMotionKey, AxisSchema>),
}

const SAME_AS_MOTION: readonly Follow[] = [
  { kind: "same", id: "same", from: "motion" },
]

const STANDARD_VARS = motionVars(() => STANDARD)

export function resolveMotion(state: Effective): Resolved {
  const motionOf = (member: string) => state[KEY_OF[member] ?? "motion"]
  const vars = motionVars((member) => tableOf(motionOf(member)))
  const off = (member: string) => motionOf(member) === "none"
  const entrance = (member: string, value: string) =>
    off(member) ? "none" : (ENTRANCE_PARAM[value] ?? "scale")
  return {
    // Only what leaves Standard: Origin writes nothing.
    tokens: Object.fromEntries(
      Object.entries(vars).filter(([name, v]) => STANDARD_VARS[name] !== v),
    ),
    params: {
      popover: { motion: entrance("popover", state.popoverEntrance) },
      tooltip: { motion: entrance("tooltip", state.tooltipEntrance) },
      toast: { motion: off("toast") ? "none" : "slide" },
      accordion: { motion: off("accordion") ? "none" : "expand" },
      collapsible: { motion: off("collapsible") ? "none" : "expand" },
    },
  }
}

export const chapter = defineChapter({
  id: "motion",
  defaults: MOTION_DEFAULTS,
  schema: MOTION_SCHEMA,
  resolve: resolveMotion,
  follows: Object.fromEntries(
    COMPONENT_MOTION_KEYS.map((key) => [key, SAME_AS_MOTION]),
  ),
  rules: [
    {
      id: "motion/popover-none-pins-entrance",
      target: "popoverEntrance",
      when: { key: "popoverMotion", in: ["none"] },
      effect: { kind: "pin", value: "zoom" },
      cause: "popoverMotion",
    },
    {
      id: "motion/tooltip-none-pins-entrance",
      target: "tooltipEntrance",
      when: { key: "tooltipMotion", in: ["none"] },
      effect: { kind: "pin", value: "zoom" },
      cause: "tooltipMotion",
    },
  ],
})
