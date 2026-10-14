/* Motion presets — one click writes every component's motion key; nothing is
   stored. The current preset is derived: the one most keys match, exact when
   all do. Loops carry status, so no preset touches them. */

import { DEFAULTS } from "./index"
import type { StudioState, StudioStateInput } from "./index"
import { CURVES, ease } from "./motion"
import type { Curve, Entrance, StateChange } from "./motion"
import { sameValue } from "./schema"

type KeysOf<T> = {
  [K in keyof StudioStateInput]: StudioStateInput[K] extends T ? K : never
}[keyof StudioStateInput]
type EntranceKey = KeysOf<Entrance>
type StateKey = KeysOf<StateChange>

export type MotionKey = Extract<keyof StudioStateInput, `${string}Motion`>
export type MotionValues = Pick<StudioStateInput, MotionKey>

export interface MotionPreset {
  id: string
  label: string
  values: MotionValues
}

/* Color shifts: hover, press, focus. */
const COLOR: StateKey[] = [
  "buttonMotion",
  "inputMotion",
  "checkboxMotion",
  "questionnaireMotion",
  "calendarMotion",
  "timePickerMotion",
  "colorSwatchPickerMotion",
  "linkMotion",
  "breadcrumbsMotion",
  "tagMotion",
  "tableMotion",
]
/* Something travels: a knob, a pill, a thumb, a panel edge. */
const MOVING: StateKey[] = [
  "segmentedControlMotion",
  "switchMotion",
  "sliderMotion",
  "tabsMotion",
  "sidebarMotion",
]
const OVERLAYS: EntranceKey[] = [
  "popoverMotion",
  "tooltipMotion",
  "modalMotion",
  "toastMotion",
  "accordionMotion",
]
/* One pattern only: "off" is a zero duration, not a pattern. */
const SLIDES: EntranceKey[] = ["messageScrollerMotion"]

const curve = (name: string): Curve => {
  const found = CURVES.find((c) => c.value === name)
  if (!found) throw new Error(`No curve named ${name}`)
  return found.curve
}

const timed = (duration: number, name: string): StateChange => ({
  duration,
  ease: ease(name),
})

/** An entrance on named curves; the exit leg only where the default has one. */
function entrance(
  key: EntranceKey,
  enter: number,
  name: string,
  exit?: number,
  exitName?: string,
): Entrance {
  const base = DEFAULTS[key]
  const value: Entrance = { ...base, enter, curve: curve(name) }
  if (base.exit !== undefined && exit !== undefined) value.exit = exit
  if (base.exitEase && exitName) value.exitEase = ease(exitName)
  return value
}

const DEFAULT_VALUES = Object.fromEntries(
  Object.entries(DEFAULTS).filter(([key]) => key.endsWith("Motion")),
) as MotionValues

function preset(
  id: string,
  label: string,
  patch: Partial<MotionValues>,
): MotionPreset {
  return { id, label, values: { ...DEFAULT_VALUES, ...patch } }
}

const each = <K extends MotionKey>(
  keys: K[],
  value: (key: K) => MotionValues[K],
) => Object.fromEntries(keys.map((key) => [key, value(key)]))

export const MOTION_PRESETS: MotionPreset[] = [
  preset("off", "Off", {
    ...each(
      [...COLOR, ...MOVING, "progressMotion", "toastSwipeMotion"],
      (k) => ({
        ...DEFAULTS[k],
        duration: 0,
      }),
    ),
    ...each(OVERLAYS, (k) => ({ ...DEFAULTS[k], pattern: "none" })),
    ...each(SLIDES, (k) => ({ ...DEFAULTS[k], enter: 0, exit: 0 })),
    chartMotion: "none",
  }),
  preset("snappy", "Snappy", {
    ...each(COLOR, () => timed(100, "ease-out")),
    ...each(MOVING, () => timed(150, "snappy")),
    progressMotion: timed(300, "snappy"),
    popoverMotion: entrance("popoverMotion", 120, "snappy", 80, "snappy"),
    tooltipMotion: entrance("tooltipMotion", 100, "snappy", 60, "snappy"),
    modalMotion: entrance("modalMotion", 150, "snappy", 100, "snappy"),
    toastMotion: entrance("toastMotion", 250, "snappy", 150, "snappy"),
    toastSwipeMotion: timed(150, "ease-out"),
    messageScrollerMotion: entrance(
      "messageScrollerMotion",
      150,
      "snappy",
      200,
      "ease-in",
    ),
    accordionMotion: entrance("accordionMotion", 150, "snappy"),
    chartMotion: "ease",
  }),
  preset("default", "Default", {}),
  preset("smooth", "Smooth", {
    ...each(COLOR, () => timed(200, "ease-in-out")),
    ...each(MOVING, () => timed(300, "fluid")),
    progressMotion: timed(500, "fluid"),
    popoverMotion: entrance("popoverMotion", 200, "fluid", 150, "fluid"),
    tooltipMotion: entrance("tooltipMotion", 200, "fluid", 150, "fluid"),
    modalMotion: entrance("modalMotion", 300, "fluid", 200, "fluid"),
    toastMotion: entrance("toastMotion", 400, "fluid", 300, "fluid"),
    toastSwipeMotion: timed(250, "ease-out"),
    messageScrollerMotion: entrance(
      "messageScrollerMotion",
      300,
      "fluid",
      300,
      "fluid",
    ),
    accordionMotion: entrance("accordionMotion", 300, "fluid"),
    chartMotion: "spring",
  }),
  preset("expressive", "Expressive", {
    ...each(COLOR, () => timed(150, "ease-out")),
    ...each(MOVING, () => timed(250, "emphasized")),
    progressMotion: timed(400, "emphasized"),
    popoverMotion: entrance("popoverMotion", 200, "bouncy", 150, "ease-in"),
    tooltipMotion: entrance("tooltipMotion", 150, "bouncy", 100, "ease-in"),
    modalMotion: entrance("modalMotion", 250, "spring", 200, "ease-in"),
    toastMotion: entrance("toastMotion", 250, "bouncy", 200, "ease-in"),
    toastSwipeMotion: timed(200, "emphasized"),
    messageScrollerMotion: entrance(
      "messageScrollerMotion",
      200,
      "bouncy",
      200,
      "ease-in",
    ),
    accordionMotion: entrance("accordionMotion", 200, "spring"),
    chartMotion: "wobbly",
  }),
]

export const MOTION_KEYS = Object.keys(DEFAULT_VALUES) as MotionKey[]

/** The preset the state sits on: the one most keys match, Default on a tie. */
export function motionBase(state: StudioState) {
  const score = (p: MotionPreset) =>
    MOTION_KEYS.filter((key) => sameValue(state[key], p.values[key])).length
  const byDefaultFirst = [...MOTION_PRESETS].sort(
    (a, b) => Number(b.id === "default") - Number(a.id === "default"),
  )
  let best = byDefaultFirst[0]!
  for (const p of byDefaultFirst) if (score(p) > score(best)) best = p
  return { preset: best, exact: score(best) === MOTION_KEYS.length }
}
