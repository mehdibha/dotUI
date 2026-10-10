import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { lstarOf, toOklch } from "@dotui/colors"

import { SCHEMA, validate } from "../axes"
import { SOLID_LEAVES } from "../axes/color"
import {
  cleanImportName,
  fitDensity,
  fitRadius,
  impliedTint,
  importDesignMd,
} from "./index"
import type { DesignMdImport, ImportItem } from "./index"
import { box, dim, parseDesignMd, shadows, shadowStrength } from "./parse"
import { resolveFamily } from "./typography"

const fixture = (name: string) =>
  readFileSync(new URL(`./fixtures/${name}.md`, import.meta.url), "utf8")

const FIXTURES = [
  "light-full",
  "dark-only",
  "achromatic-primary",
  "stitch-minimal",
  "prose-only",
  "broken-yaml",
  "refs",
  "square",
  "pill",
  "fonts",
  "empty",
]

const items = (result: DesignMdImport): ImportItem[] => [
  ...result.report.mapped,
  ...result.report.approximated,
  ...result.report.unmapped,
]
const statusOf = (result: DesignMdImport, id: string) =>
  (["mapped", "approximated", "unmapped"] as const).find((status) =>
    result.report[status].some((item) => item.id === id),
  )

const FIXED_IDS = new Set([
  "brand",
  "button-source",
  "neutral-hue",
  "neutral-tint",
  "gradient",
  "type-scale",
  "type-weights",
  "type-tracking",
  "font-features",
  "button-radius",
  "density",
  "spacing-unit",
  "spacing-scale",
  "surface-layers",
  "surface-edge",
  "surface-shadow",
  "surface-glass",
  "shadow-values",
  "shadow-tint",
  "inset-shadow",
  "backdrop-blur",
  "input-style",
  "icon-library",
  "iconography",
  "link-underline",
  "layout-grid",
  "breakpoints",
  "motion",
  "focus-ring",
  "imagery",
])
const PARAM_IDS =
  /^(page:(light|dark)|mode-derived:(light|dark)|status:(success|warning|danger)|font:(heading|body|mono)|radius:(base|control|card|surface|panel)|(color-role|exact-role-color|radius-token|component-recipe):[a-z0-9-]+)$/

describe("invariants over every fixture", () => {
  it.each(FIXTURES)("%s", async (name) => {
    const text = fixture(name)
    const result = await importDesignMd(text)
    expect(validate(result.state).ok).toBe(true)
    for (const key of Object.keys(result.state))
      expect(Object.hasOwn(SCHEMA, key)).toBe(true)
    for (const item of items(result)) {
      expect(item.id).toMatch(/^[a-z-]+(:[a-z0-9-]+)?$/)
      expect(FIXED_IDS.has(item.id) || PARAM_IDS.test(item.id)).toBe(true)
    }
    expect(JSON.stringify(await importDesignMd(text))).toBe(
      JSON.stringify(result),
    )
  })
})

describe("fixtures", () => {
  it("light-full: brand, page, neutral, fonts, shape, space, surfaces", async () => {
    const r = await importDesignMd(fixture("light-full"))
    const s = r.state
    expect(r.source).toBe("frontmatter")
    expect(r.name).toBe("Fixture Light Full")
    expect(s.brand).toBe("#3b5bdb")
    expect(s.preserveSeed).toBe(true)
    expect(statusOf(r, "brand")).toBe("mapped")
    const canvas = toOklch("#faf8f3")
    expect(s.lightBg).toBe(Math.round(lstarOf(canvas) * 2) / 2)
    expect(Math.abs(s.neutralHue! - canvas.h)).toBeLessThanOrEqual(15)
    expect(s.neutralTint).toBeGreaterThan(1)
    expect([s.successSeed, s.warningSeed, s.dangerSeed]).toEqual([
      "#2f9e44",
      "#f08c00",
      "#e03131",
    ])
    expect(s.bodyFont).toBe("Inter")
    expect(s.headingFont).toBe("EB Garamond")
    expect(s.radiusPx).toBe(8)
    expect(s.roleControl).toBe("lg")
    // Card xl is one rung below the derived 2xl panel: auto.
    expect([s.rolePanel, s.roleCard]).toEqual(["2xl", "auto"])
    expect([s.density, s.spacingUnit]).toEqual(["comfortable", 4])
    expect(statusOf(r, "density")).toBe("mapped")
    expect(s.surfaceShadow).toBe("low")
    expect(s.surfaceEdge).toBe("line")
    expect(s.surfaceLayers).toBe("same")
    expect(statusOf(r, "type-scale")).toBe("unmapped")
  })

  it("dark-only: dark page from the canvas, light derived", async () => {
    const r = await importDesignMd(fixture("dark-only"))
    const l = lstarOf(toOklch("#08090a"))
    expect(r.state.darkBg).toBe(Math.round(l * 2) / 2)
    expect(r.state.lightBg).toBeUndefined()
    expect(statusOf(r, "page:dark")).toBe("mapped")
    expect(statusOf(r, "mode-derived:light")).toBe("approximated")
    expect(r.state.brand).toBe("#6e56cf")
  })

  it("achromatic-primary: brand from the link, solids neutral", async () => {
    const text = fixture("achromatic-primary")
    const r = await importDesignMd(text)
    expect(r.state.brand).toBe("#0070f3")
    for (const leaf of SOLID_LEAVES) expect(r.state[leaf]).toBe("neutral")
    expect(r.state.linkColor).toBeUndefined()
    expect(r.state.focusColor).toBeUndefined()
    expect(r.state.tabsColor).toBeUndefined()
    expect(statusOf(r, "button-source")).toBe("mapped")

    const gray = await importDesignMd(text.replace(/^\s+link: .*\n/m, ""))
    expect(gray.state.brand).toBe("#111111")
    expect(gray.state.buttonColor).toBe("neutral")
    expect(statusOf(gray, "brand")).toBe("mapped")
  })

  it("stitch-minimal: page from neutral, guessed source, scale radius", async () => {
    const r = await importDesignMd(fixture("stitch-minimal"))
    const l = lstarOf(toOklch("#f7f5f2"))
    expect(r.state.lightBg).toBe(Math.round(l * 2) / 2)
    expect(r.state.brand).toBe("#b8422e")
    expect(r.state.buttonColor).toBe("neutral")
    expect(statusOf(r, "button-source")).toBe("approximated")
    for (const id of ["radius:base", "radius:control", "radius:card"])
      expect(statusOf(r, id)).toBe("approximated")
    expect([r.state.radiusPx, r.state.roleControl]).toEqual([8, "lg"])
  })

  it("prose-only: colors and fonts from prose, all approximated", async () => {
    const r = await importDesignMd(fixture("prose-only"))
    expect(r.source).toBe("prose")
    expect(r.report.mapped).toEqual([])
    expect(r.report.approximated.length).toBeGreaterThan(0)
    expect(r.warnings).toContain(
      "No frontmatter — read colors, fonts and elevation from prose only.",
    )
    expect(r.state.brand).toBe("#2f6b4f")
    expect(r.state.lightBg).toBe(
      Math.round(lstarOf(toOklch("#f7f4ed")) * 2) / 2,
    )
    expect(r.state.bodyFont).toBe("Inter")
    expect(r.state.headingFont).toBe("Playfair Display")
    expect(r.name).toBe("Fixture Prose Only")
  })

  it("broken-yaml: recovers the other blocks", async () => {
    const r = await importDesignMd(fixture("broken-yaml"))
    expect(r.warnings).toContain(
      "frontmatter block 'description' is invalid YAML — skipped",
    )
    expect(r.state.brand).toBe("#e8590c")
    expect(r.name).toBe("Fixture Broken Yaml")
  })

  it("refs: nested, embedded, cyclic and unquoted values", async () => {
    const text = fixture("refs")
    const doc = await parseDesignMd(text)
    const colors = doc.tokens!.colors as Record<string, unknown>
    const button = (doc.tokens!.components as Record<string, any>)[
      "button-primary"
    ]
    expect(colors.primary).toBe("#abcdef")
    expect(colors.ink).toBe("#222222")
    expect(button.padding).toBe("0.5rem 1rem")
    expect(button.border).toBe("1px solid #e0e0e0")
    expect(button.typography).toEqual({
      fontFamily: "Inter",
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
    })
    expect(doc.warnings.some((w) => w.startsWith("unresolved reference"))).toBe(
      true,
    )
    const r = await importDesignMd(text)
    expect(r.state.brand).toBe("#abcdef")
    expect(r.state.buttonRadius).toBe("pill")
    expect(r.state.roleControl).not.toBe("full")
  })

  it("square: every target 0 picks the square vector", async () => {
    const r = await importDesignMd(fixture("square"))
    expect(r.state).toMatchObject({
      roleControl: "none",
      roleItem: "none",
      roleSurface: "none",
      rolePanel: "none",
      roleCard: "auto",
    })
    expect(r.state.radiusPx).toBeUndefined()
  })

  it("pill: pill controls, or pill buttons only", async () => {
    const both = await importDesignMd(fixture("pill"))
    expect(both.state.roleControl).toBe("full")
    expect(both.state.buttonRadius).toBeUndefined()
    const buttons = await importDesignMd(
      fixture("pill").replace(
        /(text-input:\n\s+rounded: )"\{rounded\.pill\}"/,
        '$1"{rounded.md}"',
      ),
    )
    expect(buttons.state.roleControl).not.toBe("full")
    expect(buttons.state.buttonRadius).toBe("pill")
  })

  it("fonts: catalog, aliases, substitutes and defaults", async () => {
    const r = await importDesignMd(fixture("fonts"))
    expect(r.state.bodyFont).toBe("Inter")
    expect(r.state.headingFont).toBe("EB Garamond")
    expect(r.state.monoFont).toBe("JetBrains Mono")
    const prose =
      "For Copernicus, **EB Garamond** is the closest open substitute."
    const rows: [string, "body" | "heading" | "mono", string, boolean][] = [
      ["sohne-var, 'SF Pro Display', system-ui", "body", "Inter", false],
      ["Inter Variable", "body", "Inter", true],
      ["jetbrains-mono", "mono", "JetBrains Mono", true],
      ["Copernicus, serif", "heading", "EB Garamond", false],
      ["Acme Grotesk, sans-serif", "body", "Geist", false],
      ["Acme Sans, Inter, sans-serif", "body", "Inter", false],
      ["GeistMono", "mono", "Geist Mono", true],
    ]
    for (const [stack, role, family, exact] of rows)
      expect(resolveFamily(stack, role, prose)).toMatchObject({
        family,
        exact,
      })
  })

  it("empty and garbage: nothing to import", async () => {
    expect((await importDesignMd(fixture("empty"))).source).toBe("none")
    const garbage = await importDesignMd("\u0000\u0001 }{ ::: ---")
    expect(garbage.source).toBe("none")
    expect(garbage.state).toEqual({})
    const huge = await importDesignMd("x".repeat(600 * 1024))
    expect(huge.warnings).toContain("File too large")
  })
})

describe("primitives", () => {
  it("dim", () => {
    expect(dim("12px")).toBe(12)
    expect(dim("0.5rem")).toBe(8)
    expect(dim("1.5em")).toBe(24)
    expect(dim(10)).toBe(10)
    expect(dim("10")).toBe(10)
    expect(dim("-3.0px")).toBe(-3)
    expect(dim("50%")).toBeUndefined()
    expect(dim("auto")).toBeUndefined()
  })

  it("box", () => {
    expect(box("8px")).toEqual({ top: 8, right: 8, bottom: 8, left: 8 })
    expect(box("8px 14px")).toEqual({ top: 8, right: 14, bottom: 8, left: 14 })
    expect(box("1px 2px 3px")).toEqual({ top: 1, right: 2, bottom: 3, left: 2 })
    expect(box("0.5rem 1rem 0 2px")).toEqual({
      top: 8,
      right: 16,
      bottom: 0,
      left: 2,
    })
    expect(box("8px auto")).toBeUndefined()
  })

  it("shadows", () => {
    const rgbaFirst = shadows("rgba(15, 15, 15, 0.08) 0px 4px 12px 0px")
    expect(rgbaFirst).toHaveLength(1)
    expect(rgbaFirst[0]).toMatchObject({ x: 0, y: 4, blur: 12, spread: 0 })
    expect(shadowStrength(rgbaFirst[0]!)).toBeCloseTo(1.28)

    const colorLast = shadows(
      "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px #0000001a",
    )
    expect(colorLast).toHaveLength(2)
    expect(shadowStrength(colorLast[0]!)).toBeCloseTo(0.4)
    expect(colorLast[1]!.alpha).toBeCloseTo(0x1a / 255)
    expect(colorLast[1]!.spread).toBe(-1)

    const ring = shadows("0 0 0 1px #00000014 inset")
    expect(ring[0]).toMatchObject({ inset: true, spread: 1, blur: 0 })
    expect(ring[0]!.alpha).toBeCloseTo(0x14 / 255)

    expect(shadows("box-shadow: rgba(0,55,112,0.08) 0 1px 3px;")).toHaveLength(
      1,
    )
    expect(shadows("No shadow, no border")).toEqual([])
  })

  it("fitRadius", () => {
    expect(fitRadius({ control: 8, card: 12 })).toEqual({
      radius: 8,
      rungs: { control: "lg", card: "xl" },
    })
    expect(fitRadius({ control: 6, card: 12 })).toEqual({
      radius: 8,
      rungs: { control: "md", card: "xl" },
    })
    expect(fitRadius({ control: 2, card: 2 }).radius).toBe(2)
  })

  it("fitDensity", () => {
    expect(fitDensity(36, 4)).toMatchObject({ density: "comfortable", unit: 4 })
    expect(fitDensity(32, 4)).toMatchObject({ density: "default", unit: 4 })
    expect(fitDensity(40, 4)).toMatchObject({
      density: "comfortable",
      unit: 4,
      control: 36,
    })
    expect(fitDensity(28)).toMatchObject({ density: "compact", unit: 4 })
  })

  it("impliedTint", () => {
    const steps = [99, 98, 95, 92, 88, 84, 77, 69, 53, 48, 42, 12]
    // Nearest step 25: shape 0.13 at peak 0.016.
    expect(impliedTint(0.016 * 0.13, 99.2, "light", steps)).toBeCloseTo(1)
    expect(impliedTint(0.016 * 0.97 * 2, 54, "light", steps)).toBeCloseTo(2)
    expect(impliedTint(0, 50, "dark", steps)).toBe(0)
  })

  it("cleanImportName", () => {
    expect(cleanImportName("Linear-design-analysis")).toBe("Linear")
    expect(cleanImportName("Stripe-Inspired-design-analysis")).toBe("Stripe")
    expect(cleanImportName("Design System Inspired by Notion")).toBe("Notion")
    expect(cleanImportName("Dell 1996 Inspired")).toBe("Dell 1996")
    expect(cleanImportName("Together-AI-design-analysis")).toBe("Together AI")
    expect(cleanImportName("design-analysis")).toBe("Imported design system")
  })
})
