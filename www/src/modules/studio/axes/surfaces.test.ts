import { describe, expect, test } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"
import {
  NO_SHADOW,
  shadowCss,
  surfaceColorCss,
  surfaceRecipe,
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

const tokensFor = (overrides: Partial<typeof DEFAULTS>) =>
  resolveDesignSystem({ ...DEFAULTS, ...overrides }).tokens

describe("surfaces", () => {
  test("defaults emit no surface tokens", () => {
    const tokens = tokensFor({})
    for (const name of SURFACE_TOKENS) expect(tokens).not.toHaveProperty(name)
  })

  test("the default recipe is the registry's look (card none · popover md · modal lg)", () => {
    const { card, popover, modal } = surfaceRecipe(DEFAULTS)
    const palette = { step: (s: string) => s, hairline: "" }
    const plain = (pair: PerMode<SurfaceColor>) =>
      surfaceColorCss(pair.light, palette)
    expect(shadowCss(card.shadow, plain)).toBe(NO_SHADOW)
    expect(shadowCss(popover.shadow, plain)).toBe(SHADOW_MD)
    expect(shadowCss(modal.shadow, plain)).toBe(SHADOW_LG)
  })

  test("depth moves every role one rung", () => {
    const flat = tokensFor({ surfaceDepth: "flat" })
    expect(flat["--card-border"]).toBe(
      "light-dark(var(--neutral-200), var(--neutral-100))",
    )
    expect(flat["--shadow-popover"]).toBe(
      "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    )
    expect(flat["--shadow-modal"]).toBe(SHADOW_MD)
    const raised = tokensFor({ surfaceDepth: "raised" })
    expect(raised["--shadow-card"]).toBe("0 1px 2px 0 rgb(0 0 0 / 0.05)")
    expect(raised["--shadow-popover"]).toBe(SHADOW_LG)
  })

  test("adaptive re-weights: faint ring + shadow in light, brighter edge + tighter shadow in dark", () => {
    const tokens = tokensFor({ surfaceStrategy: "adaptive" })
    expect(tokens["--card-border"]).toBe(
      "light-dark(var(--neutral-100), var(--neutral-200))",
    )
    expect(tokens["--shadow-card"]).toBe(
      "0 1px 3px 0 light-dark(rgb(0 0 0 / 0.1), transparent), 0 1px 2px -1px light-dark(rgb(0 0 0 / 0.1), transparent), 0 1px 2px 0 light-dark(transparent, rgb(0 0 0 / 0.2))",
    )
    expect(tokens["--shadow-popover"]).toBe(
      "0 10px 15px -3px light-dark(rgb(0 0 0 / 0.1), transparent), 0 4px 6px -4px light-dark(rgb(0 0 0 / 0.1), transparent), 0 4px 6px -1px light-dark(transparent, rgb(0 0 0 / 0.4)), 0 2px 4px -2px light-dark(transparent, rgb(0 0 0 / 0.4))",
    )
    expect(tokens["--color-popover"]).toBe(
      "light-dark(var(--neutral-50), var(--neutral-100))",
    )
  })

  test("shadow casts harder in dark, with an ambient layer under the key", () => {
    const tokens = tokensFor({ surfaceStrategy: "shadow" })
    expect(tokens["--card-border"]).toBe("transparent")
    const key = "light-dark(rgb(0 0 0 / 0.12), rgb(0 0 0 / 0.36))"
    expect(tokens["--shadow-card"]).toBe(
      `0 4px 6px -1px ${key}, 0 2px 4px -2px ${key}, 0 8px 24px 4px light-dark(rgb(0 0 0 / 0.06), rgb(0 0 0 / 0.18))`,
    )
  })

  test("tinted canvas lifts white cards off a gray page, a full rung in dark", () => {
    const tokens = tokensFor({ surfaceCanvas: "tinted" })
    expect(tokens["--color-bg"]).toBe(
      "light-dark(color-mix(in oklab, var(--neutral-50) 50%, var(--neutral-100)), var(--neutral-25))",
    )
    expect(tokens["--color-card"]).toBe(
      "light-dark(var(--neutral-25), var(--neutral-100))",
    )
    expect(tokens["--color-popover"]).toBe(
      "light-dark(var(--neutral-25), var(--neutral-100))",
    )
    expect(tokens).not.toHaveProperty("--shadow-popover")
  })

  test("glass turns the popover tier translucent; solid is the default", () => {
    const tokens = tokensFor({ surfaceMaterial: "glass" })
    expect(tokens["--popover-alpha"]).toBe("70%")
    expect(tokens["--popover-backdrop-filter"]).toBe(
      "blur(40px) saturate(150%)",
    )
    expect(tokens).not.toHaveProperty("--color-popover")
    expect(tokens).not.toHaveProperty("--color-card")
  })

  test("tonal steps containers off the page by background alone", () => {
    const tokens = tokensFor({ surfaceStrategy: "tonal" })
    expect(tokens["--card-border"]).toBe("transparent")
    expect(tokens["--color-card"]).toBe(
      "color-mix(in oklab, var(--neutral-50) 65%, var(--neutral-100))",
    )
    expect(tokens["--color-popover"]).toBe(
      "color-mix(in oklab, var(--neutral-50) 30%, var(--neutral-100))",
    )
    expect(tokens["--shadow-popover"]).toBe(
      "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)",
    )
  })

  test("no shadow is Tailwind's transparent shadow, never `none`", () => {
    const tokens = tokensFor({ surfaceStrategy: "tonal", surfaceDepth: "flat" })
    expect(tokens["--shadow-popover"]).toBe(NO_SHADOW)
    expect(tokens["--shadow-modal"]).toBe(NO_SHADOW)
    for (const value of Object.values(tokens)) expect(value).not.toBe("none")
  })
})
