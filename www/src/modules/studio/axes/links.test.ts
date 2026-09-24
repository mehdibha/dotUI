import { describe, expect, it } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("links axis", () => {
  it("defaults to the registry's look: accent, no underline", () => {
    const system = resolveDesignSystem(DEFAULT_STATE)
    expect(system.componentParams.link).toEqual({
      underline: "never",
      color: "accent",
    })
    expect(system.tokens).toEqual({})
  })

  it("maps both axes onto the link params", () => {
    const system = resolveDesignSystem(
      parseState({ linkUnderline: "hover", linkColor: "neutral" }),
    )
    expect(system.componentParams.link).toEqual({
      underline: "hover",
      color: "neutral",
    })
  })
})
