import { describe, expect, it } from "vitest"

import { compareMeasures } from "./compare"
import { type Box, type Image, measureBox, snap } from "./pixel"

type RGB = [number, number, number]

/* A canvas with a rounded box drawn the way a browser antialiases it: each
   pixel blends by how much of it the shape covers (4×4 samples). */
function draw({
  scale = 1,
  radius,
  fill,
  edge,
  ink,
  shadow = false,
}: {
  scale?: number
  radius: number
  fill: RGB
  edge?: RGB
  ink?: RGB
  shadow?: boolean
}) {
  const [W, H] = [200 * scale, 100 * scale]
  const box: Box = [40 * scale, 30 * scale, 120 * scale, 36 * scale]
  const [bx, by, bw, bh] = box
  const r = radius * scale
  const page: RGB = [255, 255, 255]
  const data = new Uint8Array(W * H * 4)
  const inside = (px: number, py: number, inset: number) => {
    const [x0, y0, x1, y1] = [bx + inset, by + inset, bx + bw - inset, by + bh - inset]
    if (px < x0 || px > x1 || py < y0 || py > y1) return false
    const rr = Math.max(0, r - inset)
    const cx = Math.min(Math.max(px, x0 + rr), x1 - rr)
    const cy = Math.min(Math.max(py, y0 + rr), y1 - rr)
    return Math.hypot(px - cx, py - cy) <= rr
  }
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      let color: RGB = page
      if (shadow && x > bx && x < bx + bw && y >= by + bh && y < by + bh + 4 * scale)
        color = [235, 235, 235]
      const mix: number[] = [0, 0, 0]
      for (let sy = 0; sy < 4; sy++)
        for (let sx = 0; sx < 4; sx++) {
          const [px, py] = [x + (sx + 0.5) / 4, y + (sy + 0.5) / 4]
          let c = color
          if (inside(px, py, 0)) c = edge && !inside(px, py, scale) ? edge : fill
          if (
            ink &&
            px >= bx + 12 * scale &&
            px <= bx + 60 * scale &&
            py >= by + 13 * scale &&
            py <= by + 23 * scale
          )
            c = ink
          for (let i = 0; i < 3; i++) mix[i] = (mix[i] ?? 0) + (c[i] ?? 0) / 16
        }
      data.set([...mix.map(Math.round), 255], (y * W + x) * 4)
    }
  return { img: { width: W, height: H, data } as Image, box }
}

const near = (value: string | undefined, expected: number, within = 1) =>
  expect(Math.abs(Number.parseFloat(value ?? "") - expected)).toBeLessThanOrEqual(within)

describe("pixel probe", () => {
  it("reads a filled button: fill, ink, radius, height, padding", () => {
    const { img, box } = draw({ radius: 8, fill: [37, 99, 235], ink: [255, 255, 255] })
    const m = measureBox(img, box)
    expect(m.backgroundColor).toBe("rgb(37, 99, 235)")
    expect(m.color).toBe("rgb(255, 255, 255)")
    near(m.borderRadius, 8)
    expect(m.height).toBe("36px")
    near(m.paddingInline, 12)
    expect(m.edge).toBe("none")
    expect(m.boxShadow).toBe("none")
  })

  it("reads an outlined field on a Retina shot, in CSS px", () => {
    const { img, box } = draw({
      scale: 2,
      radius: 6,
      fill: [255, 255, 255],
      edge: [209, 213, 219],
      ink: [17, 24, 39],
    })
    const m = measureBox(img, box, 2)
    expect(m.edge).toBe("1px rgb(209, 213, 219)")
    near(m.borderRadius, 6)
    expect(m.height).toBe("36px")
    near(m.paddingInline, 12)
    expect(m.color).toBe("rgb(17, 24, 39)")
  })

  it("tells a pill and a shadow", () => {
    const { img, box } = draw({ radius: 18, fill: [17, 24, 39], shadow: true })
    const m = measureBox(img, box)
    expect(m.borderRadius).toBe("9999px")
    expect(m.boxShadow).not.toBe("none")
  })

  it("snaps a box written by eye to the drawn one", () => {
    const { img, box } = draw({ radius: 4, fill: [229, 231, 235] })
    const [x, y, w, h] = box
    expect(snap(img, [x + 5, y - 4, w - 7, h + 6])).toEqual(box)
  })

  it("diffs like a probe reading", () => {
    const { img, box } = draw({ radius: 8, fill: [37, 99, 235], ink: [255, 255, 255] })
    const rows = compareMeasures(
      { button: { backgroundColor: "rgb(37, 99, 235)", borderRadius: "8px", height: "36px" } },
      { button: measureBox(img, box) },
    )
    expect(rows.every((row) => row.ok)).toBe(true)
  })
})
