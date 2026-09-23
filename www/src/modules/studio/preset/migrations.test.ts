import { deflateRaw } from "pako"
import { describe, expect, it } from "vitest"

import { DEFAULT_CODE_OPTIONS } from "@/publisher/code-options"
import { DEFAULTS, validateState } from "@/modules/studio/axes"

import v3 from "./baselines/v3.json"
import v4 from "./baselines/v4.json"
import { decode } from "./codec"
import { BASELINES, currentBaseline, MIGRATIONS, VERSION } from "./migrations"

function encodeRaw(payload: unknown): string {
  const compressed = deflateRaw(JSON.stringify(payload), { level: 9 })
  const binary = String.fromCharCode(...compressed)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function decoded(payload: unknown) {
  const result = decode(encodeRaw(payload))
  if (!result.ok) throw new Error(result.reason)
  return result
}

const v3State = (s: Record<string, unknown>) => decoded({ v: 3, s })

describe("baselines", () => {
  it("has one frozen baseline per version and a migration between each", () => {
    expect(Object.keys(BASELINES).map(Number)).toEqual([3, 4])
    expect(3 + MIGRATIONS.length).toBe(VERSION)
  })

  it("holds only values the schema accepts at the current version", () => {
    expect(validateState(v4.state).dropped).toEqual([])
  })

  it("keeps a frozen default over a retuned live one, and fills added keys live", () => {
    const { radiusPx: _, ...withoutRadius } = v4.state
    expect(currentBaseline({ ...v4.state, radiusPx: 6 }).radiusPx).toBe(6)
    expect(currentBaseline(withoutRadius).radiusPx).toBe(DEFAULTS.radiusPx)
  })
})

describe("v3 → v4", () => {
  it("scales durations by the old speed words", () => {
    expect(v3State({ motionSpeed: "fast" }).state.motionSpeed).toBe(0.75)
    expect(v3State({ motionSpeed: "relaxed" }).state.motionSpeed).toBe(1.4)
    expect(v3State({}).state.motionSpeed).toBe(1)
    const bogus = v3State({ motionSpeed: "warp" })
    expect(bogus.state.motionSpeed).toBe(1)
    expect(bogus.dropped).toEqual(["motionSpeed"])
  })

  it("keeps overlays unadapted when adaptation was off", () => {
    const off = v3State({ mobileAdapt: false, mobileDialogs: "sheet" })
    expect(off.state.mobilePickers).toBe("popover")
    expect(off.state.mobileDialogs).toBe("center")
    expect(off.dropped).toEqual([])
    expect(v3State({ mobileAdapt: true }).state.mobilePickers).toBe("drawer")
  })

  it("moves outline to hairline one depth up", () => {
    const depth = (surfaceDepth?: string) =>
      v3State({ surfaceStrategy: "outline", surfaceDepth }).state
    expect(depth("flat")).toMatchObject({
      surfaceStrategy: "hairline",
      surfaceDepth: "subtle",
    })
    expect(depth().surfaceDepth).toBe("raised")
    expect(depth("raised").surfaceDepth).toBe("floating")
    expect(depth("floating").surfaceDepth).toBe("floating")
  })

  it("fans the primary out onto every solid, and checkFill onto the checks", () => {
    const leaves = (s: Record<string, unknown>) => {
      const { state } = v3State(s)
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
    expect(leaves({ primary: "accent" })).toEqual([
      ...Array(6).fill("accent"),
      ...inks,
    ])
    expect(leaves({ primary: "accent", checkFill: "neutral" })).toEqual([
      ...Array(6).fill("accent"),
      ...inks,
    ])
    // The slider read the primary, not the selection tokens.
    expect(leaves({ checkFill: "accent" })).toEqual([
      "neutral",
      ...Array(4).fill("accent"),
      "neutral",
      ...inks,
    ])
    expect(leaves({ linkColor: "foreground" })[7]).toBe("neutral")
    expect(v3State({ primary: "brand" }).dropped).toEqual(["primary"])
  })

  it("names removed settings only when they left their default", () => {
    expect(v3State(v3.state).dropped).toEqual([])
    expect(
      v3State({
        typeBase: 15,
        headingWeight: "700",
        cornerShape: "squircle",
        surfaceShadow: "layered",
        surfaceEdge: "ring",
        hueShift: 0,
        guarantees: "strict",
        noticeToast: "inverted",
        headingTracking: "normal",
      }).dropped,
    ).toEqual([
      "hueShift",
      "guarantees",
      "headingWeight",
      "typeBase",
      "cornerShape",
      "surfaceShadow",
      "surfaceEdge",
      "noticeToast",
    ])
  })

  it("names a mode contrast only when it was raised", () => {
    const modes = (contrast: string) =>
      v3State({
        modes: v3.state.modes.map((mode) => ({ ...mode, contrast })),
      })
    expect(modes("default").dropped).toEqual([])
    const high = modes("high")
    expect(high.dropped).toEqual(["modes.contrast"])
    expect(high.state.modes).toEqual(DEFAULTS.modes)
  })
})

describe("legacy", () => {
  it("decodes against the pre-studio defaults", () => {
    const { state, codeOptions } = decoded({ d: "compact" })
    expect(state).toEqual({
      ...currentBaseline(),
      density: "compact",
      // The registry's badge radius was --radius-md.
      badgeShape: "rounded",
    })
    // The code style before #743/#744.
    expect(codeOptions).toEqual({ classArrays: true, sectionComments: false })
    expect(decoded({ o: DEFAULT_CODE_OPTIONS }).codeOptions).toBeUndefined()
  })

  it("maps component params onto their successor axes", () => {
    const { state, dropped } = decoded({
      p: {
        avatar: { radius: "--radius-md" },
        badge: { radius: "--radius-full" },
        checkbox: { radius: "--radius-xs" },
        command: { style: "2" },
        input: { style: "filled" },
        menu: { highlight: "accent" },
        loader: { style: "ring" },
        skeleton: { animation: "pulse" },
        slider: { "thumb-style": "outline" },
        card: { style: "tasnim" },
        qr: "x",
      },
    })
    expect(state).toMatchObject({
      avatarShape: "rounded",
      badgeShape: "pill",
      checkCorner: "square",
      menuSearch: "bar",
      inputStyle: "filled",
      menuHighlight: "accent",
      spinnerStyle: "ring",
      skeletonAnimation: "pulse",
      sliderThumb: "outline",
    })
    expect(dropped).toEqual(["p.card.style", "p.qr"])
    expect(decoded({ p: { command: { style: "3" } } }).state.menuSearch).toBe(
      "bar",
    )
    expect(
      decoded({ p: { slider: { "thumb-style": "faceted" } } }).dropped,
    ).toEqual(["p.slider.thumb-style"])
  })

  it("reads the radius factor, and the 8px base before #575", () => {
    const radius = (payload: unknown) => decoded(payload).state.radiusPx
    expect(radius({ t: { "--radius-factor": "0.5" } })).toBe(4)
    expect(radius({ c: { seeds: { accent: "#5e6ad2" } } })).toBe(8)
    expect(radius({ c: { v: 2, seeds: { accent: "#5e6ad2" } } })).toBe(10)
    expect(radius({ t: { "--radius": "0.75rem" } })).toBe(12)
  })

  it("names the tokens no axis carries", () => {
    expect(
      decoded({
        t: { "--shadow-card": "0 1px red", "--color-border-focus": "#1f6feb" },
      }).dropped,
    ).toEqual(["t.--shadow-card", "t.--color-border-focus"])
  })

  it("reads a neutral seed as its hue, or no tint when it is gray", () => {
    const neutral = (seed: string) => {
      const { state } = decoded({
        c: { v: 2, seeds: { accent: "#1ed760", neutral: seed } },
      })
      return [state.neutralHue, state.neutralTint]
    }
    expect(neutral("#6a6a6a")).toEqual([null, 0])
    expect(neutral("#84806f")).toEqual([96, 1])
    expect(neutral("#787774")).toEqual([91, 1])
    // v1's default neutral meant plain gray.
    expect(
      decoded({ c: { seeds: { accent: "#5e6ad2", neutral: "#808080" } } }).state
        .neutralTint,
    ).toBe(0)
  })

  it("gives a replaced recipe the engine's backgrounds", () => {
    const bg = (payload: unknown) =>
      decoded(payload).state.modes.map((mode) => mode.bg)
    expect(bg({ c: { v: 2, seeds: { accent: "#d97757" } } })).toEqual([99, 6])
    expect(
      bg({
        c: { v: 2, seeds: { accent: "#d97757" }, background: { light: 98 } },
      }),
    ).toEqual([98, 6])
    expect(bg({ d: "compact" })).toEqual([99, 2])
  })

  it("names what the recipe carried that no axis holds", () => {
    const { dropped } = decoded({
      c: {
        v: 2,
        seeds: { accent: "#171717", info: "#3b82f6", brand: "#fff" },
        overrides: { "color-border": { palette: "neutral", job: "ui-hover" } },
        guaranteePolicy: "strict",
        hueShift: 0.5,
      },
    })
    expect(dropped).toEqual([
      "c.overrides",
      "c.guaranteePolicy",
      "c.seeds.brand",
      "hueShift",
    ])
    expect(
      decoded({
        c: {
          algorithm: "material",
          seeds: { accent: "#6750a4", neutral: "#79747e", info: "#0ea5e9" },
          knobs: { chromaMult: 1.2, minChroma: 0 },
        },
      }).dropped,
    ).toEqual(["c.seeds.info", "c.algorithm", "c.knobs.minChroma"])
  })
})
