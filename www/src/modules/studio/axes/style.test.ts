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
      inputStyle: "indicator",
    })
  })

  it("never writes what survives a change of material", () => {
    for (const style of STYLE_VALUES)
      expect(valuesOf({ style }), style).toMatchObject({
        controlEdge: "firm",
        toggleSelected: "tone",
        toastStyle: "surface",
        menuInset: "inset",
        menuSelectedRow: "none",
      })
  })

  it("Polished and Chunky draw the edge their finish implies", () => {
    expect(valuesOf({ style: "polished" }).surfaceEdge).toBe("bevel")
    for (const buttonStyle of ["rim-light", "gloss"])
      expect(valuesOf({ style: "polished", buttonStyle }).surfaceEdge).toBe(
        "line",
      )
    expect(valuesOf({ style: "chunky" })).toMatchObject({
      buttonStyle: "ledge",
      surfaceEdge: "ledge",
      inputStyle: "well",
    })
  })

  it("an Auto column resolves one more hop", () => {
    for (const buttonStyle of ["flat", "hairline"]) {
      const { values, explain } = effective(parseState({ buttonStyle }))
      expect(values.inputStyle).toBe(AUTO_STYLE[buttonStyle])
      expect(explain.inputStyle?.via).toBe("style")
    }
    // Polished's Bevel buttons, read through two Style columns.
    expect(valuesOf({ style: "polished" })).toMatchObject({
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
    // Well needs Polished or Chunky's light: both keep it, Hairline goes.
    for (const style of ["polished", "chunky"] as const)
      expect(pickStyle(state, style)).toMatchObject({
        buttonStyle: "style",
        inputStyle: "well",
      })
  })

  it("drops the old Style's finish, not the new one's", () => {
    const shadowOnly = parseState({ surfaceEdge: "none" })
    expect(pickStyle(shadowOnly, "polished").surfaceEdge).toBe("none")
    const rim = parseState({ style: "polished", buttonStyle: "rim-light" })
    expect(pickStyle(rim, "flat").buttonStyle).toBe("style")
    expect(pickStyle(state, "flat")).toMatchObject({ buttonStyle: "hairline" })
  })

  it("resets every explicit key to the style", () => {
    expect(followersOf(state, "style").sort()).toEqual(
      ["buttonStyle", "inputStyle", "surfaceShadow"].sort(),
    )
    const reset = resetToStyle(pickStyle(state, "tonal"))
    expect(reset.style).toBe("tonal")
    expect(followersOf(reset, "style")).toEqual([])
  })
})
