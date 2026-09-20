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
    const ds = resolveDesignSystem({ ...DEFAULTS, switchFill: "accent" })
    expect(ds.tokens).toEqual({})
    expect(ds.color?.scopes).toEqual({ switch: "accent" })
    expect(
      resolveDesignSystem({
        ...DEFAULTS,
        checkboxFill: "neutral",
        radioFill: "accent",
        switchFill: "accent",
      }).color?.scopes,
    ).toEqual({ radio: "accent", switch: "accent" })
  })

  it("a fill matching the selection source is no fork", () => {
    expect(
      resolveDesignSystem({ ...DEFAULTS, checkboxFill: "neutral" }).color,
    ).toBeUndefined()
    expect(
      resolveDesignSystem({
        ...DEFAULTS,
        selectionFill: "accent",
        checkboxFill: "accent",
      }).color?.scopes,
    ).toBeUndefined()
    // Under a selection seed the source is the seed's ramp, so both fork.
    expect(
      resolveDesignSystem({
        ...DEFAULTS,
        selectionSeed: "#0072f5",
        checkboxFill: "neutral",
      }).color?.scopes,
    ).toEqual({ checkbox: "neutral" })
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
