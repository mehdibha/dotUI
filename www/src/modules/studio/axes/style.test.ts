import { describe, expect, it } from "vitest"

import { designSystemOf } from "../resolve"
import { STYLE_VALUES as BUTTON_STYLES } from "./buttons"
import {
  CHAPTERS,
  DEFAULT_STATE,
  effective,
  followersOf,
  parseState,
  RULES,
} from "./index"
import {
  ALLOWED,
  excludedUnder,
  LOOKS,
  pickStyle,
  STYLE_KEYS,
  STYLE_VALUES,
} from "./style"

const valuesOf = (raw: Record<string, unknown>) =>
  effective(parseState(raw)).values as unknown as Record<string, unknown>

const CHAPTER_DEFAULTS: Record<string, unknown> = Object.assign(
  {},
  ...CHAPTERS.map((chapter) => chapter.defaults),
)

describe("Origin", () => {
  it("is Flat with every Style key on its record", () => {
    expect(DEFAULT_STATE.style).toBe("flat")
    for (const key of STYLE_KEYS) expect(DEFAULT_STATE[key], key).toBe("style")
    expect(followersOf(DEFAULT_STATE, "style")).toEqual([])
  })

  it("Flat's record is each key's chapter default", () => {
    for (const key of STYLE_KEYS)
      expect(LOOKS.flat[key], key).toBe(CHAPTER_DEFAULTS[key])
  })

  it("resolves exactly as the explicit Flat picks", () => {
    const explicit = parseState(
      Object.fromEntries(STYLE_KEYS.map((key) => [key, LOOKS.flat[key]])),
    )
    expect(designSystemOf(DEFAULT_STATE)).toEqual(designSystemOf(explicit))
  })
})

describe("looks", () => {
  it("each style puts its keys and its button on its record", () => {
    for (const style of STYLE_VALUES) {
      const values = valuesOf({ style })
      for (const key of STYLE_KEYS)
        expect([style, key, values[key]]).toEqual([
          style,
          key,
          LOOKS[style][key],
        ])
      const { componentParams } = designSystemOf(parseState({ style }))
      expect(componentParams.button?.style, style).toBe(LOOKS[style].button)
    }
  })

  it("draws every button recipe once", () => {
    expect(STYLE_VALUES.map((style) => LOOKS[style].button).sort()).toEqual(
      [...BUTTON_STYLES].sort(),
    )
  })

  it("never writes what survives a change of look", () => {
    for (const style of STYLE_VALUES)
      expect(valuesOf({ style }), style).toMatchObject({
        surfaceLayers: "same",
        controlEdge: "firm",
        toggleSelected: "tone",
        toastStyle: "surface",
        menuInset: "inset",
        menuSelectedRow: "none",
      })
  })
})

describe("exclusions", () => {
  it("are the three options another look's light draws", () => {
    expect(
      Object.entries(ALLOWED).flatMap(([key, byOption]) =>
        Object.keys(byOption ?? {}).map((option) => `${key}=${option}`),
      ),
    ).toEqual(["surfaceEdge=bevel", "surfaceEdge=ledge", "inputStyle=well"])
    for (const rule of RULES.filter((r) => r.id.startsWith("style/")))
      expect(rule.effect).toMatchObject({ kind: "exclude", fallback: "style" })
  })

  it("fire only off-look, landing on the record", () => {
    for (const [key, byOption] of Object.entries(ALLOWED))
      for (const [option, styles] of Object.entries(byOption ?? {}))
        for (const style of STYLE_VALUES) {
          const at = `${key}=${option} under ${style}`
          const { values, explain } = effective(
            parseState({ style, [key]: option }),
          )
          const { rule } = explain[key as keyof typeof explain] ?? {}
          expect(
            [(values as unknown as Record<string, unknown>)[key], rule],
            at,
          ).toEqual(
            styles.includes(style)
              ? [option, undefined]
              : [valuesOf({ style })[key], expect.stringMatching(/^style\//)],
          )
        }
  })

  it("never fall back onto an excluded option", () => {
    for (const style of STYLE_VALUES)
      for (const key of Object.keys(ALLOWED)) {
        const excluded = excludedUnder(key, style)
        expect(excluded, `${key} under ${style}`).not.toContain(
          valuesOf({ style })[key],
        )
      }
  })
})

describe("picking a style", () => {
  const state = parseState({
    style: "bevel",
    surfaceEdge: "none",
    surfaceShadow: "high",
    inputStyle: "well",
    surfaceLayers: "grouped",
    menuInset: "full-bleed",
    brand: "#e11d48",
  })

  it("puts the whole look back on the Style", () => {
    for (const style of STYLE_VALUES) {
      const picked = pickStyle(state, style)
      expect(picked.style).toBe(style)
      for (const key of STYLE_KEYS) expect(picked[key], key).toBe("style")
      expect(followersOf(picked, "style")).toEqual([])
    }
    const open = parseState({
      buttonSecondary: "outline",
      buttonPress: "nudge",
    })
    expect(pickStyle(open, "hairline")).toMatchObject({
      buttonSecondary: "as-style",
      buttonPress: "as-style",
    })
  })

  it("keeps every pick outside the look", () => {
    expect(pickStyle(state, "flat")).toMatchObject({
      surfaceLayers: "grouped",
      menuInset: "full-bleed",
      brand: "#e11d48",
    })
  })
})
