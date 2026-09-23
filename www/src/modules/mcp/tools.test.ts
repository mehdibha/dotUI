import { describe, expect, test } from "vitest"

import { CATALOG, DEFAULTS } from "@/modules/studio/axes"
import { PRIMARY_LEAVES } from "@/modules/studio/axes/color"
import { nearFonts } from "@/modules/studio/axes/spec"
import { decodePreset } from "@/modules/studio/preset/codec"

import {
  axisChapters,
  axisDetails,
  axisOverview,
  check,
  exportDesign,
  getDesign,
  listAxes,
  listFonts,
  listPresets,
  previewUrls,
  setAxes,
  ToolError,
} from "./tools"

const ORIGIN = "https://dotui.org"

describe("list_axes", () => {
  test("the overview names every axis with its values and default", () => {
    const { chapters } = axisOverview()
    const axes = chapters.flatMap((c) => c.axes)
    const keys = axes.map((a) => a.key)
    expect(new Set(keys)).toEqual(
      new Set([...Object.keys(DEFAULTS), "primaryColor"]),
    )
    expect(axes.find((a) => a.key === "density")).toEqual({
      key: "density",
      label: "Density",
      type: "enum",
      values: ["compact", "default", "comfortable"],
      default: "default",
    })
    expect(axes.every((a) => a.label)).toBe(true)
    expect(axes.find((a) => a.key === "radiusPx")).toMatchObject({
      type: "number",
      min: 2,
      max: 20,
      default: 10,
    })
  })

  test("brief chapters carry one-line descriptions, not the evidence", () => {
    const [shape] = axisChapters(["shape"], "brief").chapters
    const radius = shape?.axes.find((a) => a.key === "radiusPx")
    expect(radius).toMatchObject({
      default: 10,
      type: "number",
      label: "Base radius",
    })
    expect(radius).not.toHaveProperty("guidance")
    expect(shape?.recipes?.[0]).toEqual({
      id: "square",
      set: expect.any(Object),
    })
  })

  test("full detail and single axes carry guidance and seenIn", () => {
    const [shape] = axisChapters(["shape"], "full").chapters
    expect(shape?.axes.find((a) => a.key === "radiusPx")).toHaveProperty(
      "guidance",
    )
    const [density] = axisDetails(["density"]).axes
    expect(density).toMatchObject({ chapter: "space", default: "default" })
    expect(JSON.stringify(density)).toContain("seenIn")
  })

  test("primaryColor is a shortcut in the color chapter", () => {
    const shortcut = {
      type: "shortcut",
      values: ["neutral", "accent"],
      default: null,
      description: expect.stringMatching(/not stored.*"mixed"/),
    }
    const [color] = axisChapters(["color"], "brief").chapters
    expect(color?.axes.find((a) => a.key === "primaryColor")).toMatchObject(
      shortcut,
    )
    const overview = axisOverview().chapters.find((c) => c.id === "color")
    expect(overview?.axes.find((a) => a.key === "primaryColor")).toMatchObject(
      shortcut,
    )
  })

  test("the overview carries cautions by value and by axis", () => {
    const axes = axisOverview().chapters.flatMap((c) => c.axes)
    const find = (key: string) => axes.find((a) => a.key === key)
    expect(find("checkCorner")).toMatchObject({
      cautions: { circle: expect.stringMatching(/radio/) },
    })
    expect(find("checkCorner")).not.toHaveProperty("caution")
    expect(find("motionSpeed")).toMatchObject({
      caution: expect.stringMatching(/Higher = slower/),
    })
    expect(find("menuScale")).toMatchObject({ label: "Command palette scale" })
    expect(find("density")).not.toHaveProperty("cautions")
  })

  test("stays small enough for MCP clients", () => {
    const size = (value: unknown) => JSON.stringify(value).length
    const all = CATALOG.map((c) => c.id)
    expect(size(listAxes())).toBeLessThan(22_000)
    expect(size(listAxes({ chapters: all }))).toBeLessThan(
      size(listAxes({ chapters: all, detail: "full" })) / 2,
    )
  })

  test("unknown chapters and axes are errors", () => {
    expect(() => listAxes({ chapters: ["nope"] })).toThrow(ToolError)
    expect(() => listAxes({ axes: ["radius"] })).toThrow(/radiusPx/)
  })
})

describe("set_axes", () => {
  test("applies values and round-trips through the preset", () => {
    const { preset, nonDefault, applied } = setAxes({
      set: { radiusPx: 6, roleControl: "sm" },
    })
    expect(decodePreset(preset).state).toMatchObject({
      radiusPx: 6,
      roleControl: "sm",
    })
    expect(nonDefault.shape).toEqual({ radiusPx: 6, roleControl: "sm" })
    expect(applied).toEqual({
      radiusPx: { from: 10, to: 6 },
      roleControl: { from: "md", to: "sm" },
    })
  })

  test("applied is this call's delta; nonDefault is cumulative", () => {
    const first = setAxes({ set: { radiusPx: 6 } })
    const second = setAxes({
      preset: first.preset,
      set: { density: "compact" },
    })
    expect(Object.keys(second.applied)).toEqual(["density"])
    expect(second.nonDefault).toMatchObject({
      shape: { radiusPx: 6 },
      space: { density: "compact" },
    })
  })

  test("restated values are reported as noop", () => {
    const result = setAxes({
      set: { radiusPx: 10, density: "compact", buttonStyle: "flat" },
    })
    expect(result.noop).toEqual(["radiusPx", "buttonStyle"])
    expect(Object.keys(result.applied)).toEqual(["density"])
  })

  test("reports what moved in the resolved system", () => {
    const { effects } = setAxes({ set: { radiusPx: 12 } })
    expect(effects.tokens["--radius"]).toEqual({
      from: undefined,
      to: "0.75rem",
    })
  })

  test("builder-only vars surface as the param they drive", () => {
    const { effects } = setAxes({
      set: { buttonRadius: "pill", roleControl: "sm" },
    })
    expect(JSON.stringify(effects)).not.toContain("--studio-")
    expect(effects.params.button?.radius).toEqual({
      from: undefined,
      to: "full",
    })
    expect(effects.params["radius-role"]?.control).toEqual({
      from: undefined,
      to: "sm",
    })
  })

  test("is atomic, lists every problem and says the rest was valid", () => {
    const run = () =>
      setAxes({
        set: {
          radiusPx: 999,
          roleControl: "huge",
          nope: 1,
          density: "compact",
        },
      })
    expect(run).toThrow(/radiusPx/)
    expect(run).toThrow(/roleControl/)
    expect(run).toThrow(/nope: unknown axis/)
    expect(run).toThrow(/Every other key in this call was valid/)
  })

  test("suggests the axis a near-miss key meant", () => {
    expect(() => setAxes({ set: { radius: 8 } })).toThrow(/radiusPx/)
  })

  test("suggests catalog fonts for a family it lacks", () => {
    expect(() => setAxes({ set: { monoFont: "IBM Plex Mono" } })).toThrow(
      /curated set of Google variable fonts — closest: .*Mono/,
    )
    const mono = nearFonts("IBM Plex Mono")
    expect(mono[0]).toBe("Geist Mono")
    expect(mono).not.toContain("IBM Plex Sans")
    expect(() => setAxes({ set: { monoFont: "Menlo" } })).toThrow(
      /closest: Geist Mono, JetBrains Mono/,
    )
    expect(nearFonts("inter")[0]).toBe("Inter")
  })

  test("resets axes and whole chapters", () => {
    const { preset } = setAxes({
      set: { radiusPx: 6, roleControl: "sm" },
    })
    const one = setAxes({ preset, reset: ["radiusPx"] })
    expect(one.nonDefault.shape).toEqual({ roleControl: "sm" })
    const all = setAxes({ preset, reset: ["shape"] })
    expect(all.preset).toBe("")
  })

  test("primaryColor writes every leaf; explicit leaves win", () => {
    const { preset, warnings } = setAxes({
      set: { primaryColor: "accent", tabsColor: "neutral" },
    })
    const { state } = decodePreset(preset)
    for (const leaf of PRIMARY_LEAVES)
      expect(state[leaf]).toBe(leaf === "tabsColor" ? "neutral" : "accent")
    expect(getDesign(ORIGIN, preset).primaryColor).toBe("mixed")
    expect(warnings?.join() ?? "").not.toMatch(/Mixed Primary/)

    const all = setAxes({ set: { primaryColor: "accent" } })
    expect(getDesign(ORIGIN, all.preset).primaryColor).toBe("accent")
    expect(all.warnings?.join() ?? "").not.toMatch(/Mixed Primary/)
    expect(
      setAxes({ preset: all.preset, set: { primaryColor: "accent" } }).noop,
    ).toEqual(["primaryColor"])
    expect(() => setAxes({ set: { primaryColor: "brand" } })).toThrow(
      /primaryColor: expected one of neutral, accent/,
    )
  })

  test("applying a cautioned value echoes its caution", () => {
    const { warnings, preset } = setAxes({
      set: { checkCorner: "circle", motionSpeed: 1.2, density: "compact" },
    })
    expect(warnings).toEqual([
      expect.stringMatching(/^checkCorner "circle": .*radio/),
      expect.stringMatching(/^motionSpeed 1\.2: Higher = slower/),
    ])
    const again = setAxes({ preset, set: { checkCorner: "circle" } })
    expect(again.warnings).toBeUndefined()
    expect(setAxes({ set: { checkCorner: "square" } })).not.toHaveProperty(
      "warnings",
    )
  })

  test("results carry no links", () => {
    expect(setAxes({ set: { radiusPx: 6 } })).not.toHaveProperty("links")
  })

  test("brand buttons beside neutral checks warn", () => {
    const { warnings } = setAxes({ set: { buttonColor: "accent" } })
    expect(warnings?.join()).toMatch(
      /Mixed Primary: buttons are accent but checkboxColor, radioColor, switchColor, sliderColor, tabsColor are still neutral/,
    )
  })

  test("code options ride in the preset", () => {
    const { preset } = setAxes({ codeOptions: { classArrays: true } })
    expect(getDesign(ORIGIN, preset).codeOptions.classArrays).toBe(true)
  })

  test("every chapter's recipes apply cleanly", () => {
    for (const chapter of CATALOG)
      for (const recipe of chapter.recipes ?? [])
        expect(() => setAxes({ set: recipe.set })).not.toThrow()
  })
})

describe("check", () => {
  test("reports resolved colors and contrast per mode", () => {
    const result = check()
    for (const mode of [result.light, result.dark]) {
      expect(mode.colors.bg).toMatch(/^#[0-9a-f]{6}$/)
      expect(mode.colors.primary).toMatch(/^#[0-9a-f]{6}$/)
      expect(mode.contrast["fg/bg"]).toMatchObject({ min: 4.5, pass: true })
      expect(mode.contrast["border-control/card"]).toMatchObject({ min: 3 })
    }
    expect(result.size).toEqual({
      density: "default",
      unitPx: 4,
      controlHeightPx: 32,
      controlTextPx: 14,
    })
    expect(result.radiusPx).toMatchObject({ base: 10, control: 7.5, panel: 15 })
  })

  test("the defaults' own failures are not blamed on the design", () => {
    expect(check().problems).toEqual([])
    expect(check().inDefaults.length).toBeGreaterThan(0)
  })

  test("catches a brand that collides with a status hue", () => {
    const { preset } = setAxes({ set: { brand: "#22c55e" } })
    expect(check(preset).problems.join()).toMatch(
      /brand and success share a hue/,
    )
  })

  test("catches an auto info hue beside the brand, quiet once info matches it", () => {
    const { preset } = setAxes({ set: { brand: "#5e6ad2" } })
    expect(check(preset).problems.join()).toMatch(
      /brand and info share a hue.*move the info seed/,
    )
    const matched = setAxes({ preset, set: { infoSeed: "#5e6ad2" } })
    const result = check(matched.preset)
    expect(result.problems.join()).not.toMatch(/info/)
    expect(result.hues.info).toBe(result.hues.brand)
    expect(result.light.colors.info).toBe(result.light.colors.accent)
  })

  test("catches a set info seed a near-miss from the brand", () => {
    for (const infoSeed of ["#3b82f6", "#4862ff"]) {
      const { preset } = setAxes({
        set: { brand: "#5e6ad2", infoSeed },
      })
      expect(check(preset).problems.join()).toMatch(
        /brand and info share a hue.*move the info seed/,
      )
    }
  })

  test("sees an untinted neutral", () => {
    const { preset } = setAxes({ set: { neutralTint: 0 } })
    const result = check(preset)
    expect(result.neutralTinted).toEqual({ light: false, dark: false })
    expect(result.light.neutralChroma.bg).toBe(0)
  })

  test("flags a near-black brand the engine pulls toward gray", () => {
    const { preset } = setAxes({ set: { brand: "#141414" } })
    expect(check(preset).problems.join()).toMatch(
      /renders visibly off its seed.*use primaryColor: "neutral"/,
    )
  })

  test("a neutral Primary isn't told to go neutral", () => {
    const { preset } = setAxes({
      set: { brand: "#141414", primaryColor: "neutral" },
    })
    const problems = check(preset).problems.join()
    expect(problems).toMatch(/renders visibly off its seed.*preserveSeed/)
    expect(problems).not.toMatch(/primaryColor/)
  })

  test("a tinted canvas keeps neutral fills visible on dark cards", () => {
    const { preset } = setAxes({
      set: { surfaceCanvas: "tinted" },
    })
    expect(check(preset).problems.join()).not.toMatch(/neutral fills/)
  })

  test("a deliberate Primary fork isn't warned about", () => {
    const fork = setAxes({
      set: { primaryColor: "accent", tabsColor: "neutral" },
    })
    expect(fork.warnings?.join() ?? "").not.toMatch(/Mixed Primary/)
    const half = setAxes({ set: { buttonColor: "accent" } })
    expect(half.warnings?.join()).toMatch(/Mixed Primary/)
    expect(check(half.preset).notes?.join()).toMatch(/Mixed Primary/)
    expect(check(half.preset).problems.join()).not.toMatch(/Mixed Primary/)
  })

  test("follows preset token re-points and pill shapes", () => {
    const vercel = listPresets().presets.find((p) => p.id === "vercel")
    const result = check(vercel?.preset)
    expect(result.light.colors.card).not.toBe(check().light.colors.card)
    const pill = setAxes({ set: { roleControl: "full" } })
    expect(check(pill.preset).radiusPx.control).toBe("full")
  })
})

describe("presets and links", () => {
  test("presets decode to their own state", () => {
    const [origin] = listPresets().presets
    expect(decodePreset(origin?.preset ?? "").state.brand).toBe("#0072f5")
  })

  test("links carry the preset and an explicit mode", () => {
    const { preset } = setAxes({ set: { radiusPx: 6 } })
    const urls = previewUrls(ORIGIN, preset)
    expect(urls.studio).toBe(`${ORIGIN}/studio?preset=${preset}`)
    expect(urls.url).toBe(
      `${ORIGIN}/preview/{page}?preset=${preset}&mode={light|dark}`,
    )
    expect(urls.pages[0]).toBe("overview")
    expect(urls.pages.length).toBeGreaterThan(5)
    expect(previewUrls(ORIGIN).url).toBe(
      `${ORIGIN}/preview/{page}?mode={light|dark}`,
    )
    expect(previewUrls(ORIGIN, preset, ["overview"]).pages).toEqual([
      "overview",
    ])
    expect(() => previewUrls(ORIGIN, preset, ["nope"])).toThrow(
      /Unknown page: nope/,
    )
    expect(exportDesign(ORIGIN, preset).shadcn.init.npm).toContain(
      `${ORIGIN}/r/init?preset=${preset}`,
    )
  })
})

describe("list_fonts", () => {
  test("caps the list and counts the rest", () => {
    const { fonts, more } = listFonts()
    expect(fonts).toHaveLength(30)
    expect(more).toBeGreaterThan(100)
    expect(listFonts({ category: "mono", limit: 3 }).fonts).toHaveLength(3)
  })

  test("a category filter doesn't hide a name match", () => {
    const result = listFonts({ category: "display", query: "fredoka" })
    expect(result.fonts).toEqual([])
    expect(result.otherCategories).toEqual([
      { family: "Fredoka", category: "sans-serif" },
    ])
    expect(listFonts({ query: "fredoka" })).toEqual({
      fonts: [{ family: "Fredoka", category: "sans-serif" }],
    })
  })
})
