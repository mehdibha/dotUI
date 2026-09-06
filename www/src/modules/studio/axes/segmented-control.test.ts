import { describe, expect, test } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

describe("segmented control axis", () => {
  test("defaults ship the registry defaults", () => {
    const { componentParams, tokens } = resolveDesignSystem(DEFAULTS)
    expect(componentParams["segmented-control"]).toEqual({
      selected: "flat",
      track: "filled",
    })
    expect(tokens).toEqual({})
  })

  test("selected and track become segmented-control params", () => {
    const { componentParams } = resolveDesignSystem({
      ...DEFAULTS,
      segmentedSelected: "raised",
      segmentedTrack: "outline",
    })
    expect(componentParams["segmented-control"]).toEqual({
      selected: "raised",
      track: "outline",
    })
  })

  test("unknown values fall back to the defaults", () => {
    const { componentParams } = resolveDesignSystem({
      ...DEFAULTS,
      segmentedSelected: "underline",
      segmentedTrack: "gapped",
    })
    expect(componentParams["segmented-control"]).toEqual({
      selected: "flat",
      track: "filled",
    })
  })
})
