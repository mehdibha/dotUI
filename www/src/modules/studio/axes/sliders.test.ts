import { describe, expect, test } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { SOLID_LEAVES, withSource } from "./color"
import { DEFAULTS } from "./index"

const NEUTRAL = { ...DEFAULTS, ...withSource(SOLID_LEAVES, "neutral") }

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
      resolveDesignSystem({ ...NEUTRAL, sliderColor: "accent" }).tokens,
    ).toEqual({ "--studio-slider-fill-color": "var(--color-accent)" })
    expect(
      resolveDesignSystem({ ...NEUTRAL, buttonColor: "accent" }).tokens,
    ).toEqual({ "--studio-slider-fill-color": "var(--color-inverse)" })
    expect(
      resolveDesignSystem({
        ...NEUTRAL,
        buttonColor: "accent",
        sliderColor: "accent",
      }).tokens,
    ).toEqual({})
  })
})
