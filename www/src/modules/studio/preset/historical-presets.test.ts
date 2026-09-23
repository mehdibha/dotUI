import { describe, expect, it } from "vitest"

import { resolveRequestPreset } from "@/lib/registry-preset"
import { REVISIONS } from "@/modules/presets/built-ins"
import { arrive } from "@/modules/studio/doc"
import { resolveDesignSystem } from "@/modules/studio/resolve"

import { decode, encodeQuery, readParams } from "./codec"
import fixtures from "./historical-presets.json"

describe("historical preset strings", () => {
  it("are unique", () => {
    expect(new Set(fixtures.map((f) => f.id)).size).toBe(fixtures.length)
    expect(new Set(fixtures.map((f) => f.encoded)).size).toBe(fixtures.length)
  })

  for (const fixture of fixtures) {
    const search = new URLSearchParams({ preset: fixture.encoded })
    it(`decodes ${fixture.id}`, async () => {
      const result = decode({ preset: fixture.encoded })
      if (!result.ok) {
        expect({ reason: result.reason }).toMatchSnapshot()
        // /r/* rejects it rather than serving the defaults
        expect(await resolveRequestPreset(search)).toEqual(result)
        return
      }
      const designSystem = resolveDesignSystem(result.state)
      expect({
        dropped: result.dropped,
        state: result.state,
        codeOptions: result.codeOptions,
        designSystem,
      }).toMatchSnapshot()
      expect(await resolveRequestPreset(search)).toEqual({
        ok: true,
        preset: { ...designSystem, codeOptions: result.codeOptions },
        query: encodeQuery(result.state, result),
      })
    })

    it(`rewrites ${fixture.id} in the grammar without a change`, () => {
      const result = decode({ preset: fixture.encoded })
      if (!result.ok) return
      const query = encodeQuery(result.state, result)
      expect(query).toMatch(/^preset=origin@1(&d=v5\.[\w-]+)?(&code=[\w-]+)?$/)
      expect(decode(readParams(new URLSearchParams(query)))).toEqual({
        ...result,
        dropped: [],
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
      expect(v3 && decode({ preset: v3.encoded })).toEqual(
        decode({ preset: v4.encoded }),
      )
    })
  }
})

describe("built-in presets", () => {
  // Every published revision, so a pinned link's look can't drift.
  for (const [id, revisions] of Object.entries(REVISIONS))
    for (const { rev } of revisions) {
      it(`resolves ${id}@${rev}`, () => {
        const decoded = decode({ preset: `${id}@${rev}` })
        if (!decoded.ok) throw new Error(decoded.reason)
        expect({
          query: encodeQuery(decoded.state, decoded),
          state: decoded.state,
          designSystem: resolveDesignSystem(decoded.state),
        }).toMatchSnapshot()
      })
    }
})

describe("stored built-in strings", () => {
  // Seeded into URLs and saved systems; the studio must not read them as edits.
  for (const fixture of fixtures.filter(
    (f) => f.format === "v3" || f.format === "v4",
  )) {
    const id = fixture.id.replace(/^v[34]-/, "")
    const revisions = REVISIONS[id]
    if (!revisions) continue
    // Written before any later revision, so they open as rev 1.
    const preset = revisions.length === 1 ? id : `${id}@1`
    it(`opens ${fixture.id} as its built-in`, () => {
      expect(arrive({ preset: fixture.encoded }).redirect).toEqual({ preset })
    })
  }
})
