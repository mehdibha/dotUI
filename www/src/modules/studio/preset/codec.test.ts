import { deflateRaw, inflateRaw } from "pako"
import { describe, expect, it } from "vitest"

import { DEFAULT_CODE_OPTIONS } from "@/publisher/code-options"
import { loadRevision, REVISIONS } from "@/modules/presets/built-ins"
import { PRESETS } from "@/modules/presets/catalog"
import { DEFAULTS } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"

import { decode, encodeDesign, encodeQuery, readParams, stateOf } from "./codec"
import { currentBaseline, same } from "./migrations"

/** An arbitrary payload through the codec's deflate+base64url pipeline — for
 *  crafting stale/garbage presets. */
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

/** A v4 blob, as the studio wrote them before the grammar. */
function blob(state: StudioState): string {
  const baseline = currentBaseline()
  const s = Object.fromEntries(
    Object.entries(state).filter(
      ([key, value]) => !same(value, baseline[key as keyof StudioState]),
    ),
  )
  return encodeRaw({ v: 4, s })
}

function decodeState(preset: string): StudioState {
  const result = decode({ preset })
  if (!result.ok) throw new Error(result.reason)
  return result.state
}

describe("preset codec — legacy blobs", () => {
  it("reads a state back from its blob", () => {
    const state = {
      ...DEFAULTS,
      brand: "#ef4444",
      radiusPx: 4,
      density: "compact",
    }
    expect(decodeState(blob(state))).toEqual(state)
    expect(decodeState(blob(currentBaseline()))).toEqual(currentBaseline())
  })

  it("reads an old blob's code options apart from its state", () => {
    const stateOnly = blob({ ...DEFAULTS, brand: "#ef4444" })
    const withOptions = encodeRaw({
      ...decodeRaw(stateOnly),
      o: { classArrays: true },
    })
    const decoded = decode({ preset: withOptions })
    if (!decoded.ok) throw new Error(decoded.reason)
    expect(decoded.codeOptions?.classArrays).toBe(true)
    expect(decoded.state).toEqual(decodeState(stateOnly))
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

/* ------------------------------- grammar ------------------------------- */

const LINEAR = PRESETS.find((p) => p.id === "linear") as (typeof PRESETS)[0]
const LINEAR_1 = { id: "linear", rev: 1 }
const LINEAR_2 = { id: "linear", rev: 2 }

const params = (query: string) => readParams(new URLSearchParams(query))

describe("preset codec — grammar", () => {
  it("names a pristine built-in by its id, pinned to its revision", () => {
    expect(encodeQuery(DEFAULTS)).toBe("preset=origin@1")
    expect(encodeQuery(LINEAR.state, { base: LINEAR_2 })).toBe(
      "preset=linear@2",
    )
    for (const preset of ["linear", "linear@2"])
      expect(decode({ preset })).toEqual({
        ok: true,
        base: LINEAR_2,
        state: LINEAR.state,
        dropped: [],
      })
  })

  it("names a pristine latest built-in by its bare id in the studio", () => {
    expect(encodeDesign(LINEAR.state, LINEAR_2)).toEqual({ preset: "linear" })
    const state = { ...LINEAR.state, radiusPx: 4 }
    expect(encodeDesign(state, LINEAR_2)).toEqual({
      preset: "linear@2",
      d: `v5.${encodeRaw({ radiusPx: 4 })}`,
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
    const query = encodeQuery(state, { base: LINEAR_2 })
    expect(query).toBe(
      `preset=linear@2&d=v5.${encodeRaw({ brand: "#ef4444", radiusPx: 4 })}`,
    )
    expect(decode(params(query))).toEqual({
      ok: true,
      base: LINEAR_2,
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
    const query = encodeQuery(state, { base: LINEAR_2 })
    expect(encodeQuery(reordered, { base: LINEAR_2 })).toBe(query)
    const decoded = decode(params(query))
    if (!decoded.ok) throw new Error(decoded.reason)
    expect(encodeQuery(decoded.state, decoded)).toBe(query)
  })

  it("keeps a diff on the revision it was written against", () => {
    const rev1 = stateOf(LINEAR_1)
    expect(rev1).not.toEqual(LINEAR.state)
    const query = encodeQuery({ ...rev1, radiusPx: 4 }, { base: LINEAR_1 })
    expect(query).toBe(`preset=linear@1&d=v5.${encodeRaw({ radiusPx: 4 })}`)
    expect(decode(params(query))).toEqual({
      ok: true,
      base: LINEAR_1,
      state: { ...rev1, radiusPx: 4 },
      dropped: [],
    })
    expect(decode({ preset: "linear" })).toMatchObject({
      base: LINEAR_2,
      state: LINEAR.state,
    })
    // A pristine older revision stays pinned: its bare id means the latest.
    expect(encodeDesign(rev1, LINEAR_1)).toEqual({ preset: "linear@1" })
  })

  it("reads every published revision exactly as stored", () => {
    for (const [id, revisions] of Object.entries(REVISIONS))
      for (const revision of revisions) {
        const base = { id, rev: revision.rev }
        const { state } = loadRevision(revision)
        expect(decode({ preset: `${id}@${revision.rev}` })).toEqual({
          ok: true,
          base,
          state,
          dropped: [],
        })
        const d = `v5.${encodeRaw({ radiusPx: 3 })}`
        expect(decode({ preset: `${id}@${revision.rev}`, d })).toEqual({
          ok: true,
          base,
          state: { ...state, radiusPx: 3 },
          dropped: [],
        })
      }
  })

  it("drops invalid values to the base revision's", () => {
    const d = `v5.${encodeRaw({ radiusPx: "big", brand: "#ef4444", nope: 1 })}`
    expect(decode({ preset: "linear@2", d })).toEqual({
      ok: true,
      base: LINEAR_2,
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
    const decoded = decode({ preset: blob({ ...DEFAULTS, brand: "#ef4444" }) })
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
    ["invalid", { preset: blob(LINEAR.state), d: `v5.${encodeRaw({})}` }],
    ["newer-version", { preset: "linear@1", d: `v6.${encodeRaw({})}` }],
    ["corrupt", { preset: "linear@1", d: encodeRaw({}) }],
    ["corrupt", { preset: "linear@1", d: "v5.q1Yq" }],
    ["corrupt", { preset: "linear@1", code: "%%%" }],
    ["corrupt", { preset: "linear@01" }],
  ] as const)("fails with %s on %j", (reason, input) => {
    expect(decode(input)).toEqual({ ok: false, reason })
  })
})
