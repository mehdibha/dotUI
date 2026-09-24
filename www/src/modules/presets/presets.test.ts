import { describe, expect, it } from "vitest"

import { parseState, validate } from "@/modules/studio/axes"

import { closestPreset, ORIGIN, PRESETS } from "./index"

describe("built-in presets", () => {
  it("validate", () => {
    for (const preset of PRESETS)
      expect(validate(preset.state), preset.id).toEqual({
        ok: true,
        state: preset.state,
      })
  })

  it("have unique, slug-shaped ids", () => {
    const ids = PRESETS.map((preset) => preset.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/)
  })

  it("credit the brand they recreate", () => {
    for (const preset of PRESETS)
      if (preset !== ORIGIN) expect(preset.inspiredBy, preset.id).toBeTruthy()
  })

  it("match themselves as the closest preset", () => {
    for (const preset of PRESETS)
      expect(closestPreset(preset.state).id).toBe(preset.id)
    const linear = PRESETS.find((preset) => preset.id === "linear")!
    expect(
      closestPreset(parseState({ ...linear.state, radiusPx: 13 })).id,
    ).toBe("linear")
  })
})
