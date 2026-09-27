import { SAFE_BLOCKS } from "../../lib/content"
import { HEIGHT, WIDTH } from "../../lib/timing"
import type { Cam } from "./camera"
import { project } from "./camera"

/* The field: every screen is a real app at 1440×900 on the world plane. The
   centre cell holds the pattern canvas (the Compose card's home); the rest
   are studio blocks, spread so no two neighbours repeat. */

export const TILE_W = 1440
export const TILE_H = 900
const GAP = 112
export const PITCH_X = TILE_W + GAP
export const PITCH_Y = TILE_H + GAP

export type Content = (typeof SAFE_BLOCKS)[number] | "canvas"

export type Tile = {
  id: string
  c: number
  r: number
  /** World centre. */
  x: number
  y: number
  content: Content
}

const mod = (a: number, n: number) => ((a % n) + n) % n

/* (2c + 5r) mod 8 never repeats between neighbours (diagonals included);
   the order puts mail and checkout on the fly-past row and the music player
   on the landing. */
const ORDER: ReadonlyArray<(typeof SAFE_BLOCKS)[number]> = [
  "customers",
  "music-player",
  "file-manager",
  "code-review",
  "invoice",
  "mail",
  "messaging",
  "checkout",
]

export const TILES: Tile[] = []
for (let r = -5; r <= 4; r++) {
  for (let c = -4; c <= 7; c++) {
    TILES.push({
      id: `${c}:${r}`,
      c,
      r,
      x: c * PITCH_X,
      y: r * PITCH_Y,
      content:
        c === 0 && r === 0
          ? "canvas"
          : ORDER[mod(c * 2 + r * 5, ORDER.length)]!,
    })
  }
}

/** World point under a cell's centre. */
export const cell = (c: number, r: number) => ({
  x: c * PITCH_X,
  y: r * PITCH_Y,
})

/**
 * Where a tile lands on screen, lifted `z` px off the plane. When one affine
 * matrix through the centre fits the projected corners to a pixel it's used
 * (Chrome rasterizes a 2D box at the size it's shown); otherwise the exact
 * projective matrix. A projected layer rasterizes at its own CSS size, so a
 * tile shown past 1:1 is laid out at `density` 2 (the content zoomed ×2 inside
 * a box twice the size) and stays sharp.
 */
export function placement(cam: Cam, tile: Tile, z = 0) {
  const hw = TILE_W / 2
  const hh = TILE_H / 2
  const p0 = project(cam, tile.x - hw, tile.y - hh, z)
  const p1 = project(cam, tile.x + hw, tile.y - hh, z)
  const p2 = project(cam, tile.x + hw, tile.y + hh, z)
  const p3 = project(cam, tile.x - hw, tile.y + hh, z)
  const center = project(cam, tile.x, tile.y, z)
  const corners = [p0, p1, p2, p3]
  if (corners.some((p) => p.k <= 0)) return null
  const xs = corners.map((p) => p.x)
  const ys = corners.map((p) => p.y)
  const bounds = {
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys),
  }
  const a = (p1.x + p2.x - p0.x - p3.x) / 2 / TILE_W
  const b = (p1.y + p2.y - p0.y - p3.y) / 2 / TILE_W
  const c = (p3.x + p2.x - p0.x - p1.x) / 2 / TILE_H
  const d = (p3.y + p2.y - p0.y - p1.y) / 2 / TILE_H
  const e = center.x - a * hw - c * hh
  const f = center.y - b * hw - d * hh
  const error = Math.max(
    Math.hypot(e - p0.x, f - p0.y),
    Math.hypot(a * TILE_W + e - p1.x, b * TILE_W + f - p1.y),
    Math.hypot(
      a * TILE_W + c * TILE_H + e - p2.x,
      b * TILE_W + d * TILE_H + f - p2.y,
    ),
    Math.hypot(c * TILE_H + e - p3.x, d * TILE_H + f - p3.y),
  )
  // Only a screen that holds the shot earns the 2× layer (it costs 4× the
  // pixels); edge-of-frame neighbours stay at 1×.
  const coverage =
    (Math.max(0, Math.min(bounds.right, WIDTH) - Math.max(bounds.left, 0)) *
      Math.max(0, Math.min(bounds.bottom, HEIGHT) - Math.max(bounds.top, 0))) /
    (WIDTH * HEIGHT)
  const density =
    coverage > 0.3 &&
    Math.max(
      Math.hypot(p1.x - p0.x, p1.y - p0.y) / TILE_W,
      Math.hypot(p2.x - p3.x, p2.y - p3.y) / TILE_W,
      Math.hypot(p3.x - p0.x, p3.y - p0.y) / TILE_H,
      Math.hypot(p2.x - p1.x, p2.y - p1.y) / TILE_H,
    ) > 1.02
      ? 2
      : 1
  // Visible area (shoelace), to rank what the camera actually sees.
  let area = 0
  for (let i = 0; i < 4; i++) {
    const p = corners[i]!
    const q = corners[(i + 1) % 4]!
    area += p.x * q.y - q.x * p.y
  }
  return {
    matrix:
      error > 1.5
        ? quadMatrix(corners, TILE_W * density, TILE_H * density)
        : `matrix(${a / density}, ${b / density}, ${c / density}, ${d / density}, ${e}, ${f})`,
    density,
    bounds,
    area: Math.abs(area) / 2,
    depth: center.k,
    center,
  }
}

type Point = { x: number; y: number }

/** The projective matrix taking a w×h rect onto four screen corners (Heckbert's square-to-quad). */
export function quadMatrix(q: readonly Point[], w: number, h: number) {
  const [p0, p1, p2, p3] = q as [Point, Point, Point, Point]
  const dx1 = p1.x - p2.x
  const dx2 = p3.x - p2.x
  const dx3 = p0.x - p1.x + p2.x - p3.x
  const dy1 = p1.y - p2.y
  const dy2 = p3.y - p2.y
  const dy3 = p0.y - p1.y + p2.y - p3.y
  const det = dx1 * dy2 - dx2 * dy1
  const g = (dx3 * dy2 - dx2 * dy3) / det
  const hh = (dx1 * dy3 - dx3 * dy1) / det
  const a = (p1.x - p0.x + g * p1.x) / w
  const b = (p3.x - p0.x + hh * p3.x) / h
  const d = (p1.y - p0.y + g * p1.y) / w
  const e = (p3.y - p0.y + hh * p3.y) / h
  return `matrix3d(${a}, ${d}, 0, ${g / w}, ${b}, ${e}, 0, ${hh / h}, 0, 0, 1, 0, ${p0.x}, ${p0.y}, 0, 1)`
}

export type Placement = NonNullable<ReturnType<typeof placement>>

const MARGIN = 24

/** Overlaps the frame. */
export function visible({ bounds }: Placement) {
  return (
    bounds.right > -MARGIN &&
    bounds.left < WIDTH + MARGIN &&
    bounds.bottom > -MARGIN &&
    bounds.top < HEIGHT + MARGIN
  )
}
