import { deflateRaw } from "pako"
import { describe, expect, it } from "vitest"

import { DEFAULT_CODE_OPTIONS } from "@/publisher/code-options"
import { LEGACY_ORIGINS, ORIGIN, PRESETS } from "@/modules/presets/presets-data"
import { DEFAULTS } from "@/modules/studio/axes"

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

  it("fans a v3 primary and family fill out onto the leaves they painted", () => {
    const leaves = (s: unknown) => {
      const { state } = decodePreset(encodeRaw({ v: 3, s }))
      return [
        state.buttonColor,
        state.checkboxColor,
        state.radioColor,
        state.switchColor,
        state.selectionColor,
        state.sliderColor,
        state.tabsColor,
        state.linkColor,
        state.focusColor,
      ]
    }
    const inks = ["neutral", "accent", "accent"]
    // The selection tokens and the slider followed the primary.
    expect(leaves({ primary: "accent" })).toEqual([
      ...Array(6).fill("accent"),
      ...inks,
    ])
    // The family fill re-pointed every check, whatever the primary.
    expect(leaves({ checkFill: "accent" })).toEqual([
      "neutral",
      ...Array(5).fill("accent"),
      ...inks,
    ])
    expect(leaves({ primary: "accent", checkFill: "neutral" })).toEqual([
      "accent",
      ...Array(5).fill("neutral"),
      ...inks,
    ])
    expect(leaves({ linkColor: "foreground" })[7]).toBe("neutral")
    const { state } = decodePreset(encodeRaw({ v: 3, s: {} }))
    expect("primary" in state || "checkFill" in state).toBe(false)
  })

  it("keeps a leaf only on a known source", () => {
    const { state } = decodePreset(
      encodeRaw({ v: 4, s: { switchColor: "auto", radioColor: "accent" } }),
    )
    expect(state.switchColor).toBe("neutral")
    expect(state.radioColor).toBe("accent")
  })

  it("decodes garbage to the defaults", () => {
    expect(decodePreset("not-a-preset").state).toEqual(DEFAULTS)
    expect(decodePreset(encodeRaw("hello")).state).toEqual(DEFAULTS)
  })
})

describe("preset codec — strings minted before Origin became the default", () => {
  // Origin as encoded then, before #777 (selection pinned blue) and after.
  const [PINNED_ORIGIN, OLD_ORIGIN] = LEGACY_ORIGINS as [string, string]
  const SPOTIFY =
    "bc7BCsIwDAbgd4nXHTaQCb0KO4v6Al0bXTC0o0t1Y-zdzQQvzuvHnz__DE8w-wIGMDO00U9NDAIGGrpLQoQC2mSDV9lV6A91uUoWieEYOSZ16xzqyZfP1lPWNuiJWdV16B5tHDdxCn2Wi0yMqjcNo1cNmCVZvtK6oiwgaV3c3KbPk9MIpqp1OzI6oT-TBiaPacsvEtf98LK8AQ"

  it("encodes Origin to nothing", () => {
    expect(encodeState(ORIGIN.state)).toBeUndefined()
  })

  it("decodes against the defaults they were minted on", () => {
    const { state } = decodePreset(encodeRaw({ v: 4 }))
    expect(state.brand).toBe("#438cd6")
    expect(state.buttonColor).toBe("neutral")
    expect(state.sliderColor).toBe("neutral")
    // The old Origins carry the #0072f5 brand they were minted on; the
    // studio maps them onto today's Origin by string (LEGACY_ORIGINS).
    const old = { ...DEFAULTS, brand: "#0072f5" }
    expect(decodePreset(OLD_ORIGIN).state).toEqual(old)
    expect(decodePreset(PINNED_ORIGIN).state).toEqual({
      ...old,
      selectionSeed: "#0072f5",
    })
  })

  it("keeps their bytes", () => {
    expect(encodePreset(decodePreset(OLD_ORIGIN))).toBe(OLD_ORIGIN)
    expect(encodePreset(decodePreset(PINNED_ORIGIN))).toBe(PINNED_ORIGIN)
    const spotify = PRESETS.find((p) => p.id === "spotify")
    expect(spotify && encodeState(spotify.state)).toBe(SPOTIFY)
  })
})

describe("preset codec — legacy migration", () => {
  it("maps a resolved design system onto the axes it came from", () => {
    const encoded = encodeRaw({
      c: {
        v: 2,
        seeds: { accent: "#5e6ad2", selection: "#0072f5" },
        primary: "accent",
        scopes: { checkbox: "neutral" },
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
    expect(state.checkboxColor).toBe("neutral")
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
