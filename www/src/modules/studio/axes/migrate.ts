/* Saved states from older builds, brought to today's keys before they are
   validated. A stored state carries its `version`; an unversioned one is
   main's (version 2) when it holds what only main had, else current. */

import { DEFAULTS, effective, FOLLOWS, salvageState } from "./index"
import type { StudioState } from "./index"
import { COLUMNS, excludedUnder, STYLE_KEYS, STYLE_VALUES } from "./style"
import { STATE_VERSION } from "./version"

type Raw = Record<string, unknown>

const isRecord = (value: unknown): value is Raw =>
  typeof value === "object" && value !== null && !Array.isArray(value)

/** A stored state at `STATE_VERSION`, its stamp removed. Anything but an
 *  object is returned as is, for validation to refuse. */
export function migrate(raw: unknown): unknown {
  if (!isRecord(raw)) return raw
  const { version, ...rest } = raw
  let state: Raw = rest
  // Out of range is unversioned: a step per version, never unbounded.
  const known =
    Number.isInteger(version) &&
    Number(version) >= 2 &&
    Number(version) <= STATE_VERSION
  let v = known ? Number(version) : isMain(rest) ? 2 : STATE_VERSION
  for (; v < STATE_VERSION; v++) state = STEPS[v]?.(state) ?? state
  return state
}

// Main's keys with no home today, or one of its motion objects.
const isMain = (state: Raw) =>
  Object.entries(state).some(
    ([key, value]) =>
      GONE.has(key) || (MAIN_MOTION.has(key) && isRecord(value)),
  )

/* ------------------------------ main → v3 ------------------------------ */

/* Main's values that read differently now; null takes today's default (a
   main default drawn the same, or a value with no home). */
const VALUES: Record<string, Record<string, unknown>> = {
  accordionContainer: { boxed: "contained", cards: "separated" },
  accordionMarker: { chevron: null, plus: null },
  avatarFallback: { tinted: "accent" },
  breadcrumbTone: { accent: "link" },
  buttonRadius: { auto: null, sharp: null, round: null },
  calendarDayShape: { rounded: null, square: null },
  calendarToday: { none: null },
  chartMotion: { stiff: "spring", wobbly: "spring", slow: "ease" },
  checkCorner: { rounded: null, square: "sharp", circle: null },
  dialogBackdrop: { dim: null, blur: null, none: "wash" },
  disabledTreatment: { alpha: "fade" },
  focusStyle: { duo: "inset" },
  focusWidth: { 5: 4, 6: 4 },
  groupSeparator: { none: "shared-edge" },
  headingFont: { "": null },
  inputError: { border: null, message: "icon-message", bar: null },
  inputHover: { border: "edge" },
  inputStyle: { line: "underline", "filled-line-bottom": "indicator" },
  kbdTreatment: { text: null },
  mobilePickers: { popover: "anchored" },
  numberLayout: { right: null, stacked: "stacked-cells" },
  otpStyle: { group: null, boxes: "separate", underline: null },
  paginationCurrent: { outline: null, filled: "primary" },
  segmentedSelected: { flat: "tone" },
  sliderThumb: { circle: null, outline: "ring", bar: "handle" },
  tabStyle: { enclosed: null },
  toggleSelected: { fill: "tone", chip: null },
}

/* Main's keys with no home, or read into another key below. */
const GONE = new Set([
  "accordionMarkerPosition",
  "addonDivider",
  "addonLayout",
  "breadcrumbsMotion",
  "cardControl",
  "colorSwatchPickerMotion",
  "cursorDragging",
  "cursorPending",
  "drawerMotion",
  "focusGap",
  "focusHaloStrength",
  "focusInputBorderWidth",
  "focusInputStrength",
  "focusInputWidth",
  "focusOffset",
  "inputMotion",
  "loaderMotion",
  "menuLabels",
  "messageScrollerMotion",
  "modalMotion",
  "popoverHeader",
  "popoverTip",
  "progressGap",
  "progressIndeterminate",
  "questionnaireMotion",
  "segmentedControlMotion",
  "skeletonMotion",
  "spacingUnit",
  "tableSeparation",
  "tagMotion",
  "timePickerMotion",
  "toastSwipeMotion",
])

type Tempo = "none" | "standard" | "smooth" | "expressive"

/* Main's motion presets, as each key's timing under Default, Snappy, Smooth
   and Expressive ("ms curve"); Snappy is nearest today's Smooth. */
const TEMPOS: readonly Tempo[] = ["standard", "smooth", "smooth", "expressive"]
const COLOR = [
  "150 ease-in-out",
  "100 ease-out",
  "200 ease-in-out",
  "150 ease-out",
]
const MOVING = ["150 snappy", "300 fluid", "250 emphasized"]

/** Each component's Motion ← main's motion key and its timings. */
const MOTION: Record<string, [source: string, timings: readonly string[]]> = {
  buttonMotion: ["buttonMotion", COLOR],
  segmentedMotion: ["segmentedControlMotion", ["150 ease-out", ...MOVING]],
  fieldMotion: ["inputMotion", COLOR],
  checkboxMotion: ["checkboxMotion", COLOR],
  switchMotion: ["switchMotion", ["150 ease-in-out", ...MOVING]],
  sliderMotion: ["sliderMotion", ["150 ease-in-out", ...MOVING]],
  popoverMotion: ["popoverMotion", ["100 ease", "120 snappy", "200 fluid"]],
  tooltipMotion: ["tooltipMotion", ["150 ease", "100 snappy", "200 fluid"]],
  dialogMotion: ["modalMotion", ["100 ease", "150 snappy", "300 fluid"]],
  sheetMotion: [
    "drawerMotion",
    ["450 0.22,1,0.36,1", "300 fluid", "500 fluid"],
  ],
  tabsMotion: ["tabsMotion", ["150 ease-in-out", ...MOVING]],
  sidebarMotion: ["sidebarMotion", ["200 linear", ...MOVING]],
  linkMotion: ["linkMotion", COLOR],
  tableMotion: ["tableMotion", COLOR],
  accordionMotion: [
    "accordionMotion",
    ["200 0,0,0.58,1", "150 snappy", "300 fluid"],
  ],
  calendarMotion: ["calendarMotion", COLOR],
  toastMotion: ["toastMotion", ["400 ease", "250 snappy", "400 fluid"]],
  progressMotion: [
    "progressMotion",
    ["150 ease-in-out", "300 snappy", "500 fluid", "400 emphasized"],
  ],
}

const MAIN_MOTION = new Set(Object.values(MOTION).map(([source]) => source))

const CURVES: Record<string, string> = {
  "0.25,0.1,0.25,1": "ease",
  "0,0,0.2,1": "ease-out",
  "0.4,0,0.2,1": "ease-in-out",
  "0,0,1,1": "linear",
  "0.23,1,0.32,1": "snappy",
  "0.32,0.72,0,1": "fluid",
  "0.05,0.7,0.1,1": "emphasized",
}

/** A main motion value's tempo: off, a spring, the preset it matches, else
 *  the nearest by duration. */
function tempoOf(
  value: unknown,
  timings: readonly string[],
): Tempo | undefined {
  if (!isRecord(value)) return
  const ms = Number(value.duration ?? value.enter)
  if (value.pattern === "none" || ms === 0) return "none"
  const curve = isRecord(value.curve) ? value.curve : { ease: value.ease }
  if (curve.type !== undefined && curve.type !== "easing") return "expressive"
  const ease = String(curve.ease)
  const name = CURVES[ease] ?? ease
  if (name === "emphasized") return "expressive"
  const exact = timings.indexOf(`${ms} ${name}`)
  if (exact !== -1) return TEMPOS[exact]
  const away = timings
    .slice(0, 3)
    .map((timing) => Math.abs(Number.parseInt(timing) - ms))
  return TEMPOS[away.indexOf(Math.min(...away))]
}

/* Main's entrance patterns that have a home. */
const ENTRANCES: Record<string, [key: string, patterns: Raw]> = {
  popoverMotion: ["popoverEntrance", { fade: "fade", slide: "slide" }],
  tooltipMotion: ["tooltipEntrance", { fade: "fade", slide: "slide" }],
  modalMotion: ["dialogEntrance", { slide: "rise" }],
}

function motionFrom(main: Raw, state: Raw) {
  const tempos: Raw = {}
  for (const [key, [source, timings]] of Object.entries(MOTION)) {
    const tempo = tempoOf(main[source], timings)
    if (tempo) tempos[key] = tempo
  }
  // The global tempo most components share; "none" stays per component.
  const votes = new Map<unknown, number>([["standard", 0]])
  for (const tempo of Object.values(tempos))
    if (tempo !== "none") votes.set(tempo, (votes.get(tempo) ?? 0) + 1)
  const global = [...votes].reduce((a, b) => (b[1] > a[1] ? b : a))[0]
  if (global !== "standard") state.motion = global
  for (const [key, tempo] of Object.entries(tempos))
    if (tempo !== global) state[key] = tempo

  for (const [source, [key, patterns]] of Object.entries(ENTRANCES)) {
    const pattern = isRecord(main[source]) ? main[source].pattern : undefined
    if (typeof pattern === "string" && patterns[pattern])
      state[key] = patterns[pattern]
  }
}

const sameValues = (a: Raw, b: Raw) =>
  Object.keys(a).every((key) => Object.is(a[key], b[key]))

const defaults: Raw = DEFAULTS

/* A pick no Style allows beside another (main's tonal layers with hairline
   buttons) loses one side; page layering outweighs a control's. */
const WEIGHTS: Partial<Record<string, number>> = { surfaceLayers: 2 }

/** Main's look pinned key by key, under the Style that keeps most of it
 *  (main had none: Flat, unless a pick is another Style's; Style keys main
 *  never had draw Flat's column); then each key goes back to its default
 *  follow wherever that draws the same. A pick a rule changes or locks is
 *  kept, for when the rule lets go. */
function settle(picks: Raw): Raw {
  const conflicts = (style: string) =>
    STYLE_KEYS.filter((key) =>
      excludedUnder(key, style).includes(picks[key] as string),
    ).reduce((sum, key) => sum + (WEIGHTS[key] ?? 1), 0)
  const style = STYLE_VALUES.reduce((best, s) =>
    conflicts(s) < conflicts(best) ? s : best,
  )
  const pinned: Raw = { ...picks, style }
  for (const key of STYLE_KEYS) pinned[key] ??= COLUMNS[key].flat
  let state = salvageState(pinned)
  const { values: look, explain } = effective(state)
  // Sources before the keys that follow them.
  for (const [key, { lock, rule }] of Object.entries(explain)) {
    const fallback = defaults[key]
    if (rule || (lock && Object.hasOwn(picks, key))) continue
    if (!FOLLOWS[key]?.some((follow) => follow.id === fallback)) continue
    const next = { ...state, [key]: fallback } as StudioState
    if (sameValues(look, effective(next).values)) state = next
  }
  return state
}

function fromMain(main: Raw): Raw {
  const state: Raw = {}
  for (const [key, value] of Object.entries(main)) {
    // Main's motion objects are read by `motionFrom`.
    if (GONE.has(key) || isRecord(value)) continue
    const values = VALUES[key]
    const next =
      values && Object.hasOwn(values, String(value))
        ? values[String(value)]
        : value
    if (next !== null) state[key] = next
  }

  if (main.accordionMarkerPosition === "leading")
    state.accordionMarker = "leading-caret"
  if (main.menuLabels === "caps") state.sectionLabels = "caps"
  if (main.popoverTip === "tip") state.menuArrows = "both"
  if (main.progressGap === true) state.progressTrackStyle = "gap"
  // Main's Blur: a 20% scrim under a heavier blur than Dim's 40%.
  if (main.dialogBackdrop === "blur") state.dialogBackdropStrength = "light"

  const focus = main.focusStyle ?? "ring"
  if (focus === "ring" && main.focusOffset === "inset")
    state.focusStyle = "inset"
  const halo = Number(main.focusHaloStrength)
  if (focus === "halo" && halo < 40) state.focusStrength = "faint"
  if (focus === "halo" && halo > 75) state.focusStrength = "solid"
  const field = main.focusInputStyle ?? "halo"
  if (
    (field === "halo" && Number(main.focusInputWidth) >= 3) ||
    (field === "border" && Number(main.focusInputBorderWidth) >= 2)
  )
    state.focusInputWeight = "thick"

  motionFrom(main, state)
  return settle(state)
}

/** `STEPS[v]` takes a version-v state to v + 1. */
const STEPS: Record<number, (state: Raw) => Raw> = { 2: fromMain }
