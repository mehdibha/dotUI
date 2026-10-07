import { describe, expect, test } from "vitest"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("segmented control axis", () => {
  test("defaults ship the registry defaults", () => {
    const { componentParams, tokens } = designSystemOf(DEFAULT_STATE)
    expect(componentParams["segmented-control"]).toEqual({
      selected: "tone",
      track: "filled",
      weight: "medium",
      case: "sentence",
    })
    expect(tokens).toEqual({})
  })

  test("selected and track become segmented-control params", () => {
    const { componentParams } = designSystemOf(
      parseState({ segmentedSelected: "ring", segmentedTrack: "outline" }),
    )
    expect(componentParams["segmented-control"]).toEqual({
      selected: "ring",
      track: "outline",
      weight: "medium",
      case: "sentence",
    })
  })
})
