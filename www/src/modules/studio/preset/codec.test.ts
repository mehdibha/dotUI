import { deflateRaw } from "pako"
import { describe, expect, it } from "vitest"

import { DEFAULT_CODE_OPTIONS } from "@/publisher/code-options"
import { PRESETS } from "@/modules/presets/catalog"
import { DEFAULTS } from "@/modules/studio/axes"

import { decode, decodePreset, encodePreset, encodeState } from "./codec"

/** Encode an arbitrary payload with the same deflate+base64url pipeline as
 *  `encodePreset`, bypassing its typing — for crafting stale/garbage presets. */
function encodeRaw(payload: unknown): string {
  const compressed = deflateRaw(JSON.stringify(payload), { level: 9 })
  const binary = String.fromCharCode(...compressed)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

describe("preset codec — studio state", () => {
  it("encodes the defaults to nothing", () => {
    expect(encodeState(DEFAULTS)).toBeUndefined()
    expect(
      encodePreset({ state: DEFAULTS, codeOptions: DEFAULT_CODE_OPTIONS }),
    ).toBeUndefined()
  })

  it("round-trips a modified state", () => {
    const state = {
      ...DEFAULTS,
      brand: "#ef4444",
      radiusPx: 4,
      density: "compact",
    }
    const encoded = encodeState(state)
    expect(encoded).toBeTypeOf("string")
    expect(decodePreset(encoded ?? "").state).toEqual(state)
  })

  it("round-trips the code options separately from the state", () => {
    const encoded = encodePreset({
      state: DEFAULTS,
      codeOptions: { ...DEFAULT_CODE_OPTIONS, classArrays: true },
    })
    const decoded = decodePreset(encoded ?? "")
    expect(decoded.state).toEqual(DEFAULTS)
    expect(decoded.codeOptions?.classArrays).toBe(true)
  })

  it("drops unknown keys and invalid values, and names them", () => {
    const result = decode(
      encodeRaw({
        v: 3,
        s: { brand: "#ef4444", radiusPx: "big", nope: 1, modes: "dark" },
      }),
    )
    if (!result.ok) throw new Error(result.reason)
    expect(result.state).toEqual({ ...DEFAULTS, brand: "#ef4444" })
    expect(result.dropped).toEqual(["nope", "radiusPx", "modes"])
  })

  it("keeps a leaf only on a known source", () => {
    const result = decode(
      encodeRaw({ v: 4, s: { switchColor: "auto", radioColor: "accent" } }),
    )
    if (!result.ok) throw new Error(result.reason)
    expect(result.state.switchColor).toBe("neutral")
    expect(result.state.radioColor).toBe("accent")
    expect(result.dropped).toEqual(["switchColor"])
  })

  it("fails on a string that is not a preset", () => {
    for (const encoded of ["not-a-preset", "%%%", ""])
      expect(decode(encoded)).toEqual({ ok: false, reason: "corrupt" })
    for (const payload of [
      "hello",
      [1],
      null,
      { v: 4, s: "x" },
      { v: 2, s: {} },
      { v: "4" },
      { nope: 1 },
      { t: { "--radius": 12 } },
    ])
      expect(decode(encodeRaw(payload))).toEqual({
        ok: false,
        reason: "invalid",
      })
  })

  it("fails on a version newer than this codec", () => {
    for (const encoded of [
      encodeRaw({ v: 5, s: { brand: "#ef4444" } }),
      "v5.q1YqU7Iy1VEqVrKqVkoqSsxLUbJSUk5NMwECpdpaAA",
      "v12.x",
    ])
      expect(decode(encoded)).toEqual({ ok: false, reason: "newer-version" })
    expect(decode(encodeRaw({ v: 4.5 }))).toEqual({
      ok: false,
      reason: "invalid",
    })
  })

  it("still decodes garbage to the defaults through decodePreset", () => {
    expect(decodePreset("not-a-preset")).toEqual({ state: DEFAULTS })
    expect(decodePreset(encodeRaw({ v: 5 }))).toEqual({ state: DEFAULTS })
  })
})

describe("preset codec — legacy migration", () => {
  it("maps a resolved design system onto the axes it came from", () => {
    const encoded = encodeRaw({
      c: {
        v: 2,
        seeds: { accent: "#5e6ad2", selection: "#0072f5" },
        primary: "accent",
        vividness: 1.2,
        background: { light: 98, dark: "oled" },
      },
      d: "comfortable",
      t: {
        "--radius": "0.75rem",
        "--font-sans": "'Inter', ui-sans-serif, system-ui, sans-serif",
        "--icon-stroke-width": "1.5",
      },
      i: "tabler",
      o: { ...DEFAULT_CODE_OPTIONS, sectionComments: false },
    })
    const { state, codeOptions } = decodePreset(encoded)
    expect(state.brand).toBe("#5e6ad2")
    expect(state.selectionSeed).toBe("#0072f5")
    expect(state.buttonColor).toBe("accent")
    expect(state.sliderColor).toBe("accent")
    expect(state.switchColor).toBe("accent")
    expect(state.vividness).toBe(1.2)
    expect(state.modes.map((m) => m.bg)).toEqual([98, 0])
    expect(state.density).toBe("comfortable")
    expect(state.radiusPx).toBe(12)
    expect(state.bodyFont).toBe("Inter")
    expect(state.iconLibrary).toBe("tabler")
    expect(state.iconStroke).toBe(1.5)
    expect(codeOptions?.sectionComments).toBe(false)
  })

  it("migrates a v1 color recipe through the v2 migration first", () => {
    const encoded = encodeRaw({
      c: {
        algorithm: "contrast",
        seeds: { neutral: "#8a8f98", accent: "#5e6ad2" },
        knobs: { chromaMult: 1.2 },
        primary: "accent",
      },
    })
    const { state } = decodePreset(encoded)
    expect(state.brand).toBe("#5e6ad2")
    expect(state.vividness).toBe(1.2)
    expect(state.buttonColor).toBe("accent")
  })

  it("names an unknown icon library and unparseable tokens", () => {
    const result = decode(
      encodeRaw({
        i: "heroicons",
        t: { "--radius": "big", "--cursor-interactive": "text" },
      }),
    )
    if (!result.ok) throw new Error(result.reason)
    expect(result.state).toEqual({ ...DEFAULTS, badgeShape: "rounded" })
    expect(result.dropped).toEqual([
      "t.--radius",
      "iconLibrary",
      "cursorControls",
    ])
  })
})

describe("preset codec — canonical encoding", () => {
  // /studio seeds from a stored state via decode → encode on reload; a
  // non-identity roundtrip makes a freshly applied preset look edited.
  for (const preset of PRESETS) {
    it(`encode∘decode is byte-identity for the ${preset.name} preset`, () => {
      const encoded = encodeState(preset.state)
      if (encoded === undefined) return
      expect(encodePreset(decodePreset(encoded))).toBe(encoded)
    })
  }

  it("encodes the same state identically regardless of key order", () => {
    const a = encodeState({ ...DEFAULTS, radiusPx: 12, brand: "#ef4444" })
    const b = encodeState({ ...DEFAULTS, brand: "#ef4444", radiusPx: 12 })
    expect(a).toBeTypeOf("string")
    expect(b).toBe(a)
  })
})
