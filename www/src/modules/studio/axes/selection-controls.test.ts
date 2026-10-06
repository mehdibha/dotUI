import { describe, expect, it } from "vitest"

import { DEFAULT_COLOR_CONFIG } from "@/registry/theme"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("selection controls", () => {
  it("defaults resolve to no tokens and the registry's card params", () => {
    const ds = designSystemOf(DEFAULT_STATE)
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
    const ds = designSystemOf(parseState({ switchColor: "neutral" }))
    expect(ds.tokens).toEqual({})
    expect(ds.color?.scopes).toEqual({ switch: "neutral" })
    expect(
      designSystemOf(
        parseState({
          checkboxColor: "accent",
          radioColor: "neutral",
          switchColor: "neutral",
        }),
      ).color?.scopes,
    ).toEqual({ radio: "neutral", switch: "neutral" })
  })

  it("a fill matching the selection source is no fork", () => {
    expect(
      designSystemOf(parseState({ checkboxColor: "accent" })).color,
    ).toEqual(DEFAULT_COLOR_CONFIG)
    const neutralChecks = designSystemOf(
      parseState({ selectionColor: "neutral", checkboxColor: "neutral" }),
    ).color
    expect(neutralChecks?.selection).toBe("neutral")
    expect(neutralChecks?.scopes).toEqual({
      radio: "accent",
      switch: "accent",
    })
    // A selection seed paints the selection leaf; a control on that leaf
    // follows it, a control off it still forks to its own source.
    const seeded = parseState({ selectionSeed: "#0072f5" })
    expect(designSystemOf(seeded).color?.scopes).toBeUndefined()
    expect(
      designSystemOf({ ...seeded, checkboxColor: "neutral" }).color?.scopes,
    ).toEqual({ checkbox: "neutral" })
  })

  it("corner rides on the checkbox radius var", () => {
    expect(
      designSystemOf(parseState({ checkCorner: "square" })).tokens,
    ).toEqual({ "--studio-checkbox-radius": "var(--radius-xs)" })
    expect(
      designSystemOf(parseState({ checkCorner: "circle" })).tokens,
    ).toEqual({ "--studio-checkbox-radius": "var(--radius-full)" })
  })

  it("choice cards write the synced card params on all three controls", () => {
    const ds = designSystemOf(
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
