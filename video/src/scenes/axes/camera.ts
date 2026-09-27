import { clamp01, ease, lerp } from "../../lib/motion"
import { HEIGHT, WIDTH } from "../../lib/timing"

/* Camera poses aimed at points of the set: `f` is a point in the set's own
   px, `p` where on screen it lands, `s` screen px per set px. Between keys the
   view follows a smooth zoom path (van Wijk & Nuij, as d3.interpolateZoom):
   a long pan eases out a little mid-move instead of whipping at full zoom.
   Two keys one frame apart are a cut. */

export const SET = { w: 1920, h: 1080 }

export interface Pose {
  f: readonly [number, number]
  p?: readonly [number, number]
  s: number
  rx?: number
  ry?: number
  rz?: number
}

export type CameraKey = readonly [
  frame: number,
  pose: Pose,
  curve?: (t: number) => number,
]

/** How much a pan pulls back mid-move (√2 is d3's default). */
const RHO = 1.1

/** The set point at the centre of frame, and the visible width in set px. */
function view(pose: Pose) {
  const [px, py] = pose.p ?? [WIDTH / 2, HEIGHT / 2]
  return {
    cx: pose.f[0] + (WIDTH / 2 - px) / pose.s,
    cy: pose.f[1] + (HEIGHT / 2 - py) / pose.s,
    w: WIDTH / pose.s,
  }
}

function zoomPath(a: Pose, b: Pose, t: number) {
  const v0 = view(a)
  const v1 = view(b)
  const dx = v1.cx - v0.cx
  const dy = v1.cy - v0.cy
  const d2 = dx * dx + dy * dy
  if (d2 < 1e-6)
    return {
      cx: lerp(v0.cx, v1.cx, t),
      cy: lerp(v0.cy, v1.cy, t),
      w: v0.w * Math.pow(v1.w / v0.w, t),
    }
  const r2 = RHO * RHO
  const d1 = Math.sqrt(d2)
  const b0 = (v1.w * v1.w - v0.w * v0.w + r2 * r2 * d2) / (2 * v0.w * r2 * d1)
  const b1 = (v1.w * v1.w - v0.w * v0.w - r2 * r2 * d2) / (2 * v1.w * r2 * d1)
  const r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0)
  const r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1)
  const s = t * ((r1 - r0) / RHO)
  const u =
    (v0.w / (r2 * d1)) *
    (Math.cosh(r0) * Math.tanh(RHO * s + r0) - Math.sinh(r0))
  return {
    cx: v0.cx + u * dx,
    cy: v0.cy + u * dy,
    w: (v0.w * Math.cosh(r0)) / Math.cosh(RHO * s + r0),
  }
}

export interface Shot {
  /** Set point at the centre of frame. */
  cx: number
  cy: number
  /** Screen px per set px. */
  s: number
  rx: number
  ry: number
  rz: number
}

export function shotAt(frame: number, track: readonly CameraKey[]): Shot {
  let i = track.findIndex(([f]) => f > frame)
  if (i === -1) i = track.length
  const [f0, a] = track[Math.max(0, i - 1)]!
  const [f1, b, curve = ease.camera] = track[Math.min(i, track.length - 1)]!
  const t = f1 === f0 ? 1 : curve(clamp01((frame - f0) / (f1 - f0)))
  const v = zoomPath(a, b, t)
  return {
    cx: v.cx,
    cy: v.cy,
    s: WIDTH / v.w,
    rx: lerp(a.rx ?? 0, b.rx ?? 0, t),
    ry: lerp(a.ry ?? 0, b.ry ?? 0, t),
    rz: lerp(a.rz ?? 0, b.rz ?? 0, t),
  }
}

/** The shot's on-screen velocity (px/frame) at the centre of frame, for
 *  motion blur. Zero across a cut. */
export function velocityAt(frame: number, track: readonly CameraKey[]) {
  const cut = track.some(
    ([f], i) => i > 0 && f === frame && track[i - 1]![0] === frame - 1,
  )
  if (cut) return [0, 0] as const
  const a = shotAt(frame - 1, track)
  const b = shotAt(frame, track)
  return [(a.cx - b.cx) * b.s, (a.cy - b.cy) * b.s] as const
}
