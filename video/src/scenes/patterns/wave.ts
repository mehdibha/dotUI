import { Easing } from "remotion"

import { clamp01 } from "../../lib/motion"
import { HEIGHT, WIDTH } from "../../lib/timing"
import { camAt, unproject } from "./camera"
import type { Tile } from "./tiles"
import { TILE_H, TILE_W } from "./tiles"

/* One theme wave: a straight front crossing the world plane. Behind the
   front every screen wears the new theme; a tile the front is crossing shows
   both, split along the line under a feathered edge, so the change reads as
   one sweep across the whole field. */

// Rolls from the near, lower-left corner of the frame out to the far upper right.
const len = Math.hypot(1, -0.36)
export const WAVE_DIR = { x: 1 / len, y: -0.36 / len }

export const WAVE_START = 240
export const WAVE_END = 360

/** Enters already moving, lands soft. */
const SWEEP = Easing.bezier(0.3, 0.12, 0.5, 1)

/**
 * The front's position (n·p) at `frame`: it enters at the frame's near,
 * lower-left corner on the downbeat and leaves through the fog line at the
 * far upper right — measured against the moving camera, so the sweep always
 * spans exactly what's on screen.
 */
export function waveFront(frame: number) {
  if (frame < WAVE_START) return -Infinity
  const cam = camAt(frame)
  const near = unproject(cam, 0, HEIGHT)
  const far = unproject(cam, WIDTH, FOG_Y)
  const from = along(near.x, near.y) + 150
  const to = along(far.x, far.y) + 900
  const t = clamp01((frame - WAVE_START) / (WAVE_END - WAVE_START))
  return from + (to - from) * SWEEP(t)
}

const FOG_Y = 300

export const along = (x: number, y: number) => x * WAVE_DIR.x + y * WAVE_DIR.y

/** Extent of a tile along the wave direction. */
export function span(tile: Tile) {
  const hw = TILE_W / 2
  const hh = TILE_H / 2
  const a = along(tile.x, tile.y)
  const r = hw * Math.abs(WAVE_DIR.x) + hh * Math.abs(WAVE_DIR.y)
  return [a - r, a + r] as const
}

const FEATHER = 110
const angle = (Math.atan2(WAVE_DIR.x, -WAVE_DIR.y) * 180) / Math.PI

/**
 * How far the front has got across a tile: untouched, crossing (with the
 * mask that reveals the new theme behind a feathered edge), or done.
 */
export function crossing(tile: Tile, front: number) {
  const [a, b] = span(tile)
  if (front <= a) return { state: "before" as const }
  if (front >= b + FEATHER) return { state: "after" as const }
  // Gradients run from the tile's first corner along the wave, in tile px.
  const limit = front - a
  return {
    state: "crossing" as const,
    mask: `linear-gradient(${angle}deg, black ${limit - FEATHER}px, transparent ${limit}px)`,
  }
}

/** Lift of a tile as the front passes (px toward the viewer): a quick rise, a slower settle. */
export function waveLift(tile: Tile, front: number, amplitude = 90) {
  const d = along(tile.x, tile.y) - front
  const k = d / (d > 0 ? 380 : 900)
  return amplitude * Math.exp(-k * k)
}

/**
 * Light riding the front, in tile px: a bright edge on the line and a soft
 * trail over the screen it just re-themed. Empty when the front is far.
 */
export function glint(tile: Tile, front: number) {
  const [a, b] = span(tile)
  if (front < a - 40 || front > b + TRAIL) return null
  const limit = front - a
  return `linear-gradient(${angle}deg, transparent ${limit - TRAIL}px, rgba(255,255,255,0.14) ${limit - 24}px, rgba(255,255,255,0.5) ${limit - 1.5}px, transparent ${limit + 1.5}px)`
}

const TRAIL = 320
