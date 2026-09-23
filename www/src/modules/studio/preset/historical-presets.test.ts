import { describe, expect, it } from "vitest"

import { resolveRequestPreset } from "@/lib/registry-preset"
import { PRESETS } from "@/modules/presets/presets-data"
import { DEFAULTS } from "@/modules/studio/axes"
import { resolveDesignSystem } from "@/modules/studio/resolve"

import { decode, encodeState } from "./codec"
import fixtures from "./historical-presets.json"

describe("historical preset strings", () => {
  it("are unique", () => {
    expect(new Set(fixtures.map((f) => f.id)).size).toBe(fixtures.length)
    expect(new Set(fixtures.map((f) => f.encoded)).size).toBe(fixtures.length)
  })

  for (const fixture of fixtures) {
    it(`decodes ${fixture.id}`, async () => {
      const result = decode(fixture.encoded)
      const designSystem = resolveDesignSystem(
        result.ok ? result.state : DEFAULTS,
      )
      expect({
        knownWrong: fixture.knownWrong,
        ...(result.ok
          ? {
              dropped: result.dropped,
              state: result.state,
              codeOptions: result.codeOptions,
              designSystem,
            }
          : { reason: result.reason }),
      }).toMatchSnapshot()
      // /r/* ships the same resolution, still the defaults on a failed decode
      expect(await resolveRequestPreset(fixture.encoded)).toEqual({
        ...designSystem,
        codeOptions: result.ok ? result.codeOptions : undefined,
      })
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
