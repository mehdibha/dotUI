import { describe, expect, test } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("segmented control axis", () => {
  test("defaults ship the registry defaults", () => {
    const { componentParams, tokens } = resolveDesignSystem(DEFAULT_STATE)
    expect(componentParams["segmented-control"]).toEqual({
      selected: "flat",
      track: "filled",
    })
    expect(tokens).toEqual({})
  })

  test("selected and track become segmented-control params", () => {
    const { componentParams } = resolveDesignSystem(
      parseState({ segmentedSelected: "raised", segmentedTrack: "outline" }),
    )
    expect(componentParams["segmented-control"]).toEqual({
      selected: "raised",
      track: "outline",
    })
  })
})
