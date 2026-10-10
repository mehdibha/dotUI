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
import { AUTO_STYLE } from "./inputs"
import {
  ALLOWED,
  COLUMNS,
  excludedUnder,
  pickStyle,
  resetToStyle,
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
  it("is Flat with every Style key on its column", () => {
    expect(DEFAULT_STATE.style).toBe("flat")
    for (const key of STYLE_KEYS) expect(DEFAULT_STATE[key], key).toBe("style")
    expect(followersOf(DEFAULT_STATE, "style")).toEqual([])
  })

  it("Flat's column is each key's previous default", () => {
    for (const key of STYLE_KEYS)
      expect(COLUMNS[key].flat, key).toBe(CHAPTER_DEFAULTS[key])
  })

  it("resolves exactly as the explicit Flat picks", () => {
    const explicit = parseState(
      Object.fromEntries(STYLE_KEYS.map((key) => [key, COLUMNS[key].flat])),
    )
    expect(designSystemOf(DEFAULT_STATE)).toEqual(designSystemOf(explicit))
  })
})

describe("columns", () => {
  it("each style puts its keys on their column", () => {
    for (const style of STYLE_VALUES) {
      const values = valuesOf({ style })
      for (const key of STYLE_KEYS)
        expect([style, key, values[key]]).toEqual([
          style,
          key,
          valuesOf({ style, [key]: COLUMNS[key][style] })[key],
        ])
    }
    expect(valuesOf({ style: "tonal" })).toMatchObject({
      surfaceLayers: "tonal",
      surfaceEdge: "none",
      controlEdge: "strong",
      inputStyle: "indicator",
      toastStyle: "inverse",
    })
  })

  it("an Auto column resolves one more hop", () => {
    for (const buttonStyle of ["flat", "hairline"]) {
      const { values, explain } = effective(parseState({ buttonStyle }))
      expect(values.inputStyle).toBe(AUTO_STYLE[buttonStyle])
      expect(explain.inputStyle?.via).toBe("style")
    }
    // Tactile's Bevel buttons, read through two Style columns.
    expect(valuesOf({ style: "tactile" })).toMatchObject({
      buttonStyle: "bevel",
      inputStyle: AUTO_STYLE.bevel,
      segmentedSelected: "raised",
    })
  })
})

describe("exclusions", () => {
  it("are the nine options other styles own", () => {
    expect(
      Object.values(ALLOWED).flatMap((byOption) => Object.keys(byOption ?? {})),
    ).toHaveLength(9)
    for (const rule of RULES.filter((r) => r.cause === "style"))
      expect(rule.effect).toMatchObject({ kind: "exclude", fallback: "style" })
  })

  it("fire only off-style, landing on the style's column", () => {
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
      for (const buttonStyle of [...BUTTON_STYLES, "style"])
        for (const key of Object.keys(ALLOWED)) {
          const excluded = excludedUnder(key, style)
          for (const option of excluded) {
            const value = valuesOf({ style, buttonStyle, [key]: option })[key]
            expect(
              excluded,
              `${key} under ${style}/${buttonStyle}`,
            ).not.toContain(value)
          }
        }
  })
})

describe("picking a style", () => {
  const state = parseState({
    buttonStyle: "hairline",
    inputStyle: "well",
    surfaceShadow: "high",
    menuInset: "full-bleed",
  })

  it("drops only the picks the new style excludes", () => {
    const tonal = pickStyle(state, "tonal")
    expect(tonal).toMatchObject({
      style: "tonal",
      buttonStyle: "style",
      inputStyle: "style",
      surfaceShadow: "high",
      menuInset: "full-bleed",
    })
    expect(pickStyle(state, "soft")).toMatchObject({
      style: "soft",
      buttonStyle: "hairline",
      inputStyle: "style",
    })
    // Well is Tactile's own: picking Tactile keeps it, Hairline goes.
    expect(pickStyle(state, "tactile")).toMatchObject({
      buttonStyle: "style",
      inputStyle: "well",
    })
  })

  it("resets every explicit key to the style", () => {
    expect(followersOf(state, "style").sort()).toEqual(
      ["buttonStyle", "inputStyle", "menuInset", "surfaceShadow"].sort(),
    )
    const reset = resetToStyle(pickStyle(state, "soft"))
    expect(reset.style).toBe("soft")
    expect(followersOf(reset, "style")).toEqual([])
  })
})
