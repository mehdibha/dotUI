import { describe, expect, it } from "vitest"

import { shareDesignSystem } from "./share-design-system"
import type { DesignSystem } from "./types"

const system = (): DesignSystem => ({
  componentParams: {
    button: { variant: "solid", size: "md" },
    badge: { tone: "soft" },
  },
  tokens: { "--radius": "0.5rem", "--font-sans": "Inter" },
  density: "default",
  color: { v: 2, seeds: { accent: "#635bff" }, background: { dark: 2 } },
  icons: "lucide",
})

describe("shareDesignSystem", () => {
  it("returns prev for an equal system", () => {
    const prev = system()
    expect(shareDesignSystem(prev, structuredClone(prev))).toBe(prev)
  })

  it("reuses params and color across a token change", () => {
    const prev = system()
    const next = structuredClone(prev)
    next.tokens["--radius"] = "1rem"
    const shared = shareDesignSystem(prev, next)
    expect(shared).not.toBe(prev)
    expect(shared.componentParams).toBe(prev.componentParams)
    expect(shared.color).toBe(prev.color)
    expect(shared.tokens).toEqual(next.tokens)
  })

  it("reuses unchanged components when one changes", () => {
    const prev = system()
    const next = structuredClone(prev)
    next.componentParams.button = { variant: "solid", size: "lg" }
    const shared = shareDesignSystem(prev, next)
    expect(shared.componentParams).not.toBe(prev.componentParams)
    expect(shared.componentParams.badge).toBe(prev.componentParams.badge)
    expect(shared.componentParams.button).toBe(next.componentParams.button)
    expect(shared.tokens).toBe(prev.tokens)
  })

  it("keeps a new params map when the components differ", () => {
    const prev = system()
    const removed = structuredClone(prev)
    delete removed.componentParams.badge
    expect(shareDesignSystem(prev, removed).componentParams).toEqual({
      button: prev.componentParams.button,
    })
    const added = structuredClone(prev)
    added.componentParams.card = {}
    const shared = shareDesignSystem(prev, added).componentParams
    expect(shared).not.toBe(prev.componentParams)
    expect(shared.button).toBe(prev.componentParams.button)
    expect(shared.card).toEqual({})
  })

  it("compares color by content, whatever its key order", () => {
    const prev = system()
    const reordered = structuredClone(prev)
    reordered.color = {
      background: { dark: 2 },
      seeds: { accent: "#635bff" },
      v: 2,
    }
    expect(shareDesignSystem(prev, reordered)).toBe(prev)
    const recolored = structuredClone(prev)
    recolored.color = {
      v: 2,
      seeds: { accent: "#ff0000" },
      background: { dark: 2 },
    }
    const shared = shareDesignSystem(prev, recolored)
    expect(shared.color).toEqual(recolored.color)
    expect(shared.componentParams).toBe(prev.componentParams)
    expect(shared.tokens).toBe(prev.tokens)
  })

  it("tells a shrunk token set from an equal one", () => {
    const prev = system()
    const next = structuredClone(prev)
    delete next.tokens["--font-sans"]
    expect(shareDesignSystem(prev, next).tokens).toEqual({
      "--radius": "0.5rem",
    })
  })

  it("passes density and icons through", () => {
    const prev = system()
    const next = { ...structuredClone(prev), density: "compact" as const }
    const shared = shareDesignSystem(prev, next)
    expect(shared.density).toBe("compact")
    expect(shared.componentParams).toBe(prev.componentParams)
    const iconless = { ...structuredClone(prev), icons: undefined }
    expect(shareDesignSystem(prev, iconless).icons).toBeUndefined()
  })
})
