import { describe, expect, it } from "vitest"

import { PRESETS } from "@/modules/presets/presets-data"

import { DEFAULT_STATE, DEFAULTS, SCHEMA, validate } from "./index"
import { checkAxisValue } from "./schema"

const issueKeys = (raw: unknown) => {
  const result = validate(raw)
  return result.ok ? [] : result.issues.map((issue) => issue.key).sort()
}

describe("state schema", () => {
  it("has exactly one entry per state key", () => {
    expect(Object.keys(SCHEMA).sort()).toEqual(Object.keys(DEFAULTS).sort())
  })

  it("accepts every default, and fills missing keys with them", () => {
    for (const [key, schema] of Object.entries(SCHEMA))
      expect(
        checkAxisValue(schema, DEFAULTS[key as keyof typeof DEFAULTS]),
      ).toBeUndefined()
    expect(DEFAULT_STATE).toEqual(DEFAULTS)
    const result = validate({ radiusPx: 4 })
    expect(result.ok && result.state).toEqual({ ...DEFAULTS, radiusPx: 4 })
  })

  it("accepts every built-in preset", () => {
    const invalid = PRESETS.filter((preset) => !validate(preset.state).ok)
    expect(invalid.map((preset) => preset.id)).toEqual([])
  })

  it("checks each kind", () => {
    const ok = (raw: object) => expect(issueKeys(raw)).toEqual([])
    const bad = (raw: object) =>
      expect(issueKeys(raw)).toEqual(Object.keys(raw))

    ok({ buttonStyle: "raised" })
    bad({ buttonStyle: "Raised" })

    ok({ radiusPx: 2 })
    ok({ radiusPx: 20 })
    bad({ radiusPx: 1.99 })
    bad({ radiusPx: "10" })

    ok({ progressGap: true })
    bad({ progressGap: "true" })

    ok({ brand: "oklch(0.6 0.2 250)" })
    ok({ brand: "rebeccapurple" })
    bad({ brand: "zzz" })

    ok({ bodyFont: "Inter" })
    bad({ bodyFont: "inter" })
  })

  it("allows Auto only where the axis has one", () => {
    expect(
      issueKeys({ headingFont: "", successSeed: "", neutralHue: null }),
    ).toEqual([])
    expect(issueKeys({ bodyFont: "", brand: "", radiusPx: null })).toEqual([
      "bodyFont",
      "brand",
      "radiusPx",
    ])
    expect(issueKeys({ neutralHue: "" })).toEqual(["neutralHue"])
    expect(issueKeys({ successSeed: null })).toEqual(["successSeed"])
  })

  it("rejects anything but a plain object", () => {
    for (const raw of [null, undefined, "state", 42, [], [DEFAULTS]])
      expect(validate(raw).ok).toBe(false)
  })

  it("reports unknown keys without salvaging the rest", () => {
    expect(issueKeys({ brand: "#ef4444", nope: 1 })).toEqual(["nope"])
    expect(issueKeys(JSON.parse('{"__proto__": {"radiusPx": 4}}'))).toEqual([
      "__proto__",
    ])
    expect(issueKeys({ modes: [null] })).toEqual(["modes"])
  })

  it("rejects hostile values", () => {
    expect(
      issueKeys({
        cursorControls: "pointer; background: red",
        cursorDisabled: "url(https://evil.test/x.cur), auto",
        bodyFont: "Inter'; } * { color: red; } .x { font-family: '",
        headingFont: "Inter, sans-serif",
        iconWeight: "bold; --x: 1",
        radiusPx: -1000,
        focusHaloStrength: 1e6,
        vividness: Infinity,
        brand: "zzz",
        selectionSeed: "red; }",
        lightBg: null,
        darkBg: "0",
        density: { tier: "compact" },
        preserveSeed: 1,
      }),
    ).toEqual(
      [
        "cursorControls",
        "cursorDisabled",
        "bodyFont",
        "headingFont",
        "iconWeight",
        "radiusPx",
        "focusHaloStrength",
        "vividness",
        "brand",
        "selectionSeed",
        "lightBg",
        "darkBg",
        "density",
        "preserveSeed",
      ].sort(),
    )
  })

  it("mints a state detached from its input", () => {
    const raw = { radiusPx: 4 }
    const result = validate(raw)
    raw.radiusPx = 999
    expect(result.ok && result.state.radiusPx).toBe(4)
  })
})
