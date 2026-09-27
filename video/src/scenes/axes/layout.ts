import { SET } from "./camera"

/* The set, in the page's own px: a 1920×1080 /studio — the site header, the
   real panel at its true width on the left, the cards canvas on the right. */

export const PANEL = { x: 24, y: 64, w: 256, h: SET.h - 64 - 24 }
export const PREVIEW = {
  x: 304,
  y: 64,
  w: SET.w - 304 - 24,
  h: SET.h - 64 - 24,
}
export const POPOVER_X = PANEL.x + PANEL.w + 8

/* The canvas: life-size 340px columns, centred. */
export const COLUMN = 340
export const GAP = 24
const GRID_W = 4 * COLUMN + 3 * GAP
export const GRID_X = Math.round((PREVIEW.w - GRID_W) / 2)

export type TileId =
  | "controls"
  | "command"
  | "booking"
  | "storage"
  | "pricing"
  | "cookies"
  | "two-factor"
  | "display"

/** Column by column, top to bottom, with rough heights (default density) —
 *  only the wave's timing reads them. */
export const COLUMNS: ReadonlyArray<ReadonlyArray<[TileId, number]>> = [
  [
    ["controls", 352],
    ["command", 348],
  ],
  [
    ["booking", 492],
    ["two-factor", 247],
  ],
  [
    ["pricing", 357],
    ["cookies", 358],
  ],
  [
    ["storage", 270],
    ["display", 243],
  ],
]

/** A tile's centre, in set px. */
export const TILE_CENTER = Object.fromEntries(
  COLUMNS.flatMap((cards, c) => {
    let y = PREVIEW.y + GAP
    return cards.map(([id, h]) => {
      const center = [
        PREVIEW.x + GRID_X + c * (COLUMN + GAP) + COLUMN / 2,
        y + h / 2,
      ] as const
      y += h + GAP
      return [id, center]
    })
  }),
) as Record<TileId, readonly [number, number]>

/** Left edge of column `c`, in set px. */
export const columnX = (c: number) => PREVIEW.x + GRID_X + c * (COLUMN + GAP)
