/* The pixel probe: what a screenshot alone says about a part, for products
   with no DOM to read (native apps). Given a part's box, it reads the fill,
   the ink, the edge, the corner radius, the height, the inline padding and
   whether a shadow falls below it, in the probe's units and spellings, so
   `compareMeasures` diffs it like any reading. It reads less than the probe
   (no type, no focus ring) and less exactly: `refs/<id>/pixel.json` fills
   only what tokens.json lacks. */

import type { Measure } from "./probe"

export interface Image {
  width: number
  height: number
  /** RGBA, row by row. */
  data: Uint8Array | Buffer
}

/** x, y, width, height in image pixels. */
export type Box = [number, number, number, number]

type RGB = [number, number, number]

const at = (img: Image, x: number, y: number): RGB => {
  const cx = Math.min(img.width - 1, Math.max(0, Math.round(x)))
  const cy = Math.min(img.height - 1, Math.max(0, Math.round(y)))
  const i = (cy * img.width + cx) * 4
  return [img.data[i] ?? 0, img.data[i + 1] ?? 0, img.data[i + 2] ?? 0]
}

/* Distance in sRGB, 0 to 1: enough to tell a fill from an edge or ink. */
const distance = (a: RGB, b: RGB) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) / 441.7
const luma = ([r, g, b]: RGB) => 0.2126 * r + 0.7152 * g + 0.0722 * b
const css = ([r, g, b]: RGB) => `rgb(${r}, ${g}, ${b})`

/** The most common color among `points`, near colors pooled. */
function mode(points: RGB[]): RGB | undefined {
  const counts = new Map<string, { color: RGB; n: number }>()
  for (const color of points) {
    const key = color.map((c) => c >> 2).join(",")
    const entry = counts.get(key) ?? { color, n: 0 }
    entry.n++
    counts.set(key, entry)
  }
  return [...counts.values()].sort((a, b) => b.n - a.n)[0]?.color
}

/** Moves each side of a rough box (one written by eye from a screenshot)
 *  to the strongest color change within `reach` pixels, read across the
 *  side's middle third. */
export function snap(img: Image, [x, y, w, h]: Box, reach = 8): Box {
  const edge = (along: (t: number) => [number, number], from: number) => {
    let best = { at: from, change: 0.04 }
    for (let p = from - reach; p <= from + reach; p++) {
      let change = 0
      for (const t of [1 / 3, 1 / 2, 2 / 3]) {
        const [ax, ay] = along(t)
        const vertical = ax < 0
        const a = vertical ? at(img, p - 1, ay) : at(img, ax, p - 1)
        const b = vertical ? at(img, p, ay) : at(img, ax, p)
        change += distance(a, b) / 3
      }
      if (change > best.change) best = { at: p, change }
    }
    return best.at
  }
  // `along` returns [-1, y] for a vertical side (scan x), [x, -1] for a
  // horizontal one (scan y).
  const left = edge((t) => [-1, y + h * t], x)
  const right = edge((t) => [-1, y + h * t], x + w)
  const top = edge((t) => [x + w * t, -1], y)
  const bottom = edge((t) => [x + w * t, -1], y + h)
  return [left, top, Math.max(1, right - left), Math.max(1, bottom - top)]
}

/** One part's reading. `scale` is image pixels per CSS pixel (2 on a
 *  Retina screenshot). */
export function measureBox(img: Image, box: Box, scale = 1): Measure {
  const [x, y, w, h] = box
  const px = (n: number) => `${Math.round((n / scale) * 2) / 2}px`

  // Outside: a band a few pixels off each side.
  const off = Math.max(3, Math.round(3 * scale))
  const outside = mode(
    [0.25, 0.5, 0.75].flatMap((t) => [
      at(img, x - off, y + h * t),
      at(img, x + w + off - 1, y + h * t),
      at(img, x + w * t, y - off),
    ]),
  ) as RGB

  // Fill: the interior, away from the corners, its most common color.
  const inner: RGB[] = []
  for (let i = 1; i < 12; i++)
    for (const t of [0.15, 0.5, 0.85])
      inner.push(at(img, x + (w * i) / 12, y + h * t))
  const fill = mode(inner) as RGB

  // Edge: what the boundary shows at each side's middle, when it is neither
  // the fill nor the outside; its width runs until the fill.
  const sides: RGB[] = [
    at(img, x, y + h / 2),
    at(img, x + w - 1, y + h / 2),
    at(img, x + w / 2, y),
    at(img, x + w / 2, y + h - 1),
  ]
  const edgeColor = mode(sides) as RGB
  let edge = "none"
  if (distance(edgeColor, fill) > 0.03) {
    let width = 0
    while (
      width < h / 2 &&
      distance(at(img, x + w / 2, y + width), fill) > 0.03
    )
      width++
    edge = `${px(width)} ${css(edgeColor)}`
  }
  const surface = edge === "none" ? fill : edgeColor

  // Radius: the corner's diagonal meets the arc r(1 - 1/√2) in on each
  // axis. The first pixel it touches blends the box over the outside by how
  // much of it the arc covers, which places the arc within that pixel. Each
  // corner, then the middle two.
  const span = distance(surface, outside)
  const reach = Math.min(w, h) / 2
  const radii = (
    [
      [x, y, 1, 1],
      [x + w - 1, y, -1, 1],
      [x, y + h - 1, 1, -1],
      [x + w - 1, y + h - 1, -1, -1],
    ] as const
  ).map(([cx, cy, dx, dy]) => {
    for (let d = 0; d < reach; d++) {
      const cover = Math.min(
        1,
        distance(at(img, cx + d * dx, cy + d * dy), outside) / span,
      )
      if (cover < 0.02) continue
      // The arc crosses the pixel square where x + y = s, its tangent
      // square to the diagonal; `cover` is the area past it.
      const s =
        cover >= 0.5 ? Math.sqrt(2 * (1 - cover)) : 2 - Math.sqrt(2 * cover)
      return (d + s / 2) / (1 - Math.SQRT1_2)
    }
    return reach / (1 - Math.SQRT1_2)
  })
  radii.sort((a, b) => a - b)
  const radius = ((radii[1] ?? 0) + (radii[2] ?? 0)) / 2
  const borderRadius =
    span < 0.02 ? undefined : radius >= h / 2 - scale ? "9999px" : px(radius)

  // Ink: the pixels far from the fill, row by row from where the fill
  // starts (past the corner and the edge). Its first column sets the inline
  // padding; the color is the ink's strongest, not its antialiased rim.
  let inkLeft = Infinity
  const ink: RGB[] = []
  const band = edge === "none" ? 0 : Number.parseFloat(edge) * scale
  for (let cy = Math.ceil(y + band + 1); cy < y + h - band - 1; cy++) {
    let cx = Math.ceil(x)
    while (cx < x + w / 2 && distance(at(img, cx, cy), fill) > 0.05) cx++
    for (; cx < x + w - band - 1; cx++) {
      const color = at(img, cx, cy)
      if (distance(color, fill) <= 0.25) continue
      // The shape's own right end.
      if (distance(color, outside) < 0.05 && cx > x + w - h / 2) break
      ink.push(color)
      inkLeft = Math.min(inkLeft, cx)
    }
  }
  const strongest = ink.reduce(
    (max, color) => Math.max(max, distance(color, fill)),
    0,
  )
  const inkColor = mode(
    ink.filter((color) => distance(color, fill) >= strongest * 0.9),
  )

  // Shadow: the band just below the box darker than the outside further
  // down.
  const below = at(img, x + w / 2, y + h + Math.round(1.5 * scale))
  const far = at(img, x + w / 2, y + h + Math.round(12 * scale))
  const shadow =
    luma(below) < luma(far) - 3 && distance(below, far) > 0.01
      ? "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px"
      : "none"

  return {
    backgroundColor:
      distance(fill, outside) < 0.01 && edge === "none"
        ? "rgba(0, 0, 0, 0)"
        : css(fill),
    ...(inkColor ? { color: css(inkColor) } : {}),
    ...(borderRadius ? { borderRadius } : {}),
    height: px(h),
    ...(Number.isFinite(inkLeft) ? { paddingInline: px(inkLeft - x) } : {}),
    edge,
    boxShadow: shadow,
  }
}
