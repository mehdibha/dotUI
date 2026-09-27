import { describe, expect, test } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("toggles axis", () => {
  test("defaults ship the registry default", () => {
    const { componentParams, tokens } = resolveDesignSystem(DEFAULT_STATE)
    expect(componentParams["toggle-button"]?.selected).toBe("fill")
    expect(tokens).toEqual({})
  })

  test("selected look becomes the toggle-button param", () => {
    for (const toggleSelected of ["chip", "inverse"]) {
      const { componentParams } = resolveDesignSystem(
        parseState({ toggleSelected }),
      )
      expect(componentParams["toggle-button"]?.selected).toBe(toggleSelected)
    }
  })

  test("keeps the Buttons axis params on toggle-button", () => {
    const { componentParams } = resolveDesignSystem(
      parseState({ toggleSelected: "chip", buttonStyle: "raised" }),
    )
    expect(componentParams["toggle-button"]).toMatchObject({
      style: "raised",
      selected: "chip",
    })
  })
})
