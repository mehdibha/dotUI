import { describe, expect, test } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

describe("sliders axis", () => {
  test("defaults resolve to the registry defaults and no tokens", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.componentParams.slider).toEqual({
      thumb: "circle",
      track: "thin",
    })
    expect(ds.tokens).toEqual({})
  })

  test("thumb and track land as slider params", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      sliderThumb: "bar",
      sliderTrack: "thick",
    })
    expect(ds.componentParams.slider).toEqual({ thumb: "bar", track: "thick" })
    expect(ds.tokens).toEqual({})
  })

  test("the fill leaves the buttons' source through the slider fill var", () => {
    expect(
      resolveDesignSystem({ ...DEFAULTS, sliderColor: "accent" }).tokens,
    ).toEqual({ "--studio-slider-fill-color": "var(--color-accent)" })
    expect(
      resolveDesignSystem({ ...DEFAULTS, buttonColor: "accent" }).tokens,
    ).toEqual({ "--studio-slider-fill-color": "var(--color-inverse)" })
    expect(
      resolveDesignSystem({
        ...DEFAULTS,
        buttonColor: "accent",
        sliderColor: "accent",
      }).tokens,
    ).toEqual({})
  })

  test("unknown values fall back to the defaults", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, sliderThumb: "square" })
    expect(ds.componentParams.slider?.thumb).toBe("circle")
  })
})
