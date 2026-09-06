import { describe, expect, test } from "vitest"

import { DEFAULTS } from "."
import { resolveDesignSystem } from "../resolve"

const motionTokens = (tokens: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(tokens).filter(
      ([name]) =>
        name.startsWith("--ease-") || name.includes("transition-duration"),
    ),
  )

describe("motion axis", () => {
  test("defaults write no tokens and the scale entrance", () => {
    const system = resolveDesignSystem(DEFAULTS)
    expect(motionTokens(system.tokens)).toEqual({})
    for (const component of ["popover", "tooltip", "modal"])
      expect(system.componentParams[component]?.motion).toBe("scale")
  })

  test("character re-points the curve and both durations", () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      motionCharacter: "emphasized",
    })
    expect(motionTokens(tokens)).toEqual({
      "--ease-enter": "cubic-bezier(0.05, 0.7, 0.1, 1)",
      "--transition-duration-enter": "280ms",
      "--transition-duration-exit": "200ms",
    })
  })

  test("speed scales every duration, state alone the default one", () => {
    expect(
      motionTokens(
        resolveDesignSystem({ ...DEFAULTS, motionSpeed: "relaxed" }).tokens,
      ),
    ).toEqual({
      "--transition-duration-enter": "280ms",
      "--transition-duration-exit": "210ms",
      "--default-transition-duration": "210ms",
    })
    expect(
      motionTokens(
        resolveDesignSystem({ ...DEFAULTS, motionState: "instant" }).tokens,
      ),
    ).toEqual({ "--default-transition-duration": "0ms" })
  })

  test("overlays write the synced motion param", () => {
    const system = resolveDesignSystem({ ...DEFAULTS, motionOverlay: "fade" })
    for (const component of ["popover", "tooltip", "modal"])
      expect(system.componentParams[component]?.motion).toBe("fade")
    expect(motionTokens(system.tokens)).toEqual({})
  })
})
