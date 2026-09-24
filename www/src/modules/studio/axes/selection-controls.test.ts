import { describe, expect, it } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("selection controls", () => {
  it("defaults resolve to no tokens and the registry's card params", () => {
    const ds = resolveDesignSystem(DEFAULT_STATE)
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
    const ds = resolveDesignSystem(parseState({ switchColor: "accent" }))
    expect(ds.tokens).toEqual({})
    expect(ds.color?.scopes).toEqual({ switch: "accent" })
    expect(
      resolveDesignSystem(
        parseState({
          checkboxColor: "neutral",
          radioColor: "accent",
          switchColor: "accent",
        }),
      ).color?.scopes,
    ).toEqual({ radio: "accent", switch: "accent" })
  })

  it("a fill matching the selection source is no fork", () => {
    expect(
      resolveDesignSystem(parseState({ checkboxColor: "neutral" })).color,
    ).toBeUndefined()
    const accentChecks = resolveDesignSystem(
      parseState({ selectionColor: "accent", checkboxColor: "accent" }),
    ).color
    expect(accentChecks?.selection).toBe("accent")
    expect(accentChecks?.scopes).toEqual({
      radio: "neutral",
      switch: "neutral",
    })
    // A selection seed paints the selection leaf; a control on that leaf
    // follows it, a control off it still forks to its own source.
    const seeded = parseState({ selectionSeed: "#0072f5" })
    expect(resolveDesignSystem(seeded).color?.scopes).toBeUndefined()
    expect(
      resolveDesignSystem({ ...seeded, checkboxColor: "accent" }).color?.scopes,
    ).toEqual({ checkbox: "accent" })
  })

  it("corner rides on the checkbox radius var", () => {
    expect(
      resolveDesignSystem(parseState({ checkCorner: "square" })).tokens,
    ).toEqual({ "--studio-checkbox-radius": "var(--radius-xs)" })
    expect(
      resolveDesignSystem(parseState({ checkCorner: "circle" })).tokens,
    ).toEqual({ "--studio-checkbox-radius": "var(--radius-full)" })
  })

  it("choice cards write the synced card params on all three controls", () => {
    const ds = resolveDesignSystem(
      parseState({ cardSelected: "outline", cardControl: "hidden" }),
    )
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
