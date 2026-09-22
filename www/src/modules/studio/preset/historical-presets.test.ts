import { describe, expect, it } from "vitest"

import { defaultPreset, resolveRequestPreset } from "@/lib/registry-preset"
import { PRESETS } from "@/modules/presets/presets-data"
import type { StudioState } from "@/modules/studio/axes"
import { resolveDesignSystem } from "@/modules/studio/resolve"

import { decodePreset, encodeState } from "./codec"
import fixtures from "./historical-presets.json"

function resolve(state: StudioState) {
  try {
    return resolveDesignSystem(state)
  } catch (error) {
    return { error: String(error) }
  }
}

describe("historical preset strings", () => {
  it("are unique", () => {
    expect(new Set(fixtures.map((f) => f.id)).size).toBe(fixtures.length)
    expect(new Set(fixtures.map((f) => f.encoded)).size).toBe(fixtures.length)
  })

  for (const fixture of fixtures) {
    it(`decodes ${fixture.id}`, async () => {
      const { state, codeOptions } = decodePreset(fixture.encoded)
      const designSystem = resolve(state)
      expect({
        knownWrong: fixture.knownWrong,
        state,
        codeOptions,
        designSystem,
      }).toMatchSnapshot()
      // /r/* ships the same resolution
      expect(await resolveRequestPreset(fixture.encoded)).toEqual(
        "error" in designSystem
          ? defaultPreset()
          : { ...designSystem, codeOptions },
      )
    })
  }
})

describe("built-in presets", () => {
  for (const preset of PRESETS) {
    it(`resolves ${preset.id}`, () => {
      expect({
        encoded: encodeState(preset.state),
        state: preset.state,
        designSystem: preset.designSystem,
      }).toMatchSnapshot()
    })
  }
})
