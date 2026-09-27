import { random } from "../../lib/motion"
import { HEIGHT, WIDTH } from "../../lib/timing"
import type { Cam } from "./camera"
import { project } from "./camera"

/* The grid: every screen is a real app rendered at 1440×900 on the world
   plane. The center cell holds the pattern canvas (the Compose card's home);
   the rest are studio blocks, spread so no neighbor repeats. */

export const TILE_W = 1440
export const TILE_H = 900
const GAP = 96
const PITCH_X = TILE_W + GAP
const PITCH_Y = TILE_H + GAP

export const BLOCK_SLUGS = [
  "mail",
  "customers",
  "music-player",
  "code-review",
  "checkout",
  "ai-chat",
  "file-manager",
  "messaging",
  "search-results",
  "invoice",
  "notifications-center",
  "settings",
] as const

export type Content = (typeof BLOCK_SLUGS)[number] | "canvas"

export type Tile = {
  id: string
  c: number
  r: number
  /** World center. */
  x: number
  y: number
  content: Content
  light: boolean
}

const mod = (a: number, n: number) => ((a % n) + n) % n

export const TILES: Tile[] = []
for (let r = -7; r <= 9; r++) {
  for (let c = -7; c <= 10; c++) {
    const center = c === 0 && r === 0
    TILES.push({
      id: `${c}:${r}`,
      c,
      r,
      x: c * PITCH_X,
      y: r * PITCH_Y,
      content: center
        ? "canvas"
        : BLOCK_SLUGS[mod(c * 5 + r * 3, BLOCK_SLUGS.length)]!,
      light: center ? true : random(c, r, 21) < 0.5,
    })
  }
}

const MARGIN = 30

/**
 * Where a tile lands on screen, lifted `z` px off the plane. Most tiles are
 * small against the perspective, so one affine matrix through the center
 * fits the projected corners to a pixel — and Chrome rasterizes a 2D box at
 * the size it's shown. Tiles close to the lens get the exact projective
 * matrix instead.
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
  return {
    matrix:
      error > 1.5
        ? homography(corners)
        : `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`,
    bounds,
    depth: center.k,
    center,
  }
}

/** The projective matrix taking the tile rect onto four screen corners (Heckbert's square-to-quad). */
function homography(q: ReadonlyArray<{ x: number; y: number }>) {
  const [p0, p1, p2, p3] = q as [
    { x: number; y: number },
    { x: number; y: number },
    { x: number; y: number },
    { x: number; y: number },
  ]
  const dx1 = p1.x - p2.x
  const dx2 = p3.x - p2.x
  const dx3 = p0.x - p1.x + p2.x - p3.x
  const dy1 = p1.y - p2.y
  const dy2 = p3.y - p2.y
  const dy3 = p0.y - p1.y + p2.y - p3.y
  const det = dx1 * dy2 - dx2 * dy1
  const g = (dx3 * dy2 - dx2 * dy3) / det
  const h = (dx1 * dy3 - dx3 * dy1) / det
  const a = (p1.x - p0.x + g * p1.x) / TILE_W
  const b = (p3.x - p0.x + h * p3.x) / TILE_H
  const d = (p1.y - p0.y + g * p1.y) / TILE_W
  const e = (p3.y - p0.y + h * p3.y) / TILE_H
  const gw = g / TILE_W
  const hh = h / TILE_H
  return `matrix3d(${a}, ${d}, 0, ${gw}, ${b}, ${e}, 0, ${hh}, 0, 0, 1, 0, ${p0.x}, ${p0.y}, 0, 1)`
}

export type Placement = NonNullable<ReturnType<typeof placement>>

export function onScreen({ bounds }: Placement) {
  return (
    bounds.right > -MARGIN &&
    bounds.left < WIDTH + MARGIN &&
    bounds.bottom > -MARGIN &&
    bounds.top < HEIGHT + MARGIN
  )
}
