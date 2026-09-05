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
  "--overlay-backdrop-filter",
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
    const palette = { step: (s: string) => s, hairline: "", ink: "" }
    const plain = (pair: PerMode<SurfaceColor>) =>
      surfaceColorCss(pair.light, palette)
    expect(shadowCss(card.shadow, plain)).toBe(NO_SHADOW)
    expect(shadowCss(popover.shadow, plain)).toBe(SHADOW_MD)
    expect(shadowCss(modal.shadow, plain)).toBe(SHADOW_LG)
  })

  test("a secondary axis changes only the shadow's character, not its size", () => {
    const tokens = tokensFor({ surfaceShadow: "tinted" })
    expect(tokens).not.toHaveProperty("--shadow-card")
    // The tint reads in light only; dark keeps the registry's black.
    const ink =
      "light-dark(color-mix(in srgb, var(--color-fg) 13%, transparent), rgb(0 0 0 / 0.1))"
    expect(tokens["--shadow-popover"]).toBe(
      `0 4px 6px -1px ${ink}, 0 2px 4px -2px ${ink}`,
    )
    expect(tokens["--shadow-modal"]).toBe(
      `0 10px 15px -3px ${ink}, 0 4px 6px -4px ${ink}`,
    )
  })

  test("layered adds an ambient layer under the rung", () => {
    const tokens = tokensFor({ surfaceShadow: "layered" })
    expect(tokens["--shadow-popover"]).toBe(
      `${SHADOW_MD}, 0 8px 24px 4px rgb(0 0 0 / 0.05)`,
    )
  })

  test("ring moves the edge into the shadow", () => {
    const tokens = tokensFor({ surfaceEdge: "ring" })
    expect(tokens["--card-border"]).toBe("transparent")
    expect(tokens["--overlay-border"]).toBe("transparent")
    expect(tokens["--shadow-card"]).toBe("0 0 0 1px var(--color-border)")
    expect(tokens["--shadow-popover"]).toBe(
      `0 0 0 1px var(--color-border), ${SHADOW_MD}`,
    )
    expect(tokens["--shadow-modal"]).toBe(
      `0 0 0 1px var(--color-border), ${SHADOW_LG}`,
    )
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

  test("adaptive is shadow-only in light and hairline in dark", () => {
    const tokens = tokensFor({ surfaceStrategy: "adaptive" })
    expect(tokens["--card-border"]).toBe(
      "light-dark(transparent, var(--neutral-200))",
    )
    expect(tokens["--shadow-card"]).toBe(
      "0 1px 3px 0 light-dark(rgb(0 0 0 / 0.1), transparent), 0 1px 2px -1px light-dark(rgb(0 0 0 / 0.1), transparent)",
    )
    expect(tokens["--color-popover"]).toBe(
      "light-dark(var(--neutral-50), var(--neutral-100))",
    )
  })

  test("shadow casts harder in dark", () => {
    const tokens = tokensFor({ surfaceStrategy: "shadow" })
    expect(tokens["--card-border"]).toBe("transparent")
    expect(tokens["--shadow-card"]).toBe(
      "0 4px 6px -1px light-dark(rgb(0 0 0 / 0.12), rgb(0 0 0 / 0.264)), 0 2px 4px -2px light-dark(rgb(0 0 0 / 0.12), rgb(0 0 0 / 0.264))",
    )
  })

  test("tinted canvas lifts cards in light and elevates them in dark", () => {
    const tokens = tokensFor({ surfaceCanvas: "tinted" })
    expect(tokens["--color-bg"]).toBe(
      "light-dark(var(--neutral-50), var(--neutral-25))",
    )
    expect(tokens["--color-card"]).toBe(
      "light-dark(var(--neutral-25), color-mix(in oklab, var(--neutral-50) 50%, var(--neutral-100)))",
    )
    expect(tokens["--color-popover"]).toBe(
      "light-dark(var(--neutral-25), var(--neutral-100))",
    )
    expect(tokens).not.toHaveProperty("--shadow-popover")
  })

  test("glass makes floating surfaces translucent over a blur", () => {
    const tokens = tokensFor({ surfaceMaterial: "glass" })
    expect(tokens["--overlay-backdrop-filter"]).toBe("blur(8px)")
    expect(tokens["--color-popover"]).toBe(
      "color-mix(in srgb, light-dark(var(--neutral-50), color-mix(in oklab, var(--neutral-50) 50%, var(--neutral-100))) 72%, transparent)",
    )
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
