import { describe, expect, it } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

const CARD_DEFAULTS = { "card-selected": "outline", "card-control": "start" }

describe("selection controls", () => {
  it("defaults resolve to no tokens and the registry's card params", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.tokens).toEqual({})
    for (const component of ["checkbox", "radio-group", "switch"]) {
      expect(ds.componentParams[component]).toEqual(CARD_DEFAULTS)
    }
  })

  it("accent fill re-points the selection trio at the accent tokens", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, checkFill: "accent" })
    expect(ds.tokens).toEqual({
      "--color-selection": "var(--color-accent)",
      "--color-selection-hover": "var(--color-accent-hover)",
      "--color-fg-on-selection": "var(--color-fg-on-accent)",
    })
  })

  it("corner rides on the checkbox radius var", () => {
    expect(
      resolveDesignSystem({ ...DEFAULTS, checkCorner: "square" }).tokens,
    ).toEqual({ "--checkbox-radius": "var(--radius-xs)" })
    expect(
      resolveDesignSystem({ ...DEFAULTS, checkCorner: "circle" }).tokens,
    ).toEqual({ "--checkbox-radius": "var(--radius-full)" })
  })

  it("choice cards write the synced card params on all three controls", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      cardSelected: "tint",
      cardControl: "hidden",
    })
    for (const component of ["checkbox", "radio-group", "switch"]) {
      expect(ds.componentParams[component]).toEqual({
        "card-selected": "tint",
        "card-control": "hidden",
      })
    }
  })
})
