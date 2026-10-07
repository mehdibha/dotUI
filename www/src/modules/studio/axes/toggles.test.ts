import { describe, expect, test } from "vitest"

import { PRESETS } from "@/modules/presets"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, effective, parseState } from "./index"

describe("toggles axis", () => {
  test("defaults ship the registry default", () => {
    const { componentParams, tokens } = designSystemOf(DEFAULT_STATE)
    expect(componentParams["toggle-button"]?.selected).toBe("tone")
    expect(tokens).toEqual({})
  })

  test("selected look becomes the toggle-button param", () => {
    for (const toggleSelected of ["solid", "tint", "inverse"]) {
      const { componentParams } = designSystemOf(parseState({ toggleSelected }))
      expect(componentParams["toggle-button"]?.selected).toBe(toggleSelected)
    }
  })

  test("keeps the Buttons axis params on toggle-button", () => {
    const { componentParams } = designSystemOf(
      parseState({ toggleSelected: "tint", buttonStyle: "bevel" }),
    )
    expect(componentParams["toggle-button"]).toMatchObject({
      style: "bevel",
      selected: "tint",
    })
  })

  test("under a Solid secondary, a selected toggle is never lighter than its rest", () => {
    const selected = (state: Parameters<typeof parseState>[0]) =>
      designSystemOf(parseState(state)).componentParams["toggle-button"]
        ?.selected
    expect(selected({ buttonSecondary: "solid" })).toBe("inverse")
    expect(selected({ buttonSecondary: "solid", toggleSelected: "tint" })).toBe(
      "inverse",
    )
    expect(
      selected({ buttonSecondary: "solid", toggleSelected: "solid" }),
    ).toBe("solid")
    expect(
      effective(parseState({ buttonSecondary: "solid" })).explain.toggleSelected
        ?.exclude,
    ).toMatchObject({ cause: "buttonSecondary", options: ["tone", "tint"] })
    // Solid itself falls back under a neutral primary, and Tone returns.
    expect(selected({ buttonColor: "neutral", buttonSecondary: "solid" })).toBe(
      "tone",
    )
  })

  test("presets on a Solid secondary select with Solid or Inverse (Carbon)", () => {
    const solid = PRESETS.filter(
      (p) => effective(p.state).values.buttonSecondary === "solid",
    )
    expect(solid.map((p) => p.id)).toContain("carbon")
    for (const preset of solid)
      expect(["solid", "inverse"], preset.id).toContain(
        designSystemOf(preset.state).componentParams["toggle-button"]?.selected,
      )
  })
})
