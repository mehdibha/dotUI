import { clamp01, ease, lerp, progress } from "../../lib/motion"
import {
  CH,
  EDITOR,
  FILE_COL,
  FILE_LINE,
  FILES,
  FLIGHT,
  FLY_AT,
  nameX,
  OUTPUT,
  PASTED,
  PROMPT,
  T,
  TERM,
  TREE,
  TYPED,
} from "./data"

/* Panels are planes in the camera's space, transformed in CSS order, so a
   point on one projects to world space: a file can leave one plane and land
   exactly on another. */

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

const RAD = Math.PI / 180

/** World position of the local point (u, v) — measured from the panel's center. */
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

export function poseTransform(p: Pose) {
  return `translateZ(${p.z}px) rotateX(${p.rx}deg) rotateY(${p.ry}deg) scale(${p.s})`
}

export function terminalPose(frame: number): Pose {
  const arrive = progress(frame, 0, 40, ease.out)
  const pull = progress(frame, T.enter, 70, ease.camera)
  const side = progress(frame, 140, 70, ease.camera)
  const exit = progress(frame, 224, 28, ease.in)
  return {
    x: lerp(lerp(CLOSE.x, 960, pull), 560, side) - exit * 1150,
    y: lerp(lerp(CLOSE.y, 612, pull), 596, side),
    z: lerp(-240, 0, arrive) - side * 260 - exit * 200,
    rx: lerp(7, 0, arrive),
    ry: side * 16 + exit * 10,
    s:
      lerp(CLOSE.s * lerp(0.97, 1, clamp01(frame / T.enter)), 1, pull) *
      (1 + punch(frame, T.enter)),
    opacity: 1 - progress(frame, 238, 14, ease.linear),
    blur: lerp(2.5, 0, progress(frame, 0, 12, ease.out)) + exit * exit * 8,
  }
}

/** A small kick on a beat. */
function punch(frame: number, at: number) {
  const d = frame - at
  if (d < 0 || d > 40) return 0
  return 0.03 * Math.sin((d / 40) * Math.PI) * Math.exp(-d / 14)
}

/* Bar 1 frames the command line close, the window bleeding off the bottom. */
const CLOSE = (() => {
  const s = 1.34
  const lineX =
    TERM.padX + ((PROMPT.length + 3 + TYPED.length + PASTED.length) * CH) / 2
  const lineY = TERM.bar + TERM.padY + TERM.line / 2
  return {
    s,
    x: 960 - (lineX - TERM.w / 2) * s,
    y: 590 - (lineY - TERM.h / 2) * s,
  }
})()

export function editorPose(frame: number): Pose {
  const enter = progress(frame, 146, 64, ease.out)
  const drift = progress(frame, 212, 147, ease.soft)
  return {
    x: lerp(2250, 1300, enter) - 36 * drift,
    y: 556,
    z: lerp(-700, 0, enter),
    rx: 0,
    ry: lerp(-34, -10, enter) + 3 * drift,
    s: 1,
    opacity: progress(frame, 146, 18, ease.linear),
    blur: lerp(6, 0, progress(frame, 146, 30, ease.out)),
  }
}

/* --- Terminal ------------------------------------------------------------ */

/** Lines scrolled off the top, fractional while a scroll eases. */
export function terminalScroll(frame: number) {
  let s = 0
  OUTPUT.forEach((line, i) => {
    if (i + 1 >= TERM.rows) s += progress(frame, line.at, 7, ease.out)
  })
  return s
}

/** Center-relative anchor (left, middle) of file `i`'s name in the terminal. */
export function terminalFileAnchor(frame: number, i: number) {
  const line = FILE_LINE[i]!
  const x = TERM.padX + FILE_COL * CH
  const y =
    TERM.bar +
    TERM.padY +
    (line - terminalScroll(frame)) * TERM.line +
    TERM.line / 2
  return [x - TERM.w / 2, y - TERM.h / 2] as const
}

/* --- Editor tree ---------------------------------------------------------- */

/** Flight progress of file `i` (0 before lift-off, 1 once landed). */
export const flight = (frame: number, i: number) =>
  clamp01((frame - FLY_AT[i]!) / FLIGHT)

/** A landed file's slot opens just before the file arrives. */
const slot = (frame: number, i: number) =>
  EDITOR.row * progress(frame, FLY_AT[i]! + FLIGHT - 20, 20, ease.inOut)

export type PlacedRow = {
  key: string
  top: number
  height: number
  row:
    | Exclude<(typeof TREE)[number], { kind: "files" }>
    | { kind: "landed"; name: string; depth: number; index: number }
}

export function treeRows(frame: number): PlacedRow[] {
  const out: PlacedRow[] = []
  let top = EDITOR.treeTop
  for (const row of TREE) {
    if (row.kind === "files") {
      FILES.forEach((name, index) => {
        const height = slot(frame, index)
        out.push({
          key: name,
          top,
          height,
          row: { kind: "landed", name, depth: 2, index },
        })
        top += height
      })
      continue
    }
    out.push({ key: row.name, top, height: EDITOR.row, row })
    top += EDITOR.row
  }
  return out
}

/** Center-relative anchor (left, middle) of file `i`'s name in the tree. */
export function treeFileAnchor(frame: number, i: number) {
  const row = treeRows(frame).find(
    (r) => r.row.kind === "landed" && r.row.index === i,
  )!
  const x = nameX(2)
  const y = row.top + row.height / 2
  return [x - EDITOR.w / 2, y - EDITOR.h / 2] as const
}
