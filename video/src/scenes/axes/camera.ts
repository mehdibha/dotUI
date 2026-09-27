import { clamp01, ease, lerp } from "../../lib/motion"
import { HEIGHT, WIDTH } from "../../lib/timing"
import { SET } from "./set"

/* Camera poses aimed at points of the set: `f` is a point in the set's own
   px, `p` where on screen it lands, `zoom` the set's scale (1 = the set
   fills the frame width). The translate that lands f on p is solved per
   frame, so a move between poses glides from subject to subject. */

export interface Pose {
  f: readonly [number, number]
  p: readonly [number, number]
  zoom: number
  z?: number
  rx?: number
  ry?: number
  rz?: number
}

/** A key: the pose reached at `frame`, and the curve of the move into it. */
export type CameraKey = readonly [
  frame: number,
  pose: Pose,
  curve?: (t: number) => number,
]

/** Set px → camera-plane px, with the set centered and fitted to the frame. */
export const FIT = WIDTH / SET.w
const planeX = (x: number) => WIDTH / 2 + (x - SET.w / 2) * FIT
const planeY = (y: number) => HEIGHT / 2 + (y - SET.h / 2) * FIT

const FIELDS = {
  fx: (p: Pose) => p.f[0],
  fy: (p: Pose) => p.f[1],
  px: (p: Pose) => p.p[0],
  py: (p: Pose) => p.p[1],
  zoom: (p: Pose) => p.zoom,
  z: (p: Pose) => p.z ?? 0,
  rx: (p: Pose) => p.rx ?? 0,
  ry: (p: Pose) => p.ry ?? 0,
  rz: (p: Pose) => p.rz ?? 0,
}

function poseAt(frame: number, track: readonly CameraKey[]) {
  const out = {} as Record<keyof typeof FIELDS, number>
  let i = track.findIndex(([f]) => f > frame)
  if (i === -1) i = track.length
  const [f0, a] = track[Math.max(0, i - 1)]!
  const [f1, b, curve = ease.camera] = track[Math.min(i, track.length - 1)]!
  const t = f1 === f0 ? 1 : curve(clamp01((frame - f0) / (f1 - f0)))
  for (const [key, get] of Object.entries(FIELDS))
    out[key as keyof typeof FIELDS] = lerp(get(a), get(b), t)
  return out
}

export function cameraAt(frame: number, track: readonly CameraKey[]) {
  const p = poseAt(frame, track)
  const fx = planeX(p.fx)
  const fy = planeY(p.fy)
  return {
    x: p.px - WIDTH / 2 - p.zoom * (fx - WIDTH / 2),
    y: p.py - HEIGHT / 2 - p.zoom * (fy - HEIGHT / 2),
    z: p.z,
    scale: p.zoom,
    rotateX: p.rx,
    rotateY: p.ry,
    rotateZ: p.rz,
  }
}
