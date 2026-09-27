import { punches } from "../../lib/motion"
import { HEIGHT, WIDTH } from "../../lib/timing"
import { HANDOFF_SCALE } from "../compose/steps"
import { spline } from "./spline"

/* The shot, as camera channels over scene frames. World units are a tile's
   own pixels (a 1440×900 app renders 1:1 on the plane); `x`/`y` is the world
   point under the lens, `scale` the plane's zoom, `tiltX`/`tiltZ` the lean.
   Every channel is a monotone spline, so the move never kinks between keys;
   the last keys sit past the scene so the camera is still gliding at the cut. */

export const PERSPECTIVE = 2600

const smooth = (keys: ReadonlyArray<readonly [number, number]>) =>
  spline(keys, { startSlope: 0 })

/** Compose ends still pulling back (its card shrinking ~0.47 % a frame); the
    move carries straight through the cut. */
const HANDOFF_RATE = -0.00465

// Pull back out of the card, lean the plane back, glide right across the
// field, drop low for the fly-past, rise for the wave, drift onto the hero.
const logScale = spline(
  [
    [0, Math.log(HANDOFF_SCALE)],
    [56, Math.log(0.86)],
    [118, Math.log(0.5)],
    [160, Math.log(0.56)],
    [210, Math.log(1.1)],
    [290, Math.log(0.58)],
    [360, Math.log(0.68)],
    [480, Math.log(1.3)],
    [540, Math.log(1.48)],
  ],
  { startSlope: HANDOFF_RATE },
)
const tiltX = smooth([
  [0, 0],
  [110, 26],
  [210, 16],
  [290, 28],
  [480, 7],
  [540, 5],
])
const tiltZ = smooth([
  [0, 0],
  [110, -10],
  [210, -5],
  [290, -11],
  [480, -3],
  [540, -2],
])
const panX = smooth([
  [0, 0],
  [118, 300],
  [165, 1150],
  [210, 2250],
  [290, 3450],
  [480, 4520],
  [540, 4620],
])
const panY = smooth([
  [0, 0],
  [118, -330],
  [165, -640],
  [210, -1000],
  [290, -1160],
  [480, -1250],
  [540, -1275],
])

export type Cam = {
  x: number
  y: number
  scale: number
  tiltX: number
  tiltZ: number
}

/** The beat accent on the wave's downbeat. */
const PUNCHES = [240]

export function camAt(frame: number): Cam {
  return {
    x: panX(frame),
    y: panY(frame),
    scale: Math.exp(logScale(frame)) * (1 + punches(frame, PUNCHES)),
    tiltX: tiltX(frame),
    tiltZ: tiltZ(frame),
  }
}

const RAD = Math.PI / 180

/** World point (z toward the viewer, unscaled like CSS translateZ) → screen px + depth. */
export function project(cam: Cam, wx: number, wy: number, wz = 0) {
  const u = (wx - cam.x) * cam.scale
  const v = (wy - cam.y) * cam.scale
  const c = Math.cos(cam.tiltZ * RAD)
  const s = Math.sin(cam.tiltZ * RAD)
  const x1 = u * c - v * s
  const y1 = u * s + v * c
  const ca = Math.cos(cam.tiltX * RAD)
  const sa = Math.sin(cam.tiltX * RAD)
  const y2 = y1 * ca - wz * sa
  const z2 = y1 * sa + wz * ca
  const k = PERSPECTIVE / (PERSPECTIVE - z2)
  return { x: WIDTH / 2 + x1 * k, y: HEIGHT / 2 + y2 * k, k }
}

/** The world point on the plane under a screen pixel (inverse of `project` at z = 0). */
export function unproject(cam: Cam, x: number, y: number) {
  const ca = Math.cos(cam.tiltX * RAD)
  const sa = Math.sin(cam.tiltX * RAD)
  const dy = y - HEIGHT / 2
  const y1 = (dy * PERSPECTIVE) / (ca * PERSPECTIVE + dy * sa)
  const k = PERSPECTIVE / (PERSPECTIVE - y1 * sa)
  const x1 = (x - WIDTH / 2) / k
  const c = Math.cos(cam.tiltZ * RAD)
  const s = Math.sin(cam.tiltZ * RAD)
  return {
    x: (x1 * c + y1 * s) / cam.scale + cam.x,
    y: (-x1 * s + y1 * c) / cam.scale + cam.y,
  }
}
