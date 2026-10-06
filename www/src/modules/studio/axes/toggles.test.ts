import { describe, expect, test } from "vitest"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("toggles axis", () => {
  test("defaults ship the registry default", () => {
    const { componentParams, tokens } = designSystemOf(DEFAULT_STATE)
    expect(componentParams["toggle-button"]?.selected).toBe("fill")
    expect(tokens).toEqual({})
  })

  test("selected look becomes the toggle-button param", () => {
    for (const toggleSelected of ["chip", "inverse"]) {
      const { componentParams } = designSystemOf(parseState({ toggleSelected }))
      expect(componentParams["toggle-button"]?.selected).toBe(toggleSelected)
    }
  })

  test("keeps the Buttons axis params on toggle-button", () => {
    const { componentParams } = designSystemOf(
      parseState({ toggleSelected: "chip", buttonStyle: "bevel" }),
    )
    expect(componentParams["toggle-button"]).toMatchObject({
      style: "bevel",
      selected: "chip",
    })
  })
})
