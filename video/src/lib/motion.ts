import { Easing, spring } from "remotion"

import { FPS } from "./timing"

/* One motion vocabulary for the whole film — the same curves the site uses:
   expo-out for arrivals, cubic-in for departures, a quint in-out for camera
   moves that start and land. */
export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  in: Easing.bezier(0.55, 0.055, 0.675, 0.19),
  inOut: Easing.bezier(0.83, 0, 0.17, 1),
  camera: Easing.bezier(0.65, 0, 0.35, 1),
  soft: Easing.bezier(0.25, 0.1, 0.25, 1),
  linear: (t: number) => t,
}

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

/** 0→1 over [start, start + duration] frames, eased. */
export function progress(
  frame: number,
  start: number,
  duration: number,
  curve: (t: number) => number = ease.out,
) {
  if (duration <= 0) return frame >= start ? 1 : 0
  return curve(clamp01((frame - start) / duration))
}

/** Map `frame` through keyframes [[frame, value], …], eased between keys. */
export function keys(
  frame: number,
  points: ReadonlyArray<readonly [number, number]>,
  curve: (t: number) => number = ease.inOut,
) {
  const first = points[0]!
  if (frame <= first[0]) return first[1]
  for (let i = 1; i < points.length; i++) {
    const [f1, v1] = points[i]!
    const [f0, v0] = points[i - 1]!
    if (frame <= f1) return lerp(v0, v1, curve((frame - f0) / (f1 - f0)))
  }
  return points[points.length - 1]![1]
}

/** The value of the last key at or before `frame`. */
export function hold<T>(
  frame: number,
  points: ReadonlyArray<readonly [number, T]>,
) {
  let value = points[0]![1]
  for (const [f, v] of points) if (frame >= f) value = v
  return value
}

export const springs = {
  /** UI settle: fast, no overshoot. */
  snappy: { damping: 200, stiffness: 300, mass: 0.6 },
  /** A physical pop with a touch of overshoot. */
  pop: { damping: 14, stiffness: 180, mass: 0.7 },
  /** Heavy, slow settle for big planes. */
  heavy: { damping: 30, stiffness: 60, mass: 1.4 },
}

/** Spring 0→1 starting at `start`. */
export function springAt(
  frame: number,
  start: number,
  config:
    | keyof typeof springs
    | Parameters<typeof spring>[0]["config"] = "snappy",
) {
  return spring({
    frame: frame - start,
    fps: FPS,
    config: typeof config === "string" ? springs[config] : config,
  })
}

/** Deterministic pseudo-random in [0, 1) from any number of seeds. */
export function random(...seeds: number[]) {
  let h = 2166136261
  for (const s of seeds) {
    h ^= Math.floor(s * 1000003)
    h = Math.imul(h, 16777619)
  }
  h ^= h >>> 13
  h = Math.imul(h, 0x5bd1e995)
  h ^= h >>> 15
  return (h >>> 0) / 4294967296
}
