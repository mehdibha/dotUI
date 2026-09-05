import { describe, expect, it } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

describe("menus axis", () => {
  it("defaults yield the registry defaults and no tokens", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.tokens).toEqual({})
    expect(ds.componentParams.menu).toEqual({
      indicator: "check-end",
      highlight: "neutral",
      inset: "inset",
      labels: "sentence",
    })
    expect(ds.componentParams["list-box"]).toEqual(ds.componentParams.menu)
    expect(ds.componentParams.command).toEqual({
      search: "field",
      scale: "default",
    })
  })

  it("one axis writes the whole family", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      menuIndicator: "check-start",
      menuHighlight: "accent",
      menuInset: "full-bleed",
      menuLabels: "caps",
      menuSearch: "prompt",
      menuScale: "large",
    })
    const list = {
      indicator: "check-start",
      highlight: "accent",
      inset: "full-bleed",
      labels: "caps",
    }
    expect(ds.componentParams.menu).toEqual(list)
    expect(ds.componentParams["list-box"]).toEqual(list)
    expect(ds.componentParams.command).toEqual({
      search: "prompt",
      scale: "large",
    })
    expect(ds.tokens).toEqual({
      "--color-highlight": "var(--accent-700)",
      "--color-fg-on-highlight": "var(--on-accent-700)",
    })
  })

  it("unknown values fall back to the defaults", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, menuHighlight: "edge" })
    expect(ds.componentParams.menu?.highlight).toBe("neutral")
    expect(ds.tokens).toEqual({})
  })
})
