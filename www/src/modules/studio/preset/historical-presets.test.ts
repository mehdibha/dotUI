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

describe("v3 built-ins", () => {
  // #766 re-encoded every built-in by hand; the migration must agree.
  for (const v4 of fixtures.filter((f) => f.format === "v4")) {
    const id = v4.id.replace("v4-", "")
    it(`migrates ${id} onto its v4 encoding`, () => {
      const v3 = fixtures.find((f) => f.id === `v3-${id}`)
      expect(v3 && decode(v3.encoded)).toEqual(decode(v4.encoded))
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
