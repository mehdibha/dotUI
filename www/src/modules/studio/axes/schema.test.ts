import { describe, expect, it } from "vitest"

import {
  DEFAULT_STATE,
  checkKey,
  DEFAULTS,
  parseState,
  salvageState,
  SCHEMA,
  validate,
} from "./index"

const issueKeys = (raw: unknown) => {
  const result = validate(raw)
  return result.ok ? [] : result.issues.map((issue) => issue.key).sort()
}

describe("state schema", () => {
  it("has exactly one entry per state key", () => {
    expect(Object.keys(SCHEMA).sort()).toEqual(
      Object.keys(DEFAULT_STATE).sort(),
    )
  })

  it("accepts every default, and fills missing keys with them", () => {
    for (const key of Object.keys(SCHEMA))
      expect([
        key,
        checkKey(key, DEFAULTS[key as keyof typeof DEFAULTS]),
      ]).toEqual([key, undefined])
    expect(DEFAULT_STATE).toEqual(DEFAULT_STATE)
    const result = validate({ radiusPx: 4 })
    expect(result.ok && result.state).toEqual(parseState({ radiusPx: 4 }))
  })

  it("checks each kind", () => {
    const ok = (raw: object) => expect(issueKeys(raw)).toEqual([])
    const bad = (raw: object) =>
      expect(issueKeys(raw)).toEqual(Object.keys(raw))

    ok({ buttonStyle: "bevel" })
    bad({ buttonStyle: "raised" })

    ok({ radiusPx: 2 })
    ok({ radiusPx: 20 })
    bad({ radiusPx: 1.99 })
    bad({ radiusPx: "10" })

    ok({ surfaceGlass: true })
    bad({ surfaceGlass: "true" })

    ok({ brand: "oklch(0.6 0.2 250)" })
    ok({ brand: "rebeccapurple" })
    bad({ brand: "zzz" })

    ok({ bodyFont: "Inter" })
    bad({ bodyFont: "inter" })
  })

  it("allows Auto only where the axis has one", () => {
    expect(issueKeys({ successSeed: "", neutralHue: null })).toEqual([])
    expect(
      issueKeys({ headingFont: "same", iconStroke: "auto", lightBg: "auto" }),
    ).toEqual([])
    expect(issueKeys({ headingFont: "", iconStroke: "same" })).toEqual([
      "headingFont",
      "iconStroke",
    ])
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
        focusWidth: 1e6,
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
        "focusWidth",
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

  it("salvages stored state key by key", () => {
    expect(
      salvageState({ radiusPx: 4, brand: "zzz", retiredAxis: "x" }),
    ).toEqual(parseState({ radiusPx: 4 }))
    for (const raw of [null, "state", [DEFAULTS]])
      expect(salvageState(raw)).toEqual(DEFAULT_STATE)
  })
})
