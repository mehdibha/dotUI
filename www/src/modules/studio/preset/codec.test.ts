import { deflateRaw } from "pako"
import { describe, expect, it } from "vitest"

import { DEFAULT_CODE_OPTIONS } from "@/publisher/code-options"
import { PRESETS } from "@/modules/presets"
import { DEFAULT_STATE, parseState } from "@/modules/studio/axes"

import { decodePreset, encodePreset, encodeState } from "./codec"
import type { DecodeResult } from "./codec"

/** Encode an arbitrary payload with the same deflate+base64url pipeline as
 *  `encodePreset`, bypassing its typing — for crafting hostile presets. */
function encodeRaw(payload: unknown): string {
  const compressed = deflateRaw(JSON.stringify(payload), { level: 9 })
  const binary = String.fromCharCode(...compressed)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function decoded(result: DecodeResult) {
  if (!result.ok) throw new Error(JSON.stringify(result.issues))
  return result.preset
}

describe("preset codec", () => {
  it("encodes the defaults to nothing", () => {
    expect(encodeState(DEFAULT_STATE)).toBeUndefined()
    expect(
      encodePreset({ state: DEFAULT_STATE, codeOptions: DEFAULT_CODE_OPTIONS }),
    ).toBeUndefined()
  })

  it("round-trips a modified state", () => {
    const state = parseState({
      brand: "#ef4444",
      radiusPx: 4,
      density: "compact",
    })
    const encoded = encodeState(state)
    expect(encoded).toBeTypeOf("string")
    expect(decoded(decodePreset(encoded ?? "")).state).toEqual(state)
  })

  it("round-trips the code options separately from the state", () => {
    const encoded = encodePreset({
      state: DEFAULT_STATE,
      codeOptions: { ...DEFAULT_CODE_OPTIONS, classArrays: true },
    })
    const preset = decoded(decodePreset(encoded ?? ""))
    expect(preset.state).toEqual(DEFAULT_STATE)
    expect(preset.codeOptions?.classArrays).toBe(true)
  })

  it("reports unknown keys and bad values instead of salvaging", () => {
    const result = decodePreset(
      encodeRaw({
        v: 4,
        s: { brand: "#ef4444", radiusPx: "big", nope: 1, switchColor: "auto" },
      }),
    )
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.issues.map((issue) => issue.key).sort()).toEqual([
      "nope",
      "radiusPx",
      "switchColor",
    ])
  })

  it("rejects garbage and other versions", () => {
    for (const encoded of [
      "not-a-preset",
      "",
      encodeRaw("hello"),
      encodeRaw(null),
      encodeRaw({ v: 3, s: {} }),
      encodeRaw({ v: 4, s: "brand" }),
      encodeRaw({ c: { seeds: { accent: "#5e6ad2" } } }),
    ])
      expect(decodePreset(encoded).ok).toBe(false)
  })

  it("rejects a deflate bomb without inflating it", () => {
    const bomb = encodeRaw({ v: 4, s: { ["k".repeat(8_000_000)]: 1 } })
    expect(bomb.length).toBeLessThan(20_000)
    expect(decodePreset(bomb)).toEqual({
      ok: false,
      issues: [{ key: "", problem: "not a preset string" }],
    })
  })

  // /studio seeds from a stored state via decode → encode on reload; a
  // non-identity roundtrip makes a freshly applied preset look edited.
  for (const preset of PRESETS) {
    it(`encode∘decode is byte-identity for the ${preset.name} preset`, () => {
      const encoded = encodeState(preset.state)
      if (encoded === undefined) return
      expect(encodePreset(decoded(decodePreset(encoded)))).toBe(encoded)
    })
  }

  it("encodes the same state identically regardless of key order", () => {
    const a = encodeState(parseState({ radiusPx: 12, brand: "#ef4444" }))
    const b = encodeState(parseState({ brand: "#ef4444", radiusPx: 12 }))
    expect(a).toBeTypeOf("string")
    expect(b).toBe(a)
  })
})
