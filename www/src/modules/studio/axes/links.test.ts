import { describe, expect, it } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

describe("links axis", () => {
  it("defaults to the registry's look: accent, no underline", () => {
    const system = resolveDesignSystem(DEFAULTS)
    expect(system.componentParams.link).toEqual({
      underline: "never",
      color: "accent",
    })
    expect(system.tokens).toEqual({})
  })

  it("maps both axes onto the link params", () => {
    const system = resolveDesignSystem({
      ...DEFAULTS,
      linkUnderline: "hover",
      linkColor: "foreground",
    })
    expect(system.componentParams.link).toEqual({
      underline: "hover",
      color: "foreground",
    })
  })

  it("falls back to the defaults on unknown values", () => {
    const system = resolveDesignSystem({
      ...DEFAULTS,
      linkUnderline: "sometimes",
      linkColor: "pink",
    })
    expect(system.componentParams.link).toEqual({
      underline: "never",
      color: "accent",
    })
  })
})
