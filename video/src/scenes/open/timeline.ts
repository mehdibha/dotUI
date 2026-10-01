import { Easing } from "remotion"

import {
  clamp01,
  ease,
  keys,
  lerp,
  progress,
  pulse,
  punch,
  springAt,
} from "../../lib/motion"
import type { Layout } from "./measure"

/* Open's beat map (scene-local; a beat is 30 frames, a bar 120). */
export const T = {
  /** The dot drops a line, clear of line 1 before its middle words resolve… */
  fall: 6,
  /** …and returns to the line's start, a carriage return. */
  glide: 14,
  /** Line 1 resolves, readable by ~0.4 s. */
  line1: 20,
  settle: 44,
  /** The dot touches down, draws back a hair, and writes line 2 on the beat… */
  touch: 78,
  sweep: 90,
  /** …and lands as its period on the downbeat of bar 2. */
  land: 120,
  out: 210,
  end: 239,
} as const

export const CX = 960
export const CY = 540

/** The dot alone at the centre, before it becomes the period. */
const HERO = 34
/** Wall's frame 0: the radio's inner dot. */
const HANDOFF = 10

/** Beats and how much light each throws; the hold's beats surge harder so
 *  the period still pulses at phone size. */
const HEARTBEATS = [
  [30, 0.8],
  [60, 0.8],
  [90, 0.8],
  [120, 0.8],
  [150, 1.5],
  [180, 1.5],
  [210, 0.8],
] as const

/** The pen stroke: pushes off hard, lands on the beat. */
const stroke = Easing.bezier(0.5, 0, 0.25, 1)
const WINDUP = 12

/** The words' slow push toward the lens, about the frame centre, kicked
 *  on the beat the period lands. */
export function pushAt(frame: number) {
  const push = keys(
    frame,
    [
      [0, 0.95],
      [T.out, 1],
      [T.end, 1.012],
    ],
    ease.linear,
  )
  return push + punch(frame, T.land)
}

type Point = { x: number; y: number }

const quad = (a: Point, c: Point, b: Point, t: number): Point => ({
  x: (1 - t) ** 2 * a.x + 2 * t * (1 - t) * c.x + t * t * b.x,
  y: (1 - t) ** 2 * a.y + 2 * t * (1 - t) * c.y + t * t * b.y,
})

/** Where line 2's pen sits (layout px) during the stroke. */
export function penX(frame: number, p: Layout) {
  const start = p.words[0]! - p.d * 0.9
  const back =
    start - WINDUP * progress(frame, T.touch, T.sweep - T.touch, ease.camera)
  return lerp(back, p.x, progress(frame, T.sweep, T.land - T.sweep, stroke))
}

/** Frame each of line 2's words starts resolving: as the dot reaches it. */
export function wordStarts(p: Layout) {
  return p.words.map((left) => {
    for (let f = T.sweep; f < T.land; f++) if (penX(f, p) >= left) return f
    return T.land
  })
}

function heartbeat(frame: number) {
  let size = 0
  let light = 0
  for (const [at, glow] of HEARTBEATS) {
    size += pulse(frame - at)
    light += glow * pulse(frame - at)
  }
  return { size, light }
}

/** Where the dot is, how big, and how much light it throws. */
export function dotAt(frame: number, p: Layout) {
  const s = pushAt(frame)
  const map = (x: number, y: number): Point => ({
    x: CX + (x - CX) * s,
    y: CY + (y - CY) * s,
  })
  const rest = p.bottom - p.d / 2
  const pen = map(penX(frame, p), rest)
  const home = map(p.x, rest)

  const pop = springAt(frame, -4, "pop")
  const beat = heartbeat(frame)
  const breath = 1 + 0.008 * Math.sin((frame / 120) * Math.PI * 2)

  // Centre → a line down, then back to its start, shrinking to the period.
  const g = progress(frame, T.fall, T.settle - T.fall, ease.camera)
  const back = progress(frame, T.glide, T.touch - T.glide, ease.camera)
  // Home → the centre (dipping under the words), shrinking to Wall's 10 px.
  const u = progress(frame, T.out, T.end - T.out, ease.camera)
  const pos =
    u > 0
      ? quad(
          home,
          { x: lerp(home.x, CX, 0.55), y: home.y + 70 },
          { x: CX, y: CY },
          u,
        )
      : { x: lerp(CX, pen.x, back), y: lerp(CY, pen.y, g) }

  const periodD = p.d * s
  const size = lerp(lerp(HERO, periodD, g) * pop * breath, HANDOFF, u)
  const d = size * (1 + (0.16 - 0.02 * g) * beat.size * (1 - u))
  // On the line, pulses grow upward from the baseline, never through it.
  const y = pos.y - ((d - size) / 2) * g * (1 - u)

  const flash = 1.5 * Math.exp(-Math.max(0, frame) / 10)
  const light =
    (lerp(1, 0.6, g) + flash + beat.light) * (1 - u) ** 1.4 * clamp01(pop * 2)

  return { x: pos.x, y, d, light }
}

/** Screen-space speed (px/frame) and heading, for the motion streak. */
export function velocityAt(frame: number, p: Layout) {
  if (frame >= T.end) return { v: 0, angle: 0 }
  const a = dotAt(frame - 1, p)
  const b = dotAt(frame + 1, p)
  const dx = (b.x - a.x) / 2
  const dy = (b.y - a.y) / 2
  return { v: Math.hypot(dx, dy), angle: (Math.atan2(dy, dx) * 180) / Math.PI }
}

/** Line 2 is revealed just behind the dot: the wipe's edge (layout px), or
 *  null once the line is fully out. */
export function wipeAt(frame: number, p: Layout) {
  if (frame >= T.land + 24) return null
  return (
    penX(frame, p) - p.d * 0.6 + 160 * progress(frame, T.land - 8, 30, ease.out)
  )
}
