import { describe, expect, it } from "vitest"

import { compareMeasures } from "./compare"

function row(reference: string, preset: string, prop = "borderRadius") {
  const [first] = compareMeasures(
    { button: { [prop]: reference } },
    { button: { [prop]: preset } },
  )
  if (!first) throw new Error("no row")
  return first
}

describe("compareMeasures", () => {
  it("passes lengths within tolerance and reports the signed delta", () => {
    expect(row("8px", "8.5px")).toMatchObject({ ok: true, delta: "+0.5px" })
    expect(row("8px", "6px")).toMatchObject({ ok: false, delta: "-2px" })
  })

  it("treats any two pill radii as equal", () => {
    expect(row("9999px", "3.40282e+38px")).toMatchObject({ ok: true })
  })

  it("treats a radius past half the height as full", () => {
    const [radius] = compareMeasures(
      { switch: { borderRadius: "72px", height: "20px" } },
      { switch: { borderRadius: "10px", height: "20px" } },
    )
    expect(radius).toMatchObject({ prop: "borderRadius", ok: true })
  })

  it("compares edges by width and color, wherever they are drawn", () => {
    const ring = "0.5px rgba(0, 0, 0, 0.1)"
    expect(row(ring, "0.5px rgba(0, 0, 0, 0.1)", "edge").ok).toBe(true)
    expect(row(ring, "1px rgba(0, 0, 0, 0.1)", "edge")).toMatchObject({
      ok: false,
      delta: "+0.5px",
    })
    expect(row(ring, "none", "edge")).toMatchObject({
      ok: false,
      delta: "edge → none",
    })
    const underline = "1px rgb(141, 141, 141) bottom"
    expect(row(underline, underline, "edge").ok).toBe(true)
    expect(row(underline, "1px rgb(141, 141, 141)", "edge")).toMatchObject({
      ok: false,
      delta: "bottom → all",
    })
  })

  it("compares focus rings by width, offset and color", () => {
    const ring = "2px rgb(94, 106, 210) +2px"
    expect(row(ring, "2px rgb(94, 106, 210) +2px", "ring").ok).toBe(true)
    expect(row(ring, "2px rgb(94, 106, 210) +0px", "ring")).toMatchObject({
      ok: false,
      delta: "offset -2px",
    })
    const inset = "1px rgb(94, 106, 210) -1px"
    expect(row(inset, inset, "ring").ok).toBe(true)
    expect(row(inset, "1px rgb(94, 106, 210) +1px", "ring").delta).toBe(
      "offset +2px",
    )
  })

  it("compares colors in OKLab", () => {
    const same = row("rgb(94, 106, 210)", "rgb(95, 106, 210)", "color")
    expect(same.ok).toBe(true)
    const off = row("rgb(105, 116, 225)", "rgb(94, 106, 210)", "color")
    expect(off.ok).toBe(false)
    expect(off.delta).toMatch(/^ΔE 0\.\d{3}$/)
  })

  it("flags a different alpha before comparing hues", () => {
    expect(row("rgba(0, 0, 0, 0)", "transparent", "backgroundColor").ok).toBe(
      true,
    )
    expect(
      row("rgba(0, 0, 0, 0)", "rgb(255, 255, 255)", "backgroundColor"),
    ).toMatchObject({ ok: false, delta: "alpha 0 → 1" })
    expect(
      row("oklab(0.38 0 -0.002 / 0.3)", "oklch(0.38 0 0)", "backgroundColor"),
    ).toMatchObject({ ok: false, delta: "alpha 0.3 → 1" })
  })

  it("compares the first font family, ignoring quotes and Variable", () => {
    expect(
      row('"Inter Variable", system-ui', "Inter, sans-serif", "fontFamily").ok,
    ).toBe(true)
  })

  it("tolerates in-between variable weights", () => {
    expect(row("510", "500", "fontWeight").ok).toBe(true)
    expect(row("600", "500", "fontWeight").ok).toBe(false)
  })

  it("counts only visible shadow layers", () => {
    const padded =
      "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px"
    expect(
      row("rgba(0, 0, 0, 0.3) 0px 0.5px 1px 1px", padded, "boxShadow"),
    ).toMatchObject({ ok: false, delta: "1 → 0 layers" })
    expect(row("none", padded, "boxShadow").ok).toBe(true)
  })

  it("marks a part the specimens do not show as missing", () => {
    expect(
      compareMeasures({ badge: { height: "20px" } }, { badge: null })[0],
    ).toMatchObject({ preset: "—", ok: false, missing: true })
  })
})
