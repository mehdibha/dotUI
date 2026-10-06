import { describe, expect, it } from "vitest"

import { DEFAULT_STATE, parseState } from "."
import { designSystemOf } from "../resolve"

describe("display chapters (kbd, avatars)", () => {
  it("defaults resolve to the registry defaults and no tokens", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.tokens).toEqual({})
    expect(ds.componentParams.kbd).toEqual({ treatment: "chip" })
    expect(ds.componentParams.avatar).toEqual({ fallback: "neutral" })
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
