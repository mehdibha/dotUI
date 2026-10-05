import { describe, expect, test } from "vitest"

import { lstarOf, mixOklab, toOklch } from "@dotui/colors"
import type { Mode as EngineMode, Oklch, StepName } from "@dotui/colors"

import {
  DEFAULT_COLOR_CONFIG,
  resolveColorConfig,
  semanticsFor,
} from "@/registry/theme"
import type { SemanticTarget } from "@/registry/theme"

import { resolveDesignSystem } from "../resolve"
import { buildColorConfig } from "./color"
import { DEFAULT_STATE, DEFAULTS, parseState } from "./index"
import {
  EDGE_OPTIONS,
  flatAllowed,
  GROUPED_PAGE,
  LAYERS_OPTIONS,
  NO_SHADOW,
  SHADOW_OPTIONS,
  shadowCss,
  surfaceColorCss,
  surfaceRecipe,
  SURFACE_STYLES,
  styleScore,
  surfaceStyle,
  withSurface,
} from "./surfaces"
import type { Mode, PerMode, SurfaceColor } from "./surfaces"

const SURFACE_TOKENS = [
  "--card-border",
  "--overlay-border",
  "--shadow-card",
  "--shadow-popover",
  "--shadow-modal",
  "--color-card",
  "--color-popover",
  "--popover-alpha",
  "--popover-backdrop-filter",
]

/* Tailwind's sm / md / lg. */
const SHADOW_SM =
  "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
const SHADOW_MD =
  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
const SHADOW_LG =
  "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
const HALF = "color-mix(in oklab, var(--neutral-50) 50%, var(--neutral-100))"
const QUARTER = "color-mix(in oklab, var(--neutral-50) 75%, var(--neutral-100))"
const WHITE = "oklch(1 0 0)"

const tokensFor = (overrides: Partial<typeof DEFAULTS>) =>
  resolveDesignSystem(parseState({ ...overrides })).tokens

const PALETTE = {
  step: (s: string) => `var(--neutral-${s})`,
  hairline: "var(--color-border)",
}

/** A registry semantic target as the CSS `base/colors.css` declares. */
function targetCss(target: SemanticTarget): string {
  if ("ref" in target) return `var(--${target.ref.palette}-${target.ref.step})`
  if ("on" in target) return `var(--on-${target.on.palette}-${target.on.step})`
  if ("value" in target) return target.value
  const [a, weight, b] = target.mix
  return `color-mix(in oklab, ${targetCss(a)} ${weight}%, ${targetCss(b)})`
}

const registryColor = (token: string, mode: Mode) => {
  const target = semanticsFor(DEFAULT_COLOR_CONFIG)[token]?.target
  if (!target) throw new Error(`no registry token ${token}`)
  return targetCss("light" in target ? target[mode] : target)
}

const combos = LAYERS_OPTIONS.flatMap((l) =>
  EDGE_OPTIONS.flatMap((e) =>
    SHADOW_OPTIONS.map((s) => ({
      surfaceLayers: l.value,
      surfaceEdge: e.value,
      surfaceShadow: s.value,
    })),
  ),
)

describe("surfaces", () => {
  test("defaults emit no surface tokens", () => {
    const tokens = tokensFor({})
    for (const name of SURFACE_TOKENS) expect(tokens).not.toHaveProperty(name)
  })

  test.each(["light", "dark"] as const)(
    "the default recipe is the registry's look in %s",
    (mode) => {
      const { card, popover, modalShadow } = surfaceRecipe(DEFAULT_STATE)
      const css = (pair: PerMode<SurfaceColor>) =>
        surfaceColorCss(pair[mode], PALETTE)
      expect(css(card.bg)).toBe(registryColor("color-card", mode))
      expect(css(popover.bg)).toBe(registryColor("color-popover", mode))
      expect(css(card.edge)).toBe(PALETTE.hairline)
      expect(css(popover.edge)).toBe(PALETTE.hairline)
      expect(shadowCss(card.shadow, css)).toBe(NO_SHADOW)
      expect(shadowCss(popover.shadow, css)).toBe(SHADOW_MD)
      expect(shadowCss(modalShadow, css)).toBe(SHADOW_LG)
    },
  )

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

  test("every combination names one closest style, without ties", () => {
    for (const values of combos) {
      const state = parseState(values)
      const scores = SURFACE_STYLES.map((s) => styleScore(state, s))
      const best = Math.max(...scores)
      expect(
        scores.filter((n) => n === best),
        JSON.stringify(values),
      ).toHaveLength(1)
    }
    const named = (values: Partial<typeof DEFAULTS>) =>
      surfaceStyle(parseState(values)).style.id
    expect(named({ surfaceShadow: "medium" })).toBe("soft")
    expect(named({ surfaceEdge: "none", surfaceShadow: "high" })).toBe(
      "elevated",
    )
    expect(named({ surfaceLayers: "grouped", surfaceEdge: "line" })).toBe(
      "grouped",
    )
    expect(named({ surfaceLayers: "tonal", surfaceShadow: "low" })).toBe(
      "tonal",
    )
  })

  test("dropping the edge off flat cards on the page lifts them to Low", () => {
    const { state } = withSurface(DEFAULT_STATE, { surfaceEdge: "none" })
    expect(state.surfaceShadow).toBe("low")
    expect(surfaceStyle(state)).toMatchObject({
      style: { id: "elevated" },
      exact: true,
    })
    const tonal = parseState({ surfaceLayers: "tonal" })
    expect(
      withSurface(tonal, { surfaceEdge: "none" }).state.surfaceShadow,
    ).toBe("flat")
  })

  test("Flat that would hide cards renders and edits as Low", () => {
    const flat = withSurface(DEFAULT_STATE, {
      surfaceLayers: "grouped",
      surfaceEdge: "none",
      surfaceShadow: "flat",
    }).state
    expect(flat).toMatchObject({ lightBg: GROUPED_PAGE, surfaceShadow: "flat" })
    // The page slider goes through the same guard…
    const white = withSurface({ ...flat, lightBg: 100 }, {}).state
    expect(white.surfaceShadow).toBe("low")
    // …and a state written elsewhere still renders a shadow.
    const raw = parseState({ ...flat, lightBg: 100 })
    expect(flatAllowed(raw)).toBe(false)
    expect(surfaceRecipe(raw).card.shadow.length).toBeGreaterThan(0)
  })

  test("Grouped takes a light page down to gray and gives it back", () => {
    const white = parseState({ lightBg: 100 })
    const entered = withSurface(white, { surfaceLayers: "grouped" })
    expect(entered).toEqual({
      state: expect.objectContaining({ lightBg: GROUPED_PAGE }),
      before: 100,
    })
    const left = withSurface(
      entered.state,
      { surfaceLayers: "same" },
      entered.before,
    )
    expect(left.state.lightBg).toBe(100)
    expect(left.before).toBeUndefined()

    // A page moved while grouped stays; a gray page is kept on the way in.
    const moved = { ...entered.state, lightBg: 94 }
    expect(
      withSurface(moved, { surfaceLayers: "same" }, entered.before).state
        .lightBg,
    ).toBe(94)
    const gray = withSurface(parseState({ lightBg: 95 }), {
      surfaceLayers: "grouped",
    })
    expect(gray).toEqual({
      state: expect.objectContaining({ lightBg: 95 }),
    })
  })

  test("shadow moves every role together", () => {
    const low = tokensFor({ surfaceShadow: "low" })
    expect(low["--shadow-card"]).toBe(SHADOW_SM)
    expect(low).not.toHaveProperty("--shadow-popover")
    const medium = tokensFor({ surfaceShadow: "medium" })
    expect(medium["--shadow-card"]).toBe(SHADOW_MD)
    expect(medium["--shadow-popover"]).toBe(SHADOW_LG)
  })

  test("an edgeless system rings its overlays and doubles its shadows in dark", () => {
    const tokens = tokensFor({ surfaceEdge: "none", surfaceShadow: "low" })
    expect(tokens["--card-border"]).toBe("transparent")
    expect(tokens["--overlay-border"]).toBe(
      "light-dark(transparent, var(--color-border))",
    )
    expect(tokens["--shadow-card"]).toBe(
      "0 0 2px 0 light-dark(rgb(0 0 0 / 0.12), rgb(0 0 0 / 0.24)), 0 1px 3px 0 light-dark(rgb(0 0 0 / 0.1), rgb(0 0 0 / 0.2)), 0 1px 2px -1px light-dark(rgb(0 0 0 / 0.1), rgb(0 0 0 / 0.2))",
    )
    expect(tokens["--color-card"]).toBe(
      `light-dark(var(--neutral-25), ${QUARTER})`,
    )
  })

  test("grouped puts white cards and overlays on the page in light", () => {
    const tokens = tokensFor({ surfaceLayers: "grouped" })
    expect(tokens["--color-card"]).toBe(
      `light-dark(${WHITE}, var(--neutral-50))`,
    )
    expect(tokens["--color-popover"]).toBe(`light-dark(${WHITE}, ${HALF})`)
  })

  test("tonal shades cards below the page, above it in dark", () => {
    const tokens = tokensFor({ surfaceLayers: "tonal" })
    expect(tokens["--color-card"]).toBe(`light-dark(${HALF}, ${QUARTER})`)
    expect(tokens["--color-popover"]).toBe(
      `light-dark(var(--neutral-50), ${HALF})`,
    )
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
})

/* Every allowed combination, painted with the default engine at its extreme
   pages: cards must stand off the page and popovers off cards, by an edge, a
   shadow or tone — and dark overlays must stay under the field rung, so
   fields and separators inside them still read. */
describe("surfaces stay legible", () => {
  const MIN_TONE = 1.5

  const pages = [
    { lightBg: 99, darkBg: 2 },
    { lightBg: 100, darkBg: 0 },
    { lightBg: 96, darkBg: 16 },
  ]

  const lstarFor = (page: (typeof pages)[number]) => {
    const theme = resolveColorConfig(buildColorConfig(parseState(page)))
    return (color: SurfaceColor, mode: EngineMode): number => {
      if (color.kind === "white") return 100
      const ramp: Partial<Record<StepName, string>> =
        theme[mode].scales.neutral ?? {}
      const at = (s: string) => toOklch(ramp[s as StepName] ?? "")
      const oklch = (c: SurfaceColor): Oklch =>
        c.kind === "step"
          ? at(c.step)
          : c.kind === "mix"
            ? mixOklab(at(c.a), c.weight, at(c.b))
            : at("25")
      return lstarOf(oklch(color))
    }
  }

  for (const page of pages) {
    const lstar = lstarFor(page)
    const PAGE: SurfaceColor = { kind: "step", step: "25" }

    test.each(combos)(`page ${page.lightBg}/${page.darkBg}: %o`, (values) => {
      const recipe = surfaceRecipe(parseState({ ...values, ...page }))
      const tones = (mode: EngineMode) => ({
        page: lstar(PAGE, mode),
        card: lstar(recipe.card.bg[mode], mode),
        popover: lstar(recipe.popover.bg[mode], mode),
      })
      for (const mode of ["light", "dark"] as const) {
        const { page, card } = tones(mode)
        const cardStandsOut =
          recipe.card.edge[mode].kind !== "none" ||
          recipe.card.shadow.length > 0 ||
          Math.abs(card - page) >= MIN_TONE
        expect(cardStandsOut, `${mode} card`).toBe(true)
        expect(
          recipe.popover.edge[mode].kind !== "none" ||
            recipe.popover.shadow.length > 0,
          `${mode} popover`,
        ).toBe(true)
      }
      const dark = tones("dark")
      expect(dark.card).toBeGreaterThan(dark.page)
      expect(dark.popover).toBeGreaterThan(dark.card)
      expect(dark.popover).toBeLessThan(
        lstar({ kind: "step", step: "100" }, "dark"),
      )
    })
  }

  test("in light, Same sits on the page and Tonal and Grouped read apart", () => {
    const at = (values: Partial<typeof DEFAULTS>) => {
      const state = parseState(values)
      const lstar = lstarFor({ lightBg: state.lightBg, darkBg: state.darkBg })
      const recipe = surfaceRecipe(state)
      return (
        lstar(recipe.card.bg.light, "light") -
        lstar({ kind: "step", step: "25" }, "light")
      )
    }
    expect(at({})).toBe(0)
    expect(at({ surfaceLayers: "tonal" })).toBeLessThan(-2)
    expect(
      at(withSurface(DEFAULT_STATE, { surfaceLayers: "grouped" }).state),
    ).toBeGreaterThan(3.5)
  })
})
