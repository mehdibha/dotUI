import type { StudioState } from "@/modules/studio/axes"

import { clamp01, hold, keys } from "../../lib/motion"
import { preset } from "../../lib/theme"
import { at } from "../../lib/timing"
import { PANEL, TILE_CENTER } from "./layout"
import type { TileId } from "./layout"

/* The scene's script: the studio state on every frame, and when each axis
   acts. Bar 0 opens on Origin, bars 1–7 are one axis each, bar 8 pulls back.
   Axes run in panel order so the panel only ever scrolls down. Each bar:
   the popover opens on the downbeat, the pick lands on beat 1, the camera
   pushes into the tile that proves it, and the change reaches that tile on
   beat 2 (a second one on beat 3). */

export const BASE: StudioState = preset("origin")

/* Color: the hue thumb is dragged from Origin's blue up to magenta, then
   back across the whole spectrum to a warm orange — HSB at the seed's own
   saturation and brightness. Quantized: every distinct hue is a stylesheet. */
const HUE = { from: 212, to: 20 }
const HUE_STEP = 4

export const COLOR_OPEN = at(1)
export const HUE_PRESS = at(1, 0.5)
export const HUE_RELEASE = at(1, 2.72)
export const COLOR_CLOSE = at(1, 3.2)

export function hueAt(frame: number) {
  const raw = keys(
    frame,
    [
      [HUE_PRESS, HUE.from],
      [at(1, 1.4), 300],
      [HUE_RELEASE, HUE.to],
    ],
    (t) => t * t * (3 - 2 * t),
  )
  return Math.round(raw / HUE_STEP) * HUE_STEP
}

/** HSB → #RRGGBB at full saturation and 96% brightness (Origin's blue is
 *  exactly hue 212 here). */
export function brandHex(hue: number) {
  const h = (((hue % 360) + 360) % 360) / 60
  const channel = (n: number) => {
    const k = (n + h) % 6
    const c = 0.96 - 0.96 * Math.max(0, Math.min(k, 4 - k, 1))
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${channel(5)}${channel(3)}${channel(1)}`.toUpperCase()
}

export const TYPE_OPEN = at(2)
export const TYPE_PICKS = [
  [at(2, 1), "Space Grotesk"],
  [at(2, 2), "Source Serif 4"],
] as const
export const TYPE_CLOSE = at(2, 3.1)

/* Icons: the library on beat 1; Phosphor's own weight axis appears under it,
   and fills on beat 2. */
export const ICON_OPEN = at(3)
export const ICON_PICK = at(3, 1)
export const ICON_CLOSE = at(3, 1) + 8
export const WEIGHT_PICK = at(3, 2)
export const ICON_WEIGHT = "fill"

/* Radius: the slider is pressed on the downbeat and dragged 10 → 2, held
   square while the camera travels, then swung round to 24 and settled on 14. */
export const RADIUS_PRESS = at(4)
export const RADIUS_RELEASE = at(4, 2.87)
export const RADIUS_RANGE = { min: 0, max: 24 }

export function radiusAt(frame: number) {
  const raw = keys(
    frame,
    [
      [RADIUS_PRESS, 10],
      [at(4, 0.8), 2],
      [at(4, 1.93), 2],
      [at(4, 2.53), 24],
      [RADIUS_RELEASE, 14],
    ],
    (t) => t * t * (3 - 2 * t),
  )
  return Math.round(raw * 2) / 2
}

export const DENSITY_OPEN = at(5)
export const DENSITY_PICKS = [
  [at(5, 1), "compact"],
  [at(5, 2), "comfortable"],
] as const
export const DENSITY_CLOSE = at(5, 1) + 8

/* Light & dark: the preview's own toggle, clicked on beat 1 of bar 6. */
export const MODE_FLIP = at(6, 1)
export const WIPE_FRAMES = 40

export const COMPONENTS_OPEN = at(7)
export const COMPONENT_PICKS = [
  [at(7, 1), "buttonStyle", "raised"],
  [at(7, 2), "buttonRadius", "pill"],
] as const
export const COMPONENTS_CLOSE = at(7, 3.1)

/* Each axis: when it acts, the tile that proves it, and how many frames the
   change takes to reach that tile from the panel — a pick lands a beat
   later; a drag follows the thumb closely. Every other tile is reached in
   proportion to its distance, so a change rolls across the canvas. */
interface Axis {
  id: string
  label: string
  bar: number
  target: TileId
  lag: number
  /** Frames where a discrete change leaves the panel (for the tile lift). */
  events: number[]
  apply: (state: StudioState, frame: number) => void
}

export const AXES: Axis[] = [
  {
    id: "color",
    label: "Color",
    bar: 1,
    target: "booking",
    lag: 8,
    events: [HUE_RELEASE],
    apply: (state, frame) => {
      state.brand = brandHex(hueAt(frame))
      state.selectionSeed = state.brand
    },
  },
  {
    id: "typography",
    label: "Typography",
    bar: 2,
    target: "pricing",
    lag: 30,
    events: TYPE_PICKS.map(([f]) => f),
    apply: (state, frame) => {
      state.headingFont = hold<string>(frame, [
        [0, BASE.headingFont],
        ...TYPE_PICKS,
      ])
    },
  },
  {
    id: "icons",
    label: "Icons",
    bar: 3,
    target: "command",
    lag: 30,
    events: [ICON_PICK, WEIGHT_PICK],
    apply: (state, frame) => {
      if (frame >= ICON_PICK) state.iconLibrary = "phosphor"
      if (frame >= WEIGHT_PICK) state.iconWeight = ICON_WEIGHT
    },
  },
  {
    id: "shape",
    label: "Radius",
    bar: 4,
    target: "two-factor",
    lag: 4,
    events: [RADIUS_RELEASE],
    apply: (state, frame) => {
      state.radiusPx = radiusAt(frame)
    },
  },
  {
    id: "space",
    label: "Density",
    bar: 5,
    target: "controls",
    lag: 30,
    events: DENSITY_PICKS.map(([f]) => f),
    apply: (state, frame) => {
      state.density = hold<string>(frame, [[0, BASE.density], ...DENSITY_PICKS])
    },
  },
  {
    id: "mode",
    label: "Light & dark",
    bar: 6,
    target: "storage",
    lag: 0,
    events: [],
    apply: () => {},
  },
  {
    id: "components",
    label: "Components",
    bar: 7,
    target: "cookies",
    lag: 30,
    events: COMPONENT_PICKS.map(([f]) => f),
    apply: (state, frame) => {
      for (const [f, key, value] of COMPONENT_PICKS)
        if (frame >= f) (state as Record<string, unknown>)[key] = value
    },
  },
]

/* The panel edge the changes leave from. */
const ORIGIN = [PANEL.x + PANEL.w, 170] as const
const distance = (tile: TileId) =>
  Math.hypot(TILE_CENTER[tile][0] - ORIGIN[0], TILE_CENTER[tile][1] - ORIGIN[1])

/** Frames after the panel that `axis` reaches `tile`. */
export function delayOf(axis: Axis, tile: TileId) {
  if (axis.lag === 0) return 0
  const d = (axis.lag * distance(tile)) / distance(axis.target)
  return Math.max(1, Math.min(72, Math.round(d)))
}

/** The studio state on `frame` as `tile` sees it (the panel: no tile). */
export function stateAt(frame: number, tile?: TileId): StudioState {
  const state = { ...BASE }
  for (const axis of AXES)
    axis.apply(state, tile ? frame - delayOf(axis, tile) : frame)
  return state
}

/** 0 → 1 → 0 over ~26 frames each time a change lands on `tile`. */
export function liftAt(frame: number, tile: TileId) {
  let lift = 0
  for (const axis of AXES)
    for (const event of axis.events) {
      const d = frame - event - delayOf(axis, tile)
      if (d >= 0 && d < 26) {
        const t = d / 26
        lift = Math.max(lift, Math.sin(Math.PI * Math.sqrt(t)) * (1 - t))
      }
    }
  return clamp01(lift * 1.6)
}

/** Every click of the synthetic cursor. */
export const CLICKS = [
  COLOR_OPEN,
  TYPE_OPEN,
  TYPE_PICKS[0][0],
  ICON_OPEN,
  ICON_PICK,
  DENSITY_OPEN,
  DENSITY_PICKS[0][0],
  MODE_FLIP,
  COMPONENTS_OPEN,
  COMPONENT_PICKS[0][0],
]

/** The beat accents: every click, and every change landing in a macro. */
export const PUNCHES = [
  COLOR_OPEN,
  at(1, 3),
  TYPE_OPEN,
  ...[1, 2, 3].map((b) => at(2, b)),
  ICON_OPEN,
  ...[1, 2, 3].map((b) => at(3, b)),
  RADIUS_PRESS,
  at(4, 3),
  DENSITY_OPEN,
  ...[1, 2, 3].map((b) => at(5, b)),
  MODE_FLIP,
  COMPONENTS_OPEN,
  ...[1, 2, 3].map((b) => at(7, b)),
]
