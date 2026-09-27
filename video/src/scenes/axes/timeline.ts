import { PRIMARY_LEAVES, withSource } from "@/modules/studio/axes/color"

import { hold, keys } from "../../lib/motion"
import type { State } from "../../lib/theme"
import { at } from "../../lib/timing"

/* The scene's script: what the studio state is on every frame, and when each
   axis acts. Bar 0 is the fly-in, bars 1–7 one axis each, bar 8 the pull
   back. Axes run in panel order so the panel only ever scrolls down. */

export const AXES = [
  { id: "color", label: "Color", bar: 1 },
  { id: "typography", label: "Typography", bar: 2 },
  { id: "icons", label: "Icons", bar: 3 },
  { id: "shape", label: "Radius", bar: 4 },
  { id: "space", label: "Density", bar: 5 },
  { id: "mode", label: "Light & dark", bar: 6 },
  { id: "components", label: "Components", bar: 7 },
] as const

/* Color: the hue thumb is dragged from the default blue up to magenta, then
   back across the whole spectrum to a warm orange — HSB, like the picker's
   own hue slider. Quantized: every distinct hue is a new stylesheet. */
export const HUE = { from: 211, to: 18 }
const SATURATION = 76
const BRIGHTNESS = 96
const HUE_STEP = 5

export const COLOR_OPEN = at(1)
export const HUE_PRESS = at(1, 0.6)
export const HUE_RELEASE = at(1, 2.8)
export const COLOR_CLOSE = at(1, 3)

export function hueAt(frame: number) {
  const raw = keys(
    frame,
    [
      [HUE_PRESS, HUE.from],
      [at(1, 1.5), 300],
      [at(1, 2.4), 10],
      [HUE_RELEASE, HUE.to],
    ],
    (t) => t * t * (3 - 2 * t),
  )
  return Math.round(raw / HUE_STEP) * HUE_STEP
}

/** HSB → #RRGGBB, the picker's own space. */
export function brandHex(hue: number) {
  const h = (((hue % 360) + 360) % 360) / 60
  const s = SATURATION / 100
  const v = BRIGHTNESS / 100
  const channel = (n: number) => {
    const k = (n + h) % 6
    const c = v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
    return Math.round(c * 255)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${channel(5)}${channel(3)}${channel(1)}`.toUpperCase()
}

/* Typography: the heading list opens on the downbeat, a grotesk lands on
   beat 1, the serif that stays on beat 2. */
export const TYPE_OPEN = at(2)
export const TYPE_PICKS = [
  [at(2, 1), "Space Grotesk"],
  [at(2, 2), "Source Serif 4"],
] as const
export const TYPE_CLOSE = at(2, 3)

/* Icons: library list, phosphor then hugeicons. */
export const ICON_OPEN = at(3)
export const ICON_PICKS = [
  [at(3, 1), "phosphor"],
  [at(3, 2), "hugeicons"],
] as const
export const ICON_CLOSE = at(3, 3)

/* Radius: the slider is pressed on the downbeat and dragged 10 → 2 → 20 → 12. */
export const RADIUS_PRESS = at(4)
export const RADIUS_RELEASE = at(4, 3)
export const RADIUS_RANGE = { min: 2, max: 20 }

export function radiusAt(frame: number) {
  const raw = keys(
    frame,
    [
      [RADIUS_PRESS, 10],
      [at(4, 0.8), 2],
      [at(4, 2), 20],
      [RADIUS_RELEASE, 12],
    ],
    (t) => t * t * (3 - 2 * t),
  )
  return Math.round(raw * 2) / 2
}

/* Density: cards popover, compact on beat 1, comfortable on beat 2. */
export const DENSITY_OPEN = at(5)
export const DENSITY_PICKS = [
  [at(5, 1), "compact"],
  [at(5, 2), "comfortable"],
] as const
export const DENSITY_CLOSE = at(5, 3)

/* Light & dark: the preview's mode toggle, on the downbeat of bar 6. */
export const MODE_FLIP = at(6)
export const WIPE_FRAMES = 42

/* Components: button style cards, then the radius segment. */
export const COMPONENTS_OPEN = at(7)
export const COMPONENT_PICKS = [
  [at(7, 1), "buttonStyle", "raised"],
  [at(7, 2), "buttonRadius", "pill"],
] as const
export const COMPONENTS_CLOSE = at(7, 3)

/** Primary on the brand ramp from the start, so the hue drives the UI. */
const BASE: State = {
  ...withSource(PRIMARY_LEAVES, "accent"),
  brand: brandHex(HUE.from),
}

/** The studio state on `frame` — the panel reads it live, preview tiles read
 *  it a few frames late (the wave). */
export function stateAt(frame: number): State {
  const state: State = { ...BASE, brand: brandHex(hueAt(frame)) }
  const heading = hold<string>(frame, [[0, ""], ...TYPE_PICKS])
  if (heading) state.headingFont = heading
  const icons = hold<string>(frame, [[0, "lucide"], ...ICON_PICKS])
  if (icons !== "lucide") state.iconLibrary = icons
  const radius = radiusAt(frame)
  if (radius !== 10) state.radiusPx = radius
  const density = hold<string>(frame, [[0, "default"], ...DENSITY_PICKS])
  if (density !== "default") state.density = density
  for (const [f, key, value] of COMPONENT_PICKS)
    if (frame >= f) (state as Record<string, unknown>)[key] = value
  return state
}

/** Frames where a change starts — each rolls a sheen across the preview. */
export const WAVES = [
  HUE_PRESS,
  ...TYPE_PICKS.map(([f]) => f),
  ...ICON_PICKS.map(([f]) => f),
  RADIUS_PRESS,
  ...DENSITY_PICKS.map(([f]) => f),
  ...COMPONENT_PICKS.map(([f]) => f),
]

/** Every click of the synthetic cursor. */
export const CLICKS = [
  COLOR_OPEN,
  TYPE_OPEN,
  ...TYPE_PICKS.map(([f]) => f),
  ICON_OPEN,
  ...ICON_PICKS.map(([f]) => f),
  DENSITY_OPEN,
  ...DENSITY_PICKS.map(([f]) => f),
  MODE_FLIP,
  COMPONENTS_OPEN,
  ...COMPONENT_PICKS.map(([f]) => f),
]
