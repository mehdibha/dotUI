/* Saved states from older builds, brought to today's keys before they are
   validated. A stored state carries its `version`; an unversioned one is
   main's (version 2, before Style and per-component motion), unless it has a
   Style already. React-free. */

import type { StudioState } from "./index"
import { COLUMNS, excludedUnder, STYLE_KEYS, STYLE_VALUES } from "./style"

export const STATE_VERSION = 3

type Raw = Record<string, unknown>

const isRecord = (value: unknown): value is Raw =>
  typeof value === "object" && value !== null && !Array.isArray(value)

/** The state as stored: stamped with the version it was written at. */
export const stamp = (state: StudioState) => ({
  version: STATE_VERSION,
  ...state,
})

/** A stored state at `STATE_VERSION`, its stamp removed. Anything but an
 *  object is returned as is, for validation to refuse. */
export function migrate(raw: unknown): unknown {
  if (!isRecord(raw)) return raw
  const { version, ...rest } = raw
  let state: Raw = rest
  let v = typeof version === "number" ? version : "style" in rest ? 3 : 2
  for (; v < STATE_VERSION; v++) state = STEPS[v]?.(state) ?? state
  return state
}

/* ------------------------------ main → v3 ------------------------------ */

/* Main's values that read differently now; null takes today's default (a
   main default, or a value with no home). */
const VALUES: Record<string, Record<string, unknown>> = {
  accordionContainer: { boxed: "contained", cards: "separated" },
  accordionMarker: { chevron: null, plus: null },
  avatarFallback: { tinted: "accent" },
  breadcrumbTone: { accent: "link" },
  buttonRadius: { auto: null, sharp: null, round: null },
  buttonStyle: { flat: null },
  calendarDayShape: { rounded: null, square: null },
  calendarToday: { none: null },
  chartMotion: { stiff: "spring", wobbly: "spring", slow: "ease" },
  checkCorner: { rounded: null, square: "sharp", circle: null },
  dialogBackdrop: { dim: null, blur: null, none: "wash" },
  disabledTreatment: { alpha: "fade" },
  focusStyle: { duo: "inset" },
  focusWidth: { 2: null, 5: 4, 6: 4 },
  groupSeparator: { none: "shared-edge" },
  headingFont: { "": null },
  iconStroke: { 2: null },
  inputError: { border: null, message: "icon-message", bar: null },
  inputHover: { none: null, border: "edge" },
  inputStyle: {
    outline: null,
    line: "underline",
    "filled-line-bottom": "indicator",
  },
  kbdTreatment: { text: null },
  lightBg: { 99: null },
  menuInset: { inset: null },
  mobilePickers: { popover: "anchored" },
  numberLayout: { right: null, stacked: "stacked-cells" },
  otpStyle: { group: null, boxes: "separate", underline: null },
  paginationCurrent: { outline: null, filled: "primary" },
  segmentedSelected: { flat: null },
  sliderThumb: { circle: null, outline: "ring", bar: "handle" },
  sliderTrack: { thin: null },
  surfaceEdge: { line: null },
  surfaceLayers: { same: null },
  surfaceShadow: { flat: null },
  tabStyle: { enclosed: null },
  toggleSelected: { fill: null, chip: null },
}

/* Keys with no home, or read into another key below. */
const GONE = new Set([
  "accordionMarkerPosition",
  "addonDivider",
  "addonLayout",
  "breadcrumbsMotion",
  "cardControl",
  "colorSwatchPickerMotion",
  "cursorDragging",
  "cursorPending",
  "dateMotion",
  "displayMotion",
  "drawerMotion",
  "feedbackMotion",
  "focusGap",
  "focusHaloStrength",
  "focusInputBorderWidth",
  "focusInputStrength",
  "focusInputWidth",
  "focusOffset",
  "inputMotion",
  "loaderMotion",
  "menuLabels",
  "menuMotion",
  "messageScrollerMotion",
  "modalMotion",
  "motionEntrance",
  "navMotion",
  "popoverHeader",
  "popoverTip",
  "progressGap",
  "progressIndeterminate",
  "questionnaireMotion",
  "segmentedControlMotion",
  "selectionMotion",
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

/* #889's per-family Motion (preview builds only), fanned out. */
const FAMILIES: Record<string, string[]> = {
  buttonMotion: ["segmentedMotion"],
  inputMotion: ["fieldMotion"],
  selectionMotion: ["checkboxMotion", "switchMotion", "sliderMotion"],
  menuMotion: ["popoverMotion", "tooltipMotion"],
  dialogMotion: ["sheetMotion"],
  navMotion: ["tabsMotion", "sidebarMotion", "linkMotion"],
  displayMotion: ["tableMotion", "accordionMotion"],
  dateMotion: ["calendarMotion"],
  feedbackMotion: ["toastMotion", "progressMotion"],
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

  for (const [family, members] of Object.entries(FAMILIES))
    if (typeof main[family] === "string" && main[family] !== "same")
      for (const key of members) state[key] ??= main[family]
  if (typeof main.motionEntrance === "string")
    for (const key of ["popoverEntrance", "tooltipEntrance"])
      state[key] = main.motionEntrance
  if (state.motion === "none") {
    delete state.motion
    for (const key of Object.keys(MOTION)) state[key] ??= "none"
  }
}

/** The Style that keeps the saved picks (Bevel buttons are Tactile's); every
 *  Style key keeps the look it had, which was Flat's column. */
function withStyle(state: Raw): Raw {
  if (state.style !== undefined) return state
  const conflicts = (style: string) =>
    STYLE_KEYS.filter((key) =>
      excludedUnder(key, style).includes(state[key] as string),
    ).length
  const style = STYLE_VALUES.reduce((best, s) =>
    conflicts(s) < conflicts(best) ? s : best,
  )
  const next: Raw = style === "flat" ? { ...state } : { ...state, style }
  for (const key of STYLE_KEYS) {
    const value = state[key] ?? COLUMNS[key].flat
    if (value === COLUMNS[key][style]) delete next[key]
    else next[key] = value
  }
  return next
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
  return withStyle(state)
}

/** `STEPS[v]` takes a version-v state to v + 1. */
const STEPS: Record<number, (state: Raw) => Raw> = { 2: fromMain }
