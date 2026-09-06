import { describe, expect, it } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

describe("selection controls", () => {
  it("defaults resolve to no tokens and the registry's card params", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.tokens).toEqual({})
    for (const component of ["checkbox", "radio-group"]) {
      expect(ds.componentParams[component]).toEqual({
        "card-selected": "tint",
        "card-control": "start",
      })
    }
    expect(ds.componentParams.switch).toEqual({ "card-selected": "tint" })
  })

  it("accent fill re-points the selection tokens at the accent ones", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, checkFill: "accent" })
    expect(ds.tokens).toEqual({
      "--color-selection": "var(--color-accent)",
      "--color-selection-hover": "var(--color-accent-hover)",
      "--color-selection-muted": "var(--color-accent-muted)",
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
      cardSelected: "outline",
      cardControl: "hidden",
    })
    for (const component of ["checkbox", "radio-group"]) {
      expect(ds.componentParams[component]).toEqual({
        "card-selected": "outline",
        "card-control": "hidden",
      })
    }
    // The switch card always trails its control; only Selected reaches it.
    expect(ds.componentParams.switch).toEqual({ "card-selected": "outline" })
  })
})
