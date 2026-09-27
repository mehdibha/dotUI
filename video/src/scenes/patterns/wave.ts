import { HEIGHT, WIDTH } from "../../lib/timing"
import { camAt, unproject } from "./camera"
import type { Tile } from "./tiles"
import { TILE_H, TILE_W } from "./tiles"

/* One theme wave: a straight front rolling across the world plane at a
   constant speed. Behind it every screen wears the new theme; a screen the
   front is crossing shows both, split along the line, with light riding the
   edge — so the change reads as one sweep across the whole field. */

export const WAVE_START = 240
/** The front crosses frame centre on this beat. */
export const WAVE_CROSS = 270

// Aimed on the crossing frame: left to right, leaning into the distance.
const cross = camAt(WAVE_CROSS)
const from = unproject(cross, 760, 600)
const to = unproject(cross, 1160, 480)
const len = Math.hypot(to.x - from.x, to.y - from.y)
const DIR = { x: (to.x - from.x) / len, y: (to.y - from.y) / len }

export const along = (x: number, y: number) => x * DIR.x + y * DIR.y

const centre = unproject(cross, WIDTH / 2, HEIGHT / 2)
const AT_CROSS = along(centre.x, centre.y)
// Enters through the frame's lower-left corner a few frames after the downbeat.
const entry = unproject(camAt(WAVE_START + 4), 0, HEIGHT)
const SPEED =
  (AT_CROSS - along(entry.x, entry.y)) / (WAVE_CROSS - WAVE_START - 4)

/** The front's position along the wave direction (world px). */
export function waveFront(frame: number) {
  if (frame < WAVE_START - 30) return -Infinity
  return AT_CROSS + SPEED * (frame - WAVE_CROSS)
}

/** CSS gradient angle of the wave direction in a tile's own px. */
const ANGLE = (Math.atan2(DIR.x, -DIR.y) * 180) / Math.PI
/** Half a tile's extent along the wave. */
const REACH = (TILE_W / 2) * Math.abs(DIR.x) + (TILE_H / 2) * Math.abs(DIR.y)
const FEATHER = 44

/** How far the front has got into a tile, in tile px along the wave. */
const into = (tile: Tile, front: number) =>
  front - (along(tile.x, tile.y) - REACH)

/** Untouched, crossing (with the mask that reveals the new theme), or done. */
export function crossing(tile: Tile, front: number) {
  const d = into(tile, front)
  if (d <= 0) return { state: "before" as const }
  if (d >= 2 * REACH + FEATHER) return { state: "after" as const }
  return {
    state: "crossing" as const,
    mask: `linear-gradient(${ANGLE}deg, black ${d - FEATHER}px, transparent ${d}px)`,
  }
}

const AHEAD = 170
const BEHIND = 110

/** The leading edge's light, in tile px: a bright seam and a glow thrown ahead. */
export function glint(tile: Tile, front: number) {
  const d = into(tile, front)
  if (d < -AHEAD || d > 2 * REACH + BEHIND) return null
  const seam = d - FEATHER / 2
  return `linear-gradient(${ANGLE}deg, transparent ${seam - BEHIND}px, rgba(255,248,242,0.22) ${seam - 14}px, rgba(255,252,250,0.9) ${seam}px, rgba(255,226,210,0.26) ${seam + 8}px, rgba(255,210,190,0.07) ${seam + 64}px, transparent ${seam + AHEAD}px)`
}

/** A screen rises a touch once the front has passed it, then settles (px toward the viewer). */
export function waveLift(tile: Tile, front: number, amplitude = 36) {
  const u = into(tile, front) / (2 * REACH)
  if (u <= 0) return 0
  const k = u / 0.9
  return amplitude * k * Math.exp(1 - k)
}
