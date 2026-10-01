import { punches } from "../../lib/motion"
import { BEAT, HEIGHT, WIDTH } from "../../lib/timing"
import { COLUMN, GAP, HOME } from "./board"
import type { View } from "./board"

/* The camera over the board: `fx`/`fy` is the plane point at frame centre
   (plane px), `scale` the on-screen size of the plane there, rotations in
   degrees. Keys are joined by a monotone cubic, so the move never stops
   between them — the push-in's momentum carries into the glide, and the
   glide's push peaks on the Origin beat before pulling back into Axes. */

export type Cam = {
  fx: number
  fy: number
  scale: number
  rx: number
  ry: number
  rz: number
}

export const PERSPECTIVE = 2600

/** The home canvas's centre line. */
const X = HOME.first * (COLUMN + GAP) + (HOME.count * (COLUMN + GAP) - GAP) / 2

const KEYS: Array<readonly [number, Cam]> = [
  [0, { fx: X - 240, fy: -1180, scale: 1.08, rx: 22, ry: 4, rz: -2.4 }],
  [120, { fx: X - 170, fy: -680, scale: 1.18, rx: 18, ry: 2.5, rz: -1.4 }],
  [190, { fx: X - 110, fy: -130, scale: 1.47, rx: 11, ry: -2.5, rz: -0.6 }],
  [330, { fx: X + 40, fy: 318, scale: 1.59, rx: 5.5, ry: 2, rz: 0 }],
  [359, { fx: X + 10, fy: 350, scale: 1.45, rx: 6, ry: 0, rz: 0 }],
]

/** Per-frame velocity at the last key: Axes' opening pull-back, so the
 *  cut carries one move — Presets accelerates into it. */
const EXIT: Cam = {
  fx: -1.5,
  fy: 1.18,
  scale: -0.0142,
  rx: 0.053,
  ry: -0.21,
  rz: 0,
}

const BEATS = Array.from({ length: 12 }, (_, i) => i * BEAT)

/** Fritsch–Carlson monotone cubic through (t, v) keys, leaving the last
 *  key at `exit` per frame. */
function monotone(
  frame: number,
  points: ReadonlyArray<readonly [number, number]>,
  exit: number,
) {
  const n = points.length
  if (frame <= points[0]![0]) return points[0]![1]
  if (frame >= points[n - 1]![0]) return points[n - 1]![1]
  const slopes = points
    .slice(1)
    .map(([t, v], i) => (v - points[i]![1]) / (t - points[i]![0]))
  const tangents = points.map((_, i) => {
    if (i === 0) return slopes[0]!
    if (i === n - 1) return exit
    const a = slopes[i - 1]!
    const b = slopes[i]!
    if (a * b <= 0) return 0
    const wa = points[i + 1]![0] - points[i]![0]
    const wb = points[i]![0] - points[i - 1]![0]
    // Weighted harmonic mean: never overshoots.
    return (
      (wa + 2 * wb + (2 * wa + wb)) / ((2 * wa + wb) / a + (wa + 2 * wb) / b)
    )
  })
  let i = 0
  while (frame > points[i + 1]![0]) i++
  const [t0, v0] = points[i]!
  const [t1, v1] = points[i + 1]!
  const h = t1 - t0
  const s = (frame - t0) / h
  const s2 = s * s
  const s3 = s2 * s
  return (
    (2 * s3 - 3 * s2 + 1) * v0 +
    (s3 - 2 * s2 + s) * h * tangents[i]! +
    (-2 * s3 + 3 * s2) * v1 +
    (s3 - s2) * h * tangents[i + 1]!
  )
}

export function cameraAt(frame: number): Cam {
  const field = (key: keyof Cam) =>
    monotone(
      frame,
      KEYS.map(([f, cam]) => [f, cam[key]] as const),
      EXIT[key],
    )
  return {
    fx: field("fx"),
    fy: field("fy"),
    scale: field("scale") * (1 + punches(frame, BEATS)),
    rx: field("rx"),
    ry: field("ry"),
    rz: field("rz"),
  }
}

type Vec = [number, number, number]

/* CSS rotations (y down, z toward the viewer), angles in degrees. */
function rotX([x, y, z]: Vec, deg: number): Vec {
  const [c, s] = [
    Math.cos((deg * Math.PI) / 180),
    Math.sin((deg * Math.PI) / 180),
  ]
  return [x, y * c - z * s, y * s + z * c]
}
function rotY([x, y, z]: Vec, deg: number): Vec {
  const [c, s] = [
    Math.cos((deg * Math.PI) / 180),
    Math.sin((deg * Math.PI) / 180),
  ]
  return [x * c + z * s, y, -x * s + z * c]
}
function rotZ([x, y, z]: Vec, deg: number): Vec {
  const [c, s] = [
    Math.cos((deg * Math.PI) / 180),
    Math.sin((deg * Math.PI) / 180),
  ]
  return [x * c - y * s, x * s + y * c, z]
}

/** `rotateX() rotateY() rotateZ()`, and its inverse. */
const rotate = (cam: Cam, v: Vec) => rotX(rotY(rotZ(v, cam.rz), cam.ry), cam.rx)
const unrotate = (cam: Cam, v: Vec) =>
  rotZ(rotY(rotX(v, -cam.rx), -cam.ry), -cam.rz)

/** Screen px → plane px: the eye's ray through the pixel, met with the plane. */
function unproject(cam: Cam, sx: number, sy: number) {
  const n = rotate(cam, [0, 0, 1])
  const eye: Vec = [0, 0, PERSPECTIVE]
  const dir: Vec = [sx - WIDTH / 2, sy - HEIGHT / 2, -PERSPECTIVE]
  const lambda =
    -(n[0] * eye[0] + n[1] * eye[1] + n[2] * eye[2]) /
    (n[0] * dir[0] + n[1] * dir[1] + n[2] * dir[2])
  const p: Vec = [
    eye[0] + lambda * dir[0],
    eye[1] + lambda * dir[1],
    eye[2] + lambda * dir[2],
  ]
  const [u, v] = unrotate(cam, p)
  return [cam.fx + u / cam.scale, cam.fy + v / cam.scale] as const
}

/** The plane rect the frame sees, padded. */
export function viewOf(cam: Cam, pad = 60): View {
  const corners = [
    unproject(cam, 0, 0),
    unproject(cam, WIDTH, 0),
    unproject(cam, 0, HEIGHT),
    unproject(cam, WIDTH, HEIGHT),
  ]
  const xs = corners.map(([x]) => x)
  const ys = corners.map(([, y]) => y)
  return {
    x0: Math.min(...xs) - pad,
    x1: Math.max(...xs) + pad,
    y0: Math.min(...ys) - pad,
    y1: Math.max(...ys) + pad,
  }
}
