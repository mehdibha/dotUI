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

  it("a control's fill forks it off the selection tokens as a recipe scope", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, switchColor: "accent" })
    expect(ds.tokens).toEqual({})
    expect(ds.color?.scopes).toEqual({ switch: "accent" })
    const split = resolveDesignSystem({
      ...DEFAULTS,
      checkboxColor: "neutral",
      radioColor: "accent",
      switchColor: "accent",
    }).color
    expect(split?.selection).toBe("accent")
    expect(split?.scopes).toEqual({ checkbox: "neutral" })
  })

  it("the checks' majority is the selection source; only the minority forks", () => {
    expect(
      resolveDesignSystem({ ...DEFAULTS, checkboxColor: "neutral" }).color,
    ).toBeUndefined()
    const accentChecks = resolveDesignSystem({
      ...DEFAULTS,
      checkboxColor: "accent",
      radioColor: "accent",
    }).color
    expect(accentChecks?.selection).toBe("accent")
    expect(accentChecks?.scopes).toEqual({ switch: "neutral" })
    // A selection seed paints the selection source; the majority follows
    // it, the minority still forks to its own source.
    const seeded = { ...DEFAULTS, selectionSeed: "#0072f5" }
    expect(resolveDesignSystem(seeded).color?.scopes).toBeUndefined()
    expect(
      resolveDesignSystem({ ...seeded, checkboxColor: "accent" }).color?.scopes,
    ).toEqual({ checkbox: "accent" })
  })

  it("corner rides on the checkbox radius var", () => {
    expect(
      resolveDesignSystem({ ...DEFAULTS, checkCorner: "square" }).tokens,
    ).toEqual({ "--studio-checkbox-radius": "var(--radius-xs)" })
    expect(
      resolveDesignSystem({ ...DEFAULTS, checkCorner: "circle" }).tokens,
    ).toEqual({ "--studio-checkbox-radius": "var(--radius-full)" })
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
