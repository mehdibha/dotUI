import { describe, expect, it } from "vitest"

import { DEFAULT_STATE, parseState } from "."
import { designSystemOf } from "../resolve"

describe("display chapters (badges, kbd, avatars)", () => {
  it("defaults resolve to the registry defaults and no tokens", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.tokens).toEqual({})
    expect(ds.componentParams.badge).toEqual({ style: "solid" })
    expect(ds.componentParams["tag-group"]).toEqual({ style: "solid" })
    expect(ds.componentParams.kbd).toEqual({ treatment: "chip" })
    expect(ds.componentParams.avatar).toEqual({ fallback: "neutral" })
  })

  it("badge style writes badge and tag-group together", () => {
    const ds = designSystemOf(parseState({ badgeStyle: "soft-outline" }))
    expect(ds.componentParams.badge?.style).toBe("soft-outline")
    expect(ds.componentParams["tag-group"]?.style).toBe("soft-outline")
  })

  it("badge shape re-points the badge and tag radius vars", () => {
    const ds = designSystemOf(parseState({ badgeShape: "rounded" }))
    expect(ds.tokens).toEqual({
      "--studio-badge-radius": "var(--radius-sm)",
      "--studio-tag-radius": "var(--radius-sm)",
    })
  })

  it("kbd treatment lands on the kbd param", () => {
    const ds = designSystemOf(parseState({ kbdTreatment: "keycap" }))
    expect(ds.componentParams.kbd).toEqual({ treatment: "keycap" })
  })

  it("avatar shape and fallback land on the var and the param", () => {
    const ds = designSystemOf(
      parseState({ avatarShape: "rounded", avatarFallback: "tinted" }),
    )
    expect(ds.tokens).toEqual({ "--studio-avatar-radius": "var(--radius-lg)" })
    expect(ds.componentParams.avatar).toEqual({ fallback: "tinted" })
  })
})

describe("accordion, breadcrumbs and pagination params", () => {
  it("defaults land on the registry defaults", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.componentParams.accordion).toMatchObject({
      container: "divided",
      marker: "chevron",
      markerPosition: "trailing",
    })
    expect(ds.componentParams.pagination).toEqual({ current: "secondary" })
  })

  it("each axis writes its param", () => {
    const ds = designSystemOf(
      parseState({
        accordionContainer: "cards",
        accordionMarker: "plus",
        accordionMarkerPosition: "leading",
        breadcrumbSeparator: "slash",
        paginationCurrent: "primary",
      }),
    )
    expect(ds.componentParams.accordion).toMatchObject({
      container: "cards",
      marker: "plus",
      markerPosition: "leading",
    })
    expect(ds.componentParams.breadcrumbs?.separator).toBe("slash")
    expect(ds.componentParams.pagination).toEqual({ current: "primary" })
  })
})
