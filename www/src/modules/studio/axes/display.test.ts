import { describe, expect, it } from "vitest"

import { DEFAULTS } from "."
import { resolveDesignSystem } from "../resolve"

describe("display chapters (badges, kbd, avatars)", () => {
  it("defaults resolve to the registry defaults and no tokens", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.tokens).toEqual({})
    expect(ds.componentParams.badge).toEqual({ style: "solid" })
    expect(ds.componentParams["tag-group"]).toEqual({ style: "solid" })
    expect(ds.componentParams.kbd).toEqual({ treatment: "chip" })
    expect(ds.componentParams.avatar).toEqual({ fallback: "neutral" })
  })

  it("badge style writes badge and tag-group together", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, badgeStyle: "soft-outline" })
    expect(ds.componentParams.badge?.style).toBe("soft-outline")
    expect(ds.componentParams["tag-group"]?.style).toBe("soft-outline")
  })

  it("badge shape re-points the badge and tag radius vars", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, badgeShape: "rounded" })
    expect(ds.tokens).toEqual({
      "--badge-radius": "var(--radius-sm)",
      "--tag-radius": "var(--radius-sm)",
    })
  })

  it("kbd treatment lands on the kbd param", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, kbdTreatment: "keycap" })
    expect(ds.componentParams.kbd).toEqual({ treatment: "keycap" })
  })

  it("avatar shape and fallback land on the var and the param", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      avatarShape: "rounded",
      avatarFallback: "tinted",
    })
    expect(ds.tokens).toEqual({ "--avatar-radius": "var(--radius-lg)" })
    expect(ds.componentParams.avatar).toEqual({ fallback: "tinted" })
  })

  it("unknown values fall back to the defaults", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      badgeStyle: "neon",
      kbdTreatment: "glow",
      avatarFallback: "rainbow",
    })
    expect(ds.componentParams.badge?.style).toBe("solid")
    expect(ds.componentParams.kbd?.treatment).toBe("chip")
    expect(ds.componentParams.avatar?.fallback).toBe("neutral")
  })
})
