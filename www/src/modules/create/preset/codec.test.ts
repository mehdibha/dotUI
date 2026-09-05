import { deflateRaw } from "pako"
import { describe, expect, it } from "vitest"

import { ORIGIN, PRESETS } from "@/modules/presets/presets-data"
import { DEFAULTS } from "@/modules/studio/axes"
import { DEFAULT_CODE_OPTIONS } from "@/publisher/code-options"

import { decodePreset, encodePreset, encodeState } from "./codec"

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
    const state = { ...DEFAULTS, brand: "#ef4444", radiusPx: 4, density: "compact" }
    const encoded = encodeState(state)
    expect(encoded).toBeTypeOf("string")
    expect(decodePreset(encoded ?? "").state).toEqual(state)
  })

  it("round-trips the code options separately from the state", () => {
    const encoded = encodePreset({
      state: DEFAULTS,
      codeOptions: { ...DEFAULT_CODE_OPTIONS, classArrays: false },
    })
    const decoded = decodePreset(encoded ?? "")
    expect(decoded.state).toEqual(DEFAULTS)
    expect(decoded.codeOptions?.classArrays).toBe(false)
  })

  it("drops unknown keys and wrongly typed values", () => {
    const encoded = encodeRaw({
      v: 3,
      s: { brand: "#ef4444", radiusPx: "big", nope: 1, modes: "dark" },
    })
    const { state } = decodePreset(encoded)
    expect(state.brand).toBe("#ef4444")
    expect(state.radiusPx).toBe(DEFAULTS.radiusPx)
    expect(state.modes).toEqual(DEFAULTS.modes)
    expect("nope" in state).toBe(false)
  })

  it("decodes garbage to the defaults", () => {
    expect(decodePreset("not-a-preset").state).toEqual(DEFAULTS)
    expect(decodePreset(encodeRaw("hello")).state).toEqual(DEFAULTS)
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
      o: { ...DEFAULT_CODE_OPTIONS, sectionComments: true },
    })
    const { state, codeOptions } = decodePreset(encoded)
    expect(state.brand).toBe("#5e6ad2")
    expect(state.selectionSeed).toBe("#0072f5")
    expect(state.primary).toBe("accent")
    expect(state.vividness).toBe(1.2)
    expect(state.modes.map((m) => m.bg)).toEqual([98, 0])
    expect(state.density).toBe("comfortable")
    expect(state.radiusPx).toBe(12)
    expect(state.bodyFont).toBe("Inter")
    expect(state.iconLibrary).toBe("tabler")
    expect(state.iconStroke).toBe(1.5)
    expect(codeOptions?.sectionComments).toBe(true)
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
    expect(state.primary).toBe("accent")
  })

  it("ignores an unknown icon library and unparseable tokens", () => {
    const encoded = encodeRaw({ i: "heroicons", t: { "--radius": "big" } })
    const { state } = decodePreset(encoded)
    expect(state.iconLibrary).toBe(DEFAULTS.iconLibrary)
    expect(state.radiusPx).toBe(DEFAULTS.radiusPx)
  })
})

describe("preset codec — canonical encoding", () => {
  // /studio seeds from a stored state via decode → encode on reload; a
  // non-identity roundtrip makes a freshly applied preset look edited.
  for (const preset of [ORIGIN, ...PRESETS]) {
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
