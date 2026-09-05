import { describe, expect, test } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

const SURFACE_TOKENS = [
  "--card-border",
  "--overlay-border",
  "--shadow-card",
  "--shadow-overlay",
  "--color-bg",
  "--color-card",
  "--color-popover",
  "--overlay-backdrop-filter",
]

const tokensFor = (overrides: Partial<typeof DEFAULTS>) =>
  resolveDesignSystem({ ...DEFAULTS, ...overrides }).tokens

describe("surfaces", () => {
  test("defaults emit no surface tokens", () => {
    const tokens = tokensFor({})
    for (const name of SURFACE_TOKENS) expect(tokens).not.toHaveProperty(name)
  })

  test("ring moves the edge into the shadow", () => {
    const tokens = tokensFor({ surfaceEdge: "ring" })
    expect(tokens["--card-border"]).toBe("transparent")
    expect(tokens["--overlay-border"]).toBe("transparent")
    expect(tokens["--shadow-card"]).toBe("0 0 0 1px var(--color-border)")
    expect(tokens["--shadow-overlay"]).toMatch(
      /^0 0 0 1px var\(--color-border\), 0 2px 8px -2px light-dark\(/,
    )
  })

  test("adaptive is shadow-only in light and hairline in dark", () => {
    const tokens = tokensFor({ surfaceStrategy: "adaptive" })
    expect(tokens["--card-border"]).toBe(
      "light-dark(transparent, var(--neutral-200))",
    )
    expect(tokens["--shadow-card"]).toBe(
      "0 1px 2px light-dark(rgb(0 0 0 / 0.05), transparent)",
    )
    expect(tokens["--color-popover"]).toBe(
      "light-dark(var(--neutral-50), var(--neutral-100))",
    )
  })

  test("tinted shadows use the ink in light only", () => {
    const tokens = tokensFor({ surfaceShadow: "tinted" })
    expect(tokens).not.toHaveProperty("--shadow-card")
    expect(tokens["--shadow-overlay"]).toBe(
      "0 2px 8px -2px light-dark(color-mix(in srgb, var(--color-fg) 10%, transparent), rgb(0 0 0 / 0.18))",
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
  })
})
