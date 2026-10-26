/* Motion: role tables copied from real systems, each member timed by its component's own Motion (else the global one) into its `--studio-<id>-*` vars. */

import { defineChapter } from "./core/types"
import type { Follow } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf, range } from "./schema"
import type { AxisSchema } from "./schema"

type Bezier = [number, number, number, number]

type Curve =
  | { type: "easing"; ease: Bezier }
  | { type: "physics"; stiffness: number; damping: number; mass: number }

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
function springSettleMs(spring: Spring): number {
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

export function bezierCss([x1, y1, x2, y2]: Bezier): string {
  return x1 === 0 && y1 === 0 && x2 === 1 && y2 === 1
    ? "linear"
    : `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`
}

const KEYWORDS: Record<string, Bezier> = {
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
}

/** Progress at time `u` (0–1) of a CSS easing: a keyword, `cubic-bezier()`
 *  or `linear()`, the ones `motionVars` writes. */
export function easeCurve(css: string): (u: number) => number {
  const [, fn = css, args = ""] = /^([\w-]+)\((.*)\)$/.exec(css.trim()) ?? []
  if (fn === "linear" && args) {
    const stops = args.split(",").map((stop, i, all) => {
      const [y = "0", at] = stop.trim().split(/\s+/)
      return [at ? parseFloat(at) / 100 : i / (all.length - 1), Number(y)]
    })
    return (u) => {
      const next = stops.findIndex(([x = 0]) => x >= u)
      if (next <= 0) return stops[Math.max(next, 0)]?.[1] ?? 1
      const [x0 = 0, y0 = 0] = stops[next - 1] ?? []
      const [x1 = 1, y1 = 1] = stops[next] ?? []
      return x1 === x0 ? y1 : y0 + ((y1 - y0) * (u - x0)) / (x1 - x0)
    }
  }
  const bezier =
    fn === "cubic-bezier"
      ? (args.split(",").map(Number) as Bezier)
      : KEYWORDS[fn]
  if (!bezier) return (u) => u
  const [x1, y1, x2, y2] = bezier
  const at = (t: number, p1: number, p2: number) =>
    3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3
  return (u) => {
    // x(t) only grows: bisect for the t that lands on u.
    let [lo, hi] = [0, 1]
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2
      if (at(mid, x1, x2) < u) lo = mid
      else hi = mid
    }
    return at((lo + hi) / 2, y1, y2)
  }
}

/** A leg in CSS terms; a spring runs for its settle time unless the leg
 *  sets one, stretched to fit. */
export function legTiming({ ms, curve }: Leg) {
  if (curve.type === "easing") return { ease: bezierCss(curve.ease), ms }
  const settle = springSettleMs(curve)
  return { ease: springLinear(curve, settle), ms: ms || settle }
}

interface Leg {
  ms: number
  curve: Curve
}

interface RoleTiming {
  enter: Leg
  exit?: { ms: number; ease: Bezier }
}

export type Role =
  | "micro" // fills: hover, press, focus, selection, colors
  | "travel" // something glides: thumb, indicator, progress fill
  | "layout" // the sidebar edge
  | "anchored" // popover, menu, select, combobox
  | "hint" // tooltip
  | "modal"
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

// shadcn (style-nova, Sonner).
const STANDARD: MotionTable = {
  micro: { enter: easing(150, TAILWIND) },
  travel: { enter: easing(150, TAILWIND) },
  layout: { enter: easing(200, LINEAR) },
  anchored: { enter: easing(100, CSS_EASE), exit: { ms: 100, ease: CSS_EASE } },
  hint: { enter: easing(150, CSS_EASE), exit: { ms: 150, ease: CSS_EASE } },
  modal: { enter: easing(100, CSS_EASE), exit: { ms: 100, ease: CSS_EASE } },
  disclosure: { enter: easing(200, CSS_EASE_OUT) },
  notification: {
    enter: easing(400, CSS_EASE),
    exit: { ms: 400, ease: CSS_EASE },
  },
  swipe: { enter: easing(200, TAILWIND_OUT) },
}

// Radix Themes; accordion and toast from Radix Primitives' docs.
const SMOOTH: MotionTable = {
  micro: { enter: easing(120, CSS_EASE) },
  travel: { enter: easing(140, [0.45, 0.05, 0.55, 0.95]) },
  layout: { enter: easing(200, EXPO_OUT) },
  anchored: { enter: easing(160, EXPO_OUT), exit: { ms: 100, ease: EXPO_OUT } },
  hint: { enter: easing(140, EXPO_OUT), exit: { ms: 0, ease: EXPO_OUT } },
  modal: { enter: easing(200, EXPO_OUT), exit: { ms: 100, ease: EXPO_OUT } },
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
  disclosure: { enter: spring(1600, 1) },
  notification: { enter: spring(380, 0.8), exit: M3_EXIT },
  swipe: { enter: easing(200, [0.05, 0.7, 0.1, 1]) },
}

/** The curves a component's Custom motion picks from. */
const EASES = {
  linear: LINEAR,
  ease: CSS_EASE,
  "ease-in": CSS_EASE_IN,
  "ease-out": CSS_EASE_OUT,
  "ease-in-out": [0.42, 0, 0.58, 1],
  standard: TAILWIND,
  "expo-out": EXPO_OUT,
  "expo-in-out": [0.87, 0, 0.13, 1],
  spring: spring(380, 1).curve,
  bouncy: spring(800, 0.6).curve,
} satisfies Record<string, Bezier | Curve>

export type EaseId = keyof typeof EASES

export const EASE_VALUES = Object.keys(EASES) as EaseId[]

const curveOf = (id: string): Curve => {
  const ease: Bezier | Curve = EASES[id as EaseId] ?? TAILWIND
  return Array.isArray(ease) ? { type: "easing", ease } : ease
}

/** The Custom curve nearest a leg's, so Custom starts where a preset was. */
function easeIdOf({ curve }: Leg): EaseId {
  if (curve.type === "physics")
    return curve.damping / (2 * Math.sqrt(curve.stiffness)) < 0.75
      ? "bouncy"
      : "spring"
  const css = bezierCss(curve.ease)
  return (
    EASE_VALUES.find((id) => {
      const ease = EASES[id]
      return Array.isArray(ease) && bezierCss(ease) === css
    }) ?? "standard"
  )
}

/** Every role on one leg; a spring's exit leaves on M3's accelerate. */
function customTable(ms: number, ease: string): MotionTable {
  const curve = curveOf(ease)
  const exit = {
    ms,
    ease: curve.type === "easing" ? curve.ease : M3_EXIT.ease,
  }
  const role = { enter: { ms, curve }, exit }
  return Object.fromEntries(
    Object.keys(STANDARD).map((name) => [name, role]),
  ) as MotionTable
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
  accordion: { role: "disclosure", exit: false },
  toast: { role: "notification", exit: true },
  "message-scroller": { role: "notification", exit: true },
}

/** A duration stretched by `speed`, to the 10ms the vars ship. */
export const stretch = (ms: number, speed: number) =>
  Math.round((ms * speed) / 10) * 10

/** Each member's vars, timed by its own table and stretched by its `speed`. */
export function motionVars(
  tableFor: (member: string) => MotionTable,
  speed: number | ((member: string) => number) = 1,
): Record<string, string> {
  const vars: Record<string, string> = {}
  const duration = (id: string, ms: number) =>
    `${stretch(ms, typeof speed === "number" ? speed : speed(id))}ms`
  for (const [id, role] of Object.entries(STATE_MEMBERS)) {
    const { ms, ease } = legTiming(tableFor(id)[role].enter)
    vars[`--studio-${id}-state-duration`] = duration(id, ms)
    vars[`--studio-${id}-state-ease`] = ease
  }
  for (const id of COLOR_MEMBERS) {
    const color = legTiming(tableFor(id).micro.enter)
    vars[`--studio-${id}-color-duration`] = duration(id, color.ms)
    vars[`--studio-${id}-color-ease`] = color.ease
  }
  for (const [id, member] of Object.entries(LAYER_MEMBERS)) {
    const { enter, exit } = tableFor(id)[member.role]
    const { ms, ease } = legTiming(enter)
    vars[`--studio-${id}-enter-duration`] = duration(id, ms)
    vars[`--studio-${id}-ease`] = ease
    if (member.exit && exit) {
      vars[`--studio-${id}-exit-duration`] = duration(id, exit.ms)
      vars[`--studio-${id}-exit-ease`] = bezierCss(exit.ease)
    }
  }
  return vars
}

export const MOTION_VALUES = [
  "none",
  "standard",
  "smooth",
  "expressive",
] as const

/** What Duration multiplies every duration by. */
export const DURATION_RANGE = { min: 0.5, max: 2, step: 0.05 }

/** A component's Custom duration, in ms. */
export const CUSTOM_MS_RANGE = { min: 0, max: 1000, step: 10 }

export const ENTRANCE_VALUES = ["zoom", "slide", "fade"] as const

const ENTRANCE_PARAM: Record<string, string> = {
  zoom: "scale",
  slide: "slide",
  fade: "fade",
}

/** Each component's own Motion and the members it times, kin included:
 *  tags time like buttons, swatches and questions like checkboxes, the
 *  message scroller like toasts. Radio rides checkbox's vars; its page hosts
 *  Checkbox's row. */
const COMPONENTS = {
  buttonMotion: ["button", "toggle-button", "tag"],
  segmentedMotion: ["segmented-control"],
  fieldMotion: ["input", "token-field"],
  checkboxMotion: ["checkbox", "color-swatch-picker", "questionnaire"],
  switchMotion: ["switch"],
  sliderMotion: ["slider"],
  popoverMotion: ["popover"],
  tooltipMotion: ["tooltip"],
  dialogMotion: ["modal"],
  tabsMotion: ["tabs"],
  sidebarMotion: ["sidebar"],
  linkMotion: ["link", "breadcrumbs"],
  tableMotion: ["table"],
  accordionMotion: ["accordion", "collapsible"],
  calendarMotion: ["calendar", "time-picker"],
  toastMotion: ["toast", "toast-swipe", "message-scroller"],
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

/** What a component's motion times: its first member's role. */
export const ROLE_OF = Object.fromEntries(
  COMPONENT_MOTION_KEYS.map((key) => {
    const [member] = COMPONENTS[key]
    return [key, STATE_MEMBERS[member] ?? LAYER_MEMBERS[member]?.role]
  }),
) as Record<ComponentMotionKey, Exclude<Role, "swipe">>

/** A component's motion: a tempo's preset, or its own timing. */
export const COMPONENT_MOTION_VALUES = [...MOTION_VALUES, "custom"] as const

/** The keys a component's Custom motion sets. */
export const customKeys = (key: ComponentMotionKey) =>
  ({
    duration: `${key}Duration`,
    ease: `${key}Ease`,
  }) as const

const CUSTOM_DEFAULTS = Object.fromEntries(
  COMPONENT_MOTION_KEYS.flatMap((key) => {
    const leg = STANDARD[ROLE_OF[key]].enter
    const { duration, ease } = customKeys(key)
    return [
      [duration, leg.ms],
      [ease, easeIdOf(leg)],
    ]
  }),
) as Record<`${ComponentMotionKey}${"Duration" | "Ease"}`, number | string>

/** The table a member reads in `state`, and the factor stretching it:
 *  Custom keeps its duration as set. */
function timingOf(state: Effective, member: string) {
  const key = KEY_OF[member]
  if (key && state[key] === "custom") {
    const { duration, ease } = customKeys(key)
    return {
      table: customTable(Number(state[duration]), String(state[ease])),
      speed: 1,
    }
  }
  return {
    table: tableOf(String(state[key ?? "motion"])),
    speed: state.motionDuration,
  }
}

/** A component's lead leg in `state`, before Duration stretches it. */
function leadLeg(key: ComponentMotionKey, state: Effective) {
  return timingOf(state, COMPONENTS[key][0]).table[ROLE_OF[key]].enter
}

/** The Custom values that time a component as `state` does, to start
 *  Custom from. */
export function customFrom(
  key: ComponentMotionKey,
  state: Effective,
): Record<string, unknown> {
  const { duration, ease } = customKeys(key)
  return {
    [duration]: Math.min(componentTiming(key, state).ms, CUSTOM_MS_RANGE.max),
    [ease]: easeIdOf(leadLeg(key, state)),
  }
}

export const FOLLOWS_MOTION: readonly Follow[] = [
  { kind: "same", id: "same", from: "motion" },
]

const STANDARD_VARS = motionVars(() => STANDARD)

/** A component's own timing as it ships: its first member's entrance. */
export function componentTiming(key: ComponentMotionKey, state: Effective) {
  const { speed } = timingOf(state, COMPONENTS[key][0])
  const { ms, ease } = legTiming(leadLeg(key, state))
  return { ms: stretch(ms, speed), ease }
}

export const chapter = defineChapter({
  id: "motion",
  defaults: {
    motion: "standard",
    motionDuration: 1,
    popoverEntrance: "zoom",
    tooltipEntrance: "zoom",
    ...(Object.fromEntries(
      COMPONENT_MOTION_KEYS.map((key) => [key, "same"]),
    ) as Record<ComponentMotionKey, string>),
    ...CUSTOM_DEFAULTS,
  },
  schema: {
    motion: oneOf(MOTION_VALUES),
    motionDuration: range(DURATION_RANGE),
    popoverEntrance: oneOf(ENTRANCE_VALUES),
    tooltipEntrance: oneOf(ENTRANCE_VALUES),
    ...(Object.fromEntries(
      COMPONENT_MOTION_KEYS.flatMap((key) => {
        const { duration, ease } = customKeys(key)
        return [
          [key, oneOf(COMPONENT_MOTION_VALUES)],
          [duration, range(CUSTOM_MS_RANGE)],
          [ease, oneOf(EASE_VALUES)],
        ]
      }),
    ) as Record<keyof typeof CUSTOM_DEFAULTS | ComponentMotionKey, AxisSchema>),
  },
  resolve(state: Effective): Resolved {
    const motionOf = (member: string) => state[KEY_OF[member] ?? "motion"]
    const vars = motionVars(
      (member) => timingOf(state, member).table,
      (member) => timingOf(state, member).speed,
    )
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
  },
  follows: Object.fromEntries(
    COMPONENT_MOTION_KEYS.map((key) => [key, FOLLOWS_MOTION]),
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
