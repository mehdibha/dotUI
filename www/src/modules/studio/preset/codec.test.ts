import { deflateRaw, inflateRaw } from "pako"
import { describe, expect, it } from "vitest"

import { DEFAULT_CODE_OPTIONS } from "@/publisher/code-options"
import { REVISIONS } from "@/modules/presets/built-ins"
import { PRESETS } from "@/modules/presets/catalog"
import { DEFAULTS } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"

import {
  canonicalize,
  decode,
  decodeState,
  encodeQuery,
  encodeState,
  readParams,
} from "./codec"
import { currentBaseline } from "./migrations"

/** Encode an arbitrary payload with the same deflate+base64url pipeline as
 *  `encodeState`, bypassing its typing — for crafting stale/garbage presets. */
function encodeRaw(payload: unknown): string {
  const compressed = deflateRaw(JSON.stringify(payload), { level: 9 })
  const binary = String.fromCharCode(...compressed)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function decodeRaw(encoded: string): Record<string, unknown> {
  const binary = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return JSON.parse(inflateRaw(bytes, { to: "string" }))
}

describe("preset codec — studio state", () => {
  it("encodes the defaults to nothing", () => {
    expect(encodeState(DEFAULTS)).toBeUndefined()
    const reordered = Object.fromEntries(Object.entries(DEFAULTS).reverse())
    expect(encodeState(reordered as typeof DEFAULTS)).toBeUndefined()
  })

  it("encodes a state on the frozen baseline, which is not the default", () => {
    const baseline = currentBaseline()
    expect(baseline).not.toEqual(DEFAULTS)
    const encoded = encodeState(baseline)
    expect(encoded).toBeTypeOf("string")
    expect(decodeState(encoded ?? "")).toEqual(baseline)
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
    expect(decodeState(encoded ?? "")).toEqual(state)
  })

  it("keeps code options out of the studio's string", () => {
    const stateOnly = encodeState({ ...DEFAULTS, brand: "#ef4444" }) as string
    const blob = encodeRaw({
      ...decodeRaw(stateOnly),
      o: { classArrays: true },
    })
    const decoded = decode({ preset: blob })
    if (!decoded.ok) throw new Error(decoded.reason)
    expect(decoded.codeOptions?.classArrays).toBe(true)
    // An old blob's code options don't read as an edit.
    expect(canonicalize(blob)).toBe(stateOnly)
    expect(decodeRaw(stateOnly)).not.toHaveProperty("o")
  })

  it("drops unknown keys and invalid values, and names them", () => {
    const result = decode({
      preset: encodeRaw({
        v: 3,
        s: { brand: "#ef4444", radiusPx: "big", nope: 1, modes: "dark" },
      }),
    })
    if (!result.ok) throw new Error(result.reason)
    expect(result.state).toEqual({ ...currentBaseline(), brand: "#ef4444" })
    expect(result.dropped).toEqual(["nope", "radiusPx", "modes"])
  })

  it("keeps a leaf only on a known source", () => {
    const result = decode({
      preset: encodeRaw({
        v: 4,
        s: { switchColor: "auto", radioColor: "accent" },
      }),
    })
    if (!result.ok) throw new Error(result.reason)
    expect(result.state.switchColor).toBe("neutral")
    expect(result.state.radioColor).toBe("accent")
    expect(result.dropped).toEqual(["switchColor"])
  })

  it("fails on a string that is not a preset", () => {
    expect(decode({ preset: "%%%" })).toEqual({ ok: false, reason: "corrupt" })
    for (const payload of [
      "hello",
      [1],
      null,
      { v: 4, s: "x" },
      { v: 2, s: {} },
      { v: 5, s: {} },
      { v: "4" },
      { v: 4.5 },
      { nope: 1 },
      { t: { "--radius": 12 } },
    ])
      expect(decode({ preset: encodeRaw(payload) })).toEqual({
        ok: false,
        reason: "invalid",
      })
  })

  it("still decodes garbage to the defaults through decodeState", () => {
    expect(decodeState("not-a-preset")).toBe(DEFAULTS)
    expect(decodeState(encodeRaw({ v: 5 }))).toBe(DEFAULTS)
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
    const result = decode({ preset: encoded })
    if (!result.ok) throw new Error(result.reason)
    const { state, codeOptions } = result
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
    const state = decodeState(encoded)
    expect(state.brand).toBe("#5e6ad2")
    expect(state.vividness).toBe(1.2)
    expect(state.buttonColor).toBe("accent")
  })

  it("names an unknown icon library and unparseable tokens", () => {
    const result = decode({
      preset: encodeRaw({
        i: "heroicons",
        t: { "--radius": "big", "--cursor-interactive": "text" },
      }),
    })
    if (!result.ok) throw new Error(result.reason)
    expect(result.state).toEqual({
      ...currentBaseline(),
      badgeShape: "rounded",
    })
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
      expect(encodeState(decodeState(encoded))).toBe(encoded)
    })
  }

  it("encodes the same state identically regardless of key order", () => {
    const a = encodeState({ ...DEFAULTS, radiusPx: 12, brand: "#ef4444" })
    const b = encodeState({ ...DEFAULTS, brand: "#ef4444", radiusPx: 12 })
    expect(a).toBeTypeOf("string")
    expect(b).toBe(a)
  })
})

/* ------------------------------- grammar ------------------------------- */

const LINEAR = PRESETS.find((p) => p.id === "linear") as (typeof PRESETS)[0]
const LINEAR_1 = { id: "linear", rev: 1 }

const params = (query: string) => readParams(new URLSearchParams(query))

describe("preset codec — grammar", () => {
  it("names a pristine built-in by its id, pinned to its revision", () => {
    expect(encodeQuery(DEFAULTS)).toBe("preset=origin@1")
    expect(encodeQuery(LINEAR.state, { base: LINEAR_1 })).toBe(
      "preset=linear@1",
    )
    for (const preset of ["linear", "linear@1"])
      expect(decode({ preset })).toEqual({
        ok: true,
        base: LINEAR_1,
        state: LINEAR.state,
        dropped: [],
      })
  })

  it("reads no preset as Origin's latest revision", () => {
    expect(decode({})).toEqual({
      ok: true,
      base: { id: "origin", rev: 1 },
      state: DEFAULTS,
      dropped: [],
    })
  })

  it("carries the diff against the base revision in a v5 code", () => {
    const state = { ...LINEAR.state, radiusPx: 4, brand: "#ef4444" }
    const query = encodeQuery(state, { base: LINEAR_1 })
    expect(query).toBe(
      `preset=linear@1&d=v5.${encodeRaw({ brand: "#ef4444", radiusPx: 4 })}`,
    )
    expect(decode(params(query))).toEqual({
      ok: true,
      base: LINEAR_1,
      state,
      dropped: [],
    })
  })

  it("writes one string per state and base", () => {
    const state = { ...LINEAR.state, radiusPx: 4, density: "compact" }
    const reordered = Object.fromEntries(
      Object.entries(state)
        .reverse()
        .map(([key, value]) => [
          key,
          key === "modes"
            ? (value as object[]).map((mode) =>
                Object.fromEntries(Object.entries(mode).reverse()),
              )
            : value,
        ]),
    ) as StudioState
    const query = encodeQuery(state, { base: LINEAR_1 })
    expect(encodeQuery(reordered, { base: LINEAR_1 })).toBe(query)
    const decoded = decode(params(query))
    if (!decoded.ok) throw new Error(decoded.reason)
    expect(encodeQuery(decoded.state, decoded)).toBe(query)
  })

  it("keeps a diff on the revision it was written against", () => {
    const revisions = REVISIONS.linear ?? []
    const [first] = revisions
    if (!first) throw new Error("no linear@1")
    const query = encodeQuery(
      { ...LINEAR.state, radiusPx: 4 },
      { base: LINEAR_1 },
    )
    revisions.push({
      rev: 2,
      version: first.version,
      state: { ...first.state, radiusPx: 20, brand: "#10b981" },
    })
    try {
      const pinned = decode(params(query))
      if (!pinned.ok) throw new Error(pinned.reason)
      expect(pinned.base).toEqual(LINEAR_1)
      expect(pinned.state).toEqual({ ...LINEAR.state, radiusPx: 4 })
      const pristine = decode({ preset: "linear" })
      if (!pristine.ok) throw new Error(pristine.reason)
      expect(pristine.base).toEqual({ id: "linear", rev: 2 })
      expect(pristine.state.brand).toBe("#10b981")
    } finally {
      revisions.pop()
    }
  })

  it("drops invalid values to the base revision's", () => {
    const d = `v5.${encodeRaw({ radiusPx: "big", brand: "#ef4444", nope: 1 })}`
    expect(decode({ preset: "linear@1", d })).toEqual({
      ok: true,
      base: LINEAR_1,
      state: { ...LINEAR.state, brand: "#ef4444" },
      dropped: ["radiusPx", "nope"],
    })
  })

  it("carries code options in their own param", () => {
    const query = encodeQuery(DEFAULTS, {
      codeOptions: { ...DEFAULT_CODE_OPTIONS, classArrays: true },
    })
    expect(query).toBe(
      `preset=origin@1&code=${encodeRaw({ classArrays: true })}`,
    )
    const decoded = decode(params(query))
    if (!decoded.ok) throw new Error(decoded.reason)
    expect(decoded.codeOptions).toEqual({
      ...DEFAULT_CODE_OPTIONS,
      classArrays: true,
    })
    expect(
      decode({ code: encodeRaw({ classArrays: "yes", tabs: true }) }),
    ).toMatchObject({ ok: true, dropped: ["code.classArrays", "code.tabs"] })
    expect(encodeQuery(DEFAULTS, { codeOptions: DEFAULT_CODE_OPTIONS })).toBe(
      "preset=origin@1",
    )
  })

  it("lets code= override a legacy blob's code options", () => {
    const blob = encodeRaw({ v: 4, o: { classArrays: true } })
    const code = encodeRaw({ sectionComments: false })
    const decoded = decode({ preset: blob, code })
    if (!decoded.ok) throw new Error(decoded.reason)
    expect(decoded.codeOptions).toEqual({
      classArrays: false,
      sectionComments: false,
    })
    expect(encodeQuery(decoded.state, decoded)).toBe(
      `${encodeQuery(decoded.state)}&code=${code}`,
    )
    const legacy = decode({ preset: encodeRaw({ d: "compact" }), code })
    if (!legacy.ok) throw new Error(legacy.reason)
    expect(legacy.codeOptions).toEqual(decoded.codeOptions)
    expect(decode({ preset: blob, code: "%%%" })).toEqual({
      ok: false,
      reason: "corrupt",
    })
  })

  it("rebases a legacy blob onto Origin's latest revision", () => {
    const blob = encodeState({ ...DEFAULTS, brand: "#ef4444" }) as string
    const decoded = decode({ preset: blob })
    if (!decoded.ok) throw new Error(decoded.reason)
    expect(decoded.base).toEqual({ id: "origin", rev: 1 })
    expect(encodeQuery(decoded.state, decoded)).toBe(
      `preset=origin@1&d=v5.${encodeRaw({ brand: "#ef4444" })}`,
    )
  })

  it.each([
    ["unknown-preset", { preset: "nope" }],
    ["unknown-preset", { preset: "linear@9" }],
    ["unknown-preset", { preset: "constructor" }],
    ["invalid", { preset: "linear", d: `v5.${encodeRaw({})}` }],
    ["invalid", { d: `v5.${encodeRaw({})}` }],
    ["invalid", { preset: "linear@1", d: `v4.${encodeRaw({})}` }],
    ["invalid", { preset: "linear@1", d: `v5.${encodeRaw([1])}` }],
    [
      "invalid",
      { preset: encodeState(LINEAR.state), d: `v5.${encodeRaw({})}` },
    ],
    ["newer-version", { preset: "linear@1", d: `v6.${encodeRaw({})}` }],
    ["corrupt", { preset: "linear@1", d: encodeRaw({}) }],
    ["corrupt", { preset: "linear@1", d: "v5.q1Yq" }],
    ["corrupt", { preset: "linear@1", code: "%%%" }],
    ["corrupt", { preset: "linear@01" }],
  ] as const)("fails with %s on %j", (reason, input) => {
    expect(decode(input)).toEqual({ ok: false, reason })
  })
})
