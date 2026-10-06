import { describe, expect, test } from "vitest"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("sliders axis", () => {
  test("defaults resolve to the registry defaults and no tokens", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.componentParams.slider).toEqual({
      thumb: "circle",
      track: "thin",
    })
    expect(ds.tokens).toEqual({})
  })

  test("thumb and track land as slider params", () => {
    const ds = designSystemOf(
      parseState({ sliderThumb: "bar", sliderTrack: "thick" }),
    )
    expect(ds.componentParams.slider).toEqual({ thumb: "bar", track: "thick" })
    expect(ds.tokens).toEqual({})
  })

  test("the fill leaves the buttons' source through the slider fill var", () => {
    expect(
      designSystemOf(parseState({ sliderColor: "neutral" })).tokens,
    ).toEqual({ "--studio-slider-fill-color": "var(--color-inverse)" })
    expect(
      designSystemOf(parseState({ buttonColor: "neutral" })).tokens,
    ).toEqual({ "--studio-slider-fill-color": "var(--color-accent)" })
    expect(
      designSystemOf(
        parseState({ buttonColor: "neutral", sliderColor: "neutral" }),
      ).tokens,
    ).toEqual({})
  })
})
