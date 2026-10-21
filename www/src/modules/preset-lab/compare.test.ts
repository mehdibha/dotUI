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

  it("marks a part the preset does not show", () => {
    expect(
      compareMeasures({ badge: { height: "20px" } }, { badge: null })[0],
    ).toMatchObject({ preset: "—", ok: false })
  })
})
