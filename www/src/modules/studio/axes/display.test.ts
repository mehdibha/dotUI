import { describe, expect, it } from "vitest"

import { DEFAULT_STATE, parseState } from "."
import { designSystemOf } from "../resolve"

describe("display chapters (badges)", () => {
  it("defaults resolve to the registry defaults and no tokens", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.tokens).toEqual({})
    expect(ds.componentParams.badge).toEqual({ style: "solid" })
    expect(ds.componentParams["tag-group"]).toEqual({ style: "solid" })
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
})
