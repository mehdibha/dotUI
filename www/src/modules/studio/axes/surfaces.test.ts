import { describe, expect, test } from "vitest"

import { lstarOf, mixOklab, toOklch } from "@dotui/colors"
import type { Mode as EngineMode, Oklch, StepName } from "@dotui/colors"

import { resolveColorConfig } from "@/registry/theme"

import { resolveDesignSystem } from "../resolve"
import { buildColorConfig } from "./color"
import { DEFAULT_STATE, DEFAULTS, parseState } from "./index"
import {
  EDGE_OPTIONS,
  flatAllowed,
  LAYERS_OPTIONS,
  NO_SHADOW,
  SHADOW_OPTIONS,
  shadowCss,
  surfaceColorCss,
  surfaceRecipe,
  SURFACE_STYLES,
  surfaceStyle,
  withSurface,
} from "./surfaces"
import type { PerMode, SurfaceColor } from "./surfaces"

const SURFACE_TOKENS = [
  "--card-border",
  "--overlay-border",
  "--shadow-card",
  "--shadow-popover",
  "--shadow-modal",
  "--color-bg",
  "--color-card",
  "--color-popover",
  "--popover-alpha",
  "--popover-backdrop-filter",
]

/* Tailwind's md / lg — what popover and modal ship by default. */
const SHADOW_MD =
  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
const SHADOW_LG =
  "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
const HALF = "color-mix(in oklab, var(--neutral-50) 50%, var(--neutral-100))"

const tokensFor = (overrides: Partial<typeof DEFAULTS>) =>
  resolveDesignSystem(parseState({ ...overrides })).tokens

describe("surfaces", () => {
  test("defaults emit no surface tokens", () => {
    const tokens = tokensFor({})
    for (const name of SURFACE_TOKENS) expect(tokens).not.toHaveProperty(name)
  })

  test("the default recipe is the registry's look (card none · popover md · modal lg)", () => {
    const { card, popover, modalShadow } = surfaceRecipe(DEFAULT_STATE)
    const palette = { step: (s: string) => s, hairline: "" }
    const plain = (pair: PerMode<SurfaceColor>) =>
      surfaceColorCss(pair.light, palette)
    expect(shadowCss(card.shadow, plain)).toBe(NO_SHADOW)
    expect(shadowCss(popover.shadow, plain)).toBe(SHADOW_MD)
    expect(shadowCss(modalShadow, plain)).toBe(SHADOW_LG)
  })

  test("Outlined is the default, and every style reads back as itself", () => {
    expect(surfaceStyle(DEFAULT_STATE)).toMatchObject({
      style: { id: "outlined" },
      exact: true,
    })
    for (const s of SURFACE_STYLES) {
      const state = parseState(s.values)
      expect(surfaceStyle(state)).toEqual({ style: s, exact: true })
      expect(flatAllowed(state) || s.values.surfaceShadow !== "flat").toBe(true)
    }
  })

  test("an edited style names the one it came from", () => {
    const state = parseState({ surfaceShadow: "floating" })
    expect(surfaceStyle(state)).toMatchObject({
      style: { id: "outlined" },
      exact: false,
    })
  })

  test("dropping the edge off flat cards on the page lifts the shadow", () => {
    const flat = parseState({ surfaceShadow: "flat" })
    expect(withSurface(flat, { surfaceEdge: "none" }).surfaceShadow).toBe(
      "subtle",
    )
    const tonal = parseState({ surfaceLayers: "tonal", surfaceShadow: "flat" })
    expect(withSurface(tonal, { surfaceEdge: "none" }).surfaceShadow).toBe(
      "flat",
    )
  })

  test("shadow moves every role together", () => {
    const raised = tokensFor({ surfaceShadow: "raised" })
    expect(raised["--shadow-card"]).toBe("0 1px 2px 0 rgb(0 0 0 / 0.05)")
    expect(raised["--shadow-popover"]).toBe(SHADOW_LG)
    const flat = tokensFor({ surfaceShadow: "flat" })
    expect(flat).not.toHaveProperty("--shadow-card")
    expect(flat["--shadow-modal"]).toBe(SHADOW_MD)
  })

  test("an edgeless system rings its overlays and doubles its shadows in dark", () => {
    const tokens = tokensFor({ surfaceEdge: "none" })
    expect(tokens["--card-border"]).toBe("transparent")
    expect(tokens["--overlay-border"]).toBe(
      "light-dark(transparent, var(--color-border))",
    )
    expect(tokens["--shadow-card"]).toBe(
      "0 0 2px 0 light-dark(rgb(0 0 0 / 0.12), rgb(0 0 0 / 0.24)), 0 1px 3px 0 light-dark(rgb(0 0 0 / 0.1), rgb(0 0 0 / 0.2)), 0 1px 2px -1px light-dark(rgb(0 0 0 / 0.1), rgb(0 0 0 / 0.2))",
    )
    expect(tokens["--color-card"]).toBe(
      `light-dark(var(--neutral-50), ${HALF})`,
    )
  })

  test("grouped lifts white cards off a gray page in light only", () => {
    const tokens = tokensFor({ surfaceLayers: "grouped" })
    expect(tokens["--color-bg"]).toBe(`light-dark(${HALF}, var(--neutral-25))`)
    expect(tokens["--color-card"]).toBe(
      "light-dark(var(--neutral-25), var(--neutral-50))",
    )
    expect(tokens["--color-popover"]).toBe(
      `light-dark(var(--neutral-25), ${HALF})`,
    )
  })

  test("tonal shades cards below the page, above it in dark", () => {
    const tokens = tokensFor({ surfaceLayers: "tonal" })
    expect(tokens["--color-card"]).toBe(HALF)
    expect(tokens).not.toHaveProperty("--color-bg")
  })

  test("glass turns the floating tier translucent; solid is the default", () => {
    const tokens = tokensFor({ surfaceGlass: true })
    expect(tokens["--popover-alpha"]).toBe("70%")
    expect(tokens["--popover-backdrop-filter"]).toBe(
      "blur(40px) saturate(150%)",
    )
    expect(
      Object.keys(tokens).filter((k) => SURFACE_TOKENS.includes(k)),
    ).toEqual(["--popover-alpha", "--popover-backdrop-filter"])
  })

  test("no shadow is Tailwind's transparent shadow, never `none`", () => {
    const tokens = tokensFor({ surfaceLayers: "tonal", surfaceShadow: "flat" })
    expect(tokens["--shadow-card"] ?? NO_SHADOW).toBe(NO_SHADOW)
    for (const value of Object.values(tokens)) expect(value).not.toBe("none")
  })
})

/* Every allowed combination, painted with the default engine at its extreme
   pages: cards must stand off the page and popovers off cards, by an edge, a
   shadow or tone — and dark overlays must stay under the field rung, so
   fields and separators inside them still read. */
describe("surfaces stay legible", () => {
  const MIN_TONE = 1.5

  const combos = LAYERS_OPTIONS.flatMap((l) =>
    EDGE_OPTIONS.flatMap((e) =>
      SHADOW_OPTIONS.map((s) => ({
        surfaceLayers: l.value,
        surfaceEdge: e.value,
        surfaceShadow: s.value,
      })),
    ),
  ).filter(
    (values) =>
      flatAllowed(parseState(values)) || values.surfaceShadow !== "flat",
  )

  const pages = [
    { lightBg: 99, darkBg: 2 },
    { lightBg: 100, darkBg: 0 },
    { lightBg: 96, darkBg: 16 },
  ]

  for (const page of pages) {
    const theme = resolveColorConfig(buildColorConfig(parseState(page)))
    const lstar = (color: SurfaceColor, mode: EngineMode): number => {
      const ramp = theme[mode].scales.neutral!
      const at = (s: string) => toOklch(ramp[s as StepName])
      const oklch = (c: SurfaceColor): Oklch =>
        c.kind === "step"
          ? at(c.step)
          : c.kind === "mix"
            ? mixOklab(at(c.a), c.weight, at(c.b))
            : at("25")
      return lstarOf(oklch(color))
    }

    test.each(combos)(`page ${page.lightBg}/${page.darkBg}: %o`, (values) => {
      const recipe = surfaceRecipe(parseState({ ...values, ...page }))
      for (const mode of ["light", "dark"] as const) {
        const pageL = lstar(recipe.page[mode], mode)
        const cardL = lstar(recipe.card.bg[mode], mode)
        const popoverL = lstar(recipe.popover.bg[mode], mode)
        const cardStandsOut =
          recipe.card.edge[mode].kind !== "none" ||
          recipe.card.shadow.length > 0 ||
          Math.abs(cardL - pageL) >= MIN_TONE
        expect(cardStandsOut, `${mode} card`).toBe(true)
        expect(
          recipe.popover.edge[mode].kind !== "none" ||
            recipe.popover.shadow.length > 0,
          `${mode} popover`,
        ).toBe(true)
        if (mode === "dark") {
          expect(popoverL).toBeLessThan(
            lstar({ kind: "step", step: "100" }, mode),
          )
          expect(cardL).toBeGreaterThan(pageL)
        }
      }
    })
  }
})
