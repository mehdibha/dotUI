import { clamp01, ease, keys, lerp, progress, punches } from "../../lib/motion"
import {
  ADD_ROW,
  CH,
  EDITOR,
  FILE_COL,
  FILE_ROW,
  FLIGHT,
  FLY_AT,
  IDLE_AT,
  IDLE_ROW,
  INIT_ROWS,
  LAND_ROW,
  nameX,
  OUTPUT,
  T,
  TERM,
  TERM_H,
  TERM_W,
  TREE,
} from "./data"

/* Windows are planes in the camera's space, transformed in CSS order, so a
   point on one projects to the screen exactly: a file can leave one plane and
   land on another. */

export type Pose = {
  x: number
  y: number
  z: number
  rx: number
  ry: number
  s: number
  opacity: number
  blur: number
}

export type Cam = {
  x: number
  y: number
  z: number
  scale: number
  rotateX: number
  rotateY: number
  rotateZ: number
}

const RAD = Math.PI / 180
const PERSPECTIVE = 2600
const O = [960, 540] as const

export const BEATS = [T.paste, T.enter, T.addEnter, T.fly, T.open, T.pill]

/* --- Camera ---------------------------------------------------------------- */

/** How far the camera has pushed into the gap between the windows (0–1). */
const gapPush = (frame: number) =>
  keys(frame, [
    [148, 0],
    [204, 1],
    [214, 1],
    [284, 0],
  ])

/** The world point the push centres on: between the file list and the tree. */
const GAP = [676, 652] as const

export function cameraAt(frame: number): Cam {
  const p = gapPush(frame)
  const zoom = lerp(1, 1.2, p) + p * clamp01((frame - 204) / 30) * 0.02
  const tail = Math.max(0, frame - 300) * 0.00028
  const scale = (zoom + tail) * (1 + punches(frame, BEATS))
  return {
    x: p * -(GAP[0] - O[0]) * zoom,
    y: p * -(GAP[1] - O[1]) * zoom,
    z: 0,
    scale,
    rotateX:
      lerp(5, 2, clamp01(frame / 360)) - Math.max(0, frame - 360) * 0.004,
    rotateY:
      lerp(-3, 2.2, clamp01(frame / 360)) + Math.max(0, frame - 360) * 0.014,
    rotateZ: 0,
  }
}

/** Screen position of a world point, and the plane's local magnification. */
export function toScreen(cam: Cam, [px, py, pz]: readonly number[]) {
  let x = (px! - O[0]) * cam.scale
  let y = (py! - O[1]) * cam.scale
  let z = pz!
  const [a, b] = [cam.rotateY * RAD, cam.rotateX * RAD]
  ;[x, z] = [
    x * Math.cos(a) + z * Math.sin(a),
    -x * Math.sin(a) + z * Math.cos(a),
  ]
  ;[y, z] = [
    y * Math.cos(b) - z * Math.sin(b),
    y * Math.sin(b) + z * Math.cos(b),
  ]
  x += cam.x
  y += cam.y
  z += cam.z
  const f = PERSPECTIVE / (PERSPECTIVE - z)
  return [O[0] + x * f, O[1] + y * f, f] as const
}

/** World position of the local point (u, v), measured from the panel's centre. */
export function project(p: Pose, u: number, v: number) {
  const ry = p.ry * RAD
  const rx = p.rx * RAD
  const x = u * p.s
  const y = v * p.s
  const x1 = x * Math.cos(ry)
  const z1 = -x * Math.sin(ry)
  const y2 = y * Math.cos(rx) - z1 * Math.sin(rx)
  const z2 = y * Math.sin(rx) + z1 * Math.cos(rx)
  return [p.x + x1, p.y + y2, p.z + z2] as const
}

/** Screen point and on-screen scale of a plane's local point at `frame`. */
export function onScreen(frame: number, pose: Pose, u: number, v: number) {
  const cam = cameraAt(frame)
  const [x, y] = toScreen(cam, project(pose, u, v))
  const [x2, y2] = toScreen(cam, project(pose, u + 10, v))
  return { x, y, k: Math.hypot(x2 - x, y2 - y) / 10 }
}

export function poseTransform(p: Pose, zoom: number) {
  return `translateZ(${p.z}px) rotateX(${p.rx}deg) rotateY(${p.ry}deg) scale(${p.s / zoom})`
}

/* --- Terminal ------------------------------------------------------------- */

type Framing = { x: number; y: number; s: number }

/** A framing with the terminal's text column at screen x = 128 and local
 *  row `row` (fractional, centre) at screen y = `y`. */
function onRow(row: number, y: number, s: number, drift: number): Framing {
  const u = TERM.padX - TERM_W / 2
  const v = TERM.bar + TERM.padY + row * TERM.line - TERM_H / 2
  return { x: 128 - drift - u * s, y: y - v * s, s }
}

const lerpFraming = (a: Framing, b: Framing, t: number): Framing => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  s: lerp(a.s, b.s, t),
})

/* Close on the init command (bar 1), back out while it runs, close again on
   the add command, then aside for the files. The window bleeds off the
   right whenever it's close; every framing creeps so none is ever still. */
export function terminalPose(frame: number): Pose {
  // The cut lands mid-push: fast at frame 0, settling into a creep.
  const settle = 1 - Math.exp(-frame / 45)
  const init = onRow(
    INIT_ROWS / 2,
    548,
    1.54 + 0.06 * settle + 0.0006 * frame,
    26 * settle + 0.3 * frame,
  )
  const wide = { x: 960 + 0.2 * (frame - 60), y: 612, s: 0.94 }
  const add = onRow(
    ADD_ROW + 0.5,
    744,
    1.4 + 0.0012 * (frame - 100),
    0.3 * (frame - 100),
  )
  const aside = { x: 616, y: 540, s: 0.86 }
  const back = progress(frame, T.enter, 50, ease.camera)
  const close = progress(frame, 96, 46, ease.camera)
  const side = progress(frame, 146, 60, ease.camera)
  const exit = progress(frame, 214, 26, ease.in)
  const f = lerpFraming(
    lerpFraming(lerpFraming(init, wide, back), add, close),
    aside,
    side,
  )
  return {
    x: f.x - exit * 900,
    y: f.y,
    z: -60 * side - exit * 320,
    rx: 0,
    ry: 13 * side + exit * 24,
    s: f.s,
    opacity: 1 - progress(frame, 224, 16, ease.in),
    blur: exit * exit * 6,
  }
}

/** How much the terminal fills the top band (the headline needs a scrim). */
export const topCovered = (frame: number) =>
  progress(frame, 96, 30, ease.soft) * (1 - progress(frame, 160, 22, ease.soft))

/** Rows scrolled off the top, fractional while a scroll eases. */
export function terminalScroll(frame: number) {
  let s = 0
  const scrollAt = (row: number, at: number) => {
    if (row >= TERM.rows) s += progress(frame, at, 6, ease.out)
  }
  OUTPUT.forEach((line, i) => scrollAt(INIT_ROWS + i, line.at))
  scrollAt(IDLE_ROW, IDLE_AT)
  return s
}

/** Centre-relative anchor (left, middle) of file `i`'s name in the terminal. */
export function terminalFileAnchor(frame: number, i: number) {
  const x = TERM.padX + FILE_COL[i]! * CH
  const y =
    TERM.bar +
    TERM.padY +
    (FILE_ROW[i]! - terminalScroll(frame)) * TERM.line +
    TERM.line / 2
  return [x - TERM_W / 2, y - TERM_H / 2] as const
}

/* --- Editor --------------------------------------------------------------- */

export function editorPose(frame: number): Pose {
  const enter = progress(frame, 144, 70, ease.out)
  const settle = progress(frame, 212, 74, ease.camera)
  const tail = Math.max(0, frame - 300)
  return {
    x: lerp(lerp(2560, 1400, enter), 1296, settle) - tail * 0.14,
    y: lerp(700, 556, settle),
    z: lerp(-600, 0, enter),
    rx: 0,
    ry: lerp(lerp(-42, -14, enter), -8.5, settle) + tail * 0.02,
    s: lerp(0.86, 1, settle),
    opacity: progress(frame, 144, 16, ease.linear),
    blur: lerp(5, 0, progress(frame, 144, 30, ease.out)),
  }
}

/** Flight progress of file `i` (0 before lift-off, 1 once landed). */
export const flight = (frame: number, i: number) =>
  clamp01((frame - FLY_AT[i]!) / FLIGHT)

/** Frame file `i` lands. */
export const landAt = (i: number) => FLY_AT[i]! + FLIGHT

/** A row's slot opens ahead of the file that brings it, so it lands still. */
const slot = (frame: number, file: number) =>
  EDITOR.row * progress(frame, landAt(file) - 24, 18, ease.inOut)

export type PlacedRow = { index: number; top: number; height: number }

export function treeRows(frame: number): PlacedRow[] {
  let top = EDITOR.treeTop
  return TREE.map((row, index) => {
    const bringer = row.file ?? row.after
    const height = bringer === undefined ? EDITOR.row : slot(frame, bringer)
    const placed = { index, top, height }
    top += height
    return placed
  })
}

/** Centre-relative anchor (left, middle) of the row file `i` lands on. */
export function treeFileAnchor(frame: number, i: number) {
  const row = treeRows(frame)[LAND_ROW[i]!]!
  const x = nameX(TREE[LAND_ROW[i]!]!.depth)
  const y = row.top + row.height / 2
  return [x - EDITOR.w / 2, y - EDITOR.h / 2] as const
}
