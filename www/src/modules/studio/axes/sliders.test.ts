import { describe, expect, test } from "vitest"

import { designSystemOf } from "../resolve"
import { effective, parseState } from "./index"
import { THUMB_OPTIONS } from "./sliders.meta"

describe("sliders axis", () => {
  test("thumb and track land as slider params", () => {
    const ds = designSystemOf(
      parseState({ sliderThumb: "ring", sliderTrack: "medium" }),
    )
    expect(ds.componentParams.slider).toEqual({
      thumb: "ring",
      track: "medium",
    })
    expect(ds.tokens).toEqual({})
  })

  test("Auto track is the thumb's own: Handle rides Thick, the rest Thin", () => {
    for (const { value } of THUMB_OPTIONS)
      expect(
        effective(parseState({ sliderThumb: value })).values.sliderTrack,
        value,
      ).toBe(value === "handle" ? "thick" : "thin")
  })

  test("a saved Hairline under Handle resolves to Thin", () => {
    const { values, explain } = effective(
      parseState({ sliderThumb: "handle", sliderTrack: "hairline" }),
    )
    expect(values.sliderTrack).toBe("thin")
    expect(explain.sliderTrack?.rule).toBe("sliders/handle-needs-track")
  })
})
