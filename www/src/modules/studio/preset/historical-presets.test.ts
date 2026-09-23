import { describe, expect, it } from "vitest"

import { resolveRequestPreset } from "@/lib/registry-preset"
import { PRESETS } from "@/modules/presets/catalog"
import { resolveDesignSystem } from "@/modules/studio/resolve"

import { canonicalize, decode, encodeState } from "./codec"
import fixtures from "./historical-presets.json"

describe("historical preset strings", () => {
  it("are unique", () => {
    expect(new Set(fixtures.map((f) => f.id)).size).toBe(fixtures.length)
    expect(new Set(fixtures.map((f) => f.encoded)).size).toBe(fixtures.length)
  })

  for (const fixture of fixtures) {
    it(`decodes ${fixture.id}`, async () => {
      const result = decode(fixture.encoded)
      if (!result.ok) {
        expect({ reason: result.reason }).toMatchSnapshot()
        // /r/* rejects it rather than serving the defaults
        expect(await resolveRequestPreset(fixture.encoded)).toEqual(result)
        return
      }
      const designSystem = resolveDesignSystem(result.state)
      expect({
        dropped: result.dropped,
        state: result.state,
        codeOptions: result.codeOptions,
        designSystem,
      }).toMatchSnapshot()
      expect(await resolveRequestPreset(fixture.encoded)).toEqual({
        ok: true,
        preset: { ...designSystem, codeOptions: result.codeOptions },
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

describe("stored built-in strings", () => {
  // Seeded into URLs and saved systems; the studio must not read them as edits.
  const builtIns = new Set(PRESETS.map((p) => encodeState(p.state) ?? ""))
  for (const fixture of fixtures.filter(
    (f) => f.format === "v3" || f.format === "v4",
  )) {
    const id = fixture.id.replace(/^v[34]-/, "")
    if (!PRESETS.some((p) => p.id === id)) continue
    it(`canonicalizes ${fixture.id} onto its built-in`, () => {
      expect(builtIns.has(canonicalize(fixture.encoded))).toBe(true)
    })
  }

  it("canonicalizes the old Origin string to the default system", () => {
    const v4 = fixtures.find((f) => f.id === "v4-origin")
    expect(canonicalize(v4?.encoded)).toBe("")
  })
})
