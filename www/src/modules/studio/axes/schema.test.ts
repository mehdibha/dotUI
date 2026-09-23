import { describe, expect, it } from "vitest"

import { DEFAULTS, SCHEMA, validateState } from "./index"
import { parseAxis } from "./schema"

describe("axis schema", () => {
  it("covers exactly the state keys", () => {
    expect(Object.keys(SCHEMA).sort()).toEqual(Object.keys(DEFAULTS).sort())
  })

  it("accepts every default as is", () => {
    for (const [key, spec] of Object.entries(SCHEMA))
      expect(parseAxis(spec, DEFAULTS[key as keyof typeof DEFAULTS])).toEqual(
        DEFAULTS[key as keyof typeof DEFAULTS],
      )
    expect(validateState(DEFAULTS)).toEqual({ state: DEFAULTS, dropped: [] })
  })

  it("drops a value outside each enum's options", () => {
    for (const [key, spec] of Object.entries(SCHEMA)) {
      if (spec.kind !== "enum") continue
      expect(validateState({ [key]: "__bogus__" })).toEqual({
        state: DEFAULTS,
        dropped: [key],
      })
    }
  })

  it("keeps numbers finite and in range", () => {
    for (const radiusPx of [-1000, 1e6, Number.NaN, Infinity, "12"])
      expect(validateState({ radiusPx }).dropped).toEqual(["radiusPx"])
    expect(validateState({ radiusPx: 7.5 }).state.radiusPx).toBe(7.5)
    expect(validateState({ neutralHue: null }).dropped).toEqual([])
    expect(validateState({ focusWidth: null }).dropped).toEqual(["focusWidth"])
  })

  it("keeps only parseable colors; Auto only on the seeds", () => {
    const { state, dropped } = validateState({
      brand: "",
      selectionSeed: "zzz",
      successSeed: "",
      dangerSeed: "oklch(0.6 0.2 25)",
    })
    expect(dropped).toEqual(["brand", "selectionSeed"])
    expect(state.brand).toBe(DEFAULTS.brand)
    expect(state.successSeed).toBe("")
    expect(state.dangerSeed).toBe("oklch(0.6 0.2 25)")
  })

  it("keeps fonts to the catalog and cursors to their keywords", () => {
    const injected = validateState({
      bodyFont: "Inter', x; } body { display: none; } .a { font: '",
      cursorControls: "pointer;}body{display:none",
      headingFont: "",
      monoFont: "JetBrains Mono",
    })
    expect(injected.dropped).toEqual(["bodyFont", "cursorControls"])
    expect(injected.state.bodyFont).toBe(DEFAULTS.bodyFont)
    expect(injected.state.cursorControls).toBe(DEFAULTS.cursorControls)
    expect(injected.state.monoFont).toBe("JetBrains Mono")
    expect(validateState({ bodyFont: "" }).dropped).toEqual(["bodyFont"])
  })

  it("keeps the light + dark pair, normalized to the defaults' order", () => {
    const [light, dark] = DEFAULTS.modes
    const swapped = validateState({
      modes: [
        { ...dark, bg: 0 },
        { ...light, bg: 97, contrast: "high" },
      ],
    })
    expect(swapped.state.modes).toEqual([
      { ...light, bg: 97 },
      { ...dark, bg: 0 },
    ])
    expect(swapped.dropped).toEqual(["modes.contrast"])
    for (const modes of [
      [null],
      [light, light],
      [light],
      [light, { ...dark, bg: 50 }],
      "dark",
    ])
      expect(validateState({ modes })).toEqual({
        state: DEFAULTS,
        dropped: ["modes"],
      })
  })

  it("names keys no axis owns, prototype keys included", () => {
    const raw = JSON.parse('{"nope":1,"constructor":2,"__proto__":3}')
    expect(validateState(raw)).toEqual({
      state: DEFAULTS,
      dropped: ["nope", "constructor", "__proto__"],
    })
  })

  it("falls back to the given base, not the defaults", () => {
    const base = { ...DEFAULTS, radiusPx: 4 }
    expect(validateState({ radiusPx: -1 }, base).state.radiusPx).toBe(4)
  })
})
