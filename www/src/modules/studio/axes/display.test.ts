import { describe, expect, it } from "vitest"

import { DEFAULT_STATE, parseState } from "."
import { resolveDesignSystem } from "../resolve"

describe("display chapters (badges, kbd, avatars)", () => {
  it("defaults resolve to the registry defaults and no tokens", () => {
    const ds = resolveDesignSystem(DEFAULT_STATE)
    expect(ds.tokens).toEqual({})
    expect(ds.componentParams.badge).toEqual({ style: "solid" })
    expect(ds.componentParams["tag-group"]).toEqual({ style: "solid" })
    expect(ds.componentParams.kbd).toEqual({ treatment: "chip" })
    expect(ds.componentParams.avatar).toEqual({ fallback: "neutral" })
  })

  it("badge style writes badge and tag-group together", () => {
    const ds = resolveDesignSystem(parseState({ badgeStyle: "soft-outline" }))
    expect(ds.componentParams.badge?.style).toBe("soft-outline")
    expect(ds.componentParams["tag-group"]?.style).toBe("soft-outline")
  })

  it("badge shape re-points the badge and tag radius vars", () => {
    const ds = resolveDesignSystem(parseState({ badgeShape: "rounded" }))
    expect(ds.tokens).toEqual({
      "--studio-badge-radius": "var(--radius-sm)",
      "--studio-tag-radius": "var(--radius-sm)",
    })
  })

  it("kbd treatment lands on the kbd param", () => {
    const ds = resolveDesignSystem(parseState({ kbdTreatment: "keycap" }))
    expect(ds.componentParams.kbd).toEqual({ treatment: "keycap" })
  })

  it("avatar shape and fallback land on the var and the param", () => {
    const ds = resolveDesignSystem(
      parseState({ avatarShape: "rounded", avatarFallback: "tinted" }),
    )
    expect(ds.tokens).toEqual({ "--studio-avatar-radius": "var(--radius-lg)" })
    expect(ds.componentParams.avatar).toEqual({ fallback: "tinted" })
  })
})
