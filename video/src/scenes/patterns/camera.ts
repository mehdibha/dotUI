import { ease, progress } from "../../lib/motion"
import { HEIGHT, WIDTH } from "../../lib/timing"
import { HANDOFF_SCALE } from "./newsletter"
import { spline } from "./spline"

/* The shot, as camera channels over scene frames. World units are screen
   pixels of a tile (a 1440×900 app renders 1:1 on the plane); `x`/`y` is the
   world point under the lens, `scale` the plane's zoom, `tiltX`/`tiltZ` the
   isometric lean. Every channel is a monotone spline, so the move never
   stops or kinks between keys. */

export const PERSPECTIVE = 2600

// Bar 4 lands on one product, the (4, 0) screen. The key sits past the
// scene's end so the camera is still settling on the last frame; the target
// leads the screen's center so it frames centered by then.
export const HERO = { c: 4, r: 0 }
const END = 500
const LAND = { x: HERO.c * 1536 + 150, y: HERO.r * 996 + 40 }

const logScale = spline(
  [
    [0, Math.log(HANDOFF_SCALE)],
    [60, Math.log(0.8)],
    [140, Math.log(0.52)],
    [360, Math.log(0.44)],
    [END, Math.log(0.9)],
  ],
  { startSlope: 0, endSlope: 0 },
)
const tiltX = spline(
  [
    [0, 0],
    [24, 1.5],
    [150, 46],
    [360, 50],
    [END, 4],
  ],
  { startSlope: 0, endSlope: 0 },
)
const tiltZ = spline(
  [
    [0, 0],
    [24, -1],
    [150, -28],
    [360, -31],
    [END, -3],
  ],
  { startSlope: 0, endSlope: 0 },
)
// The glide eases in once the field is up and carries into the landing.
const panX = spline(
  [
    [0, 0],
    [50, 0],
    [240, 1700],
    [360, 2900],
    [END, LAND.x],
  ],
  { startSlope: 0, endSlope: 0 },
)
const panY = spline(
  [
    [0, 0],
    [50, 0],
    [240, -500],
    [360, -850],
    [END, LAND.y],
  ],
  { startSlope: 0, endSlope: 0 },
)

export type Cam = {
  x: number
  y: number
  scale: number
  tiltX: number
  tiltZ: number
}

/** A small push on the wave's downbeat: in fast, out slow. */
function punch(frame: number) {
  return (
    progress(frame, PUNCH_AT, 7, ease.out) -
    progress(frame, PUNCH_AT + 7, 40, ease.inOut)
  )
}
const PUNCH_AT = 240

export function camAt(frame: number): Cam {
  return {
    x: panX(frame),
    y: panY(frame),
    scale: Math.exp(logScale(frame)) * (1 + 0.016 * punch(frame)),
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
