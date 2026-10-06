import { describe, expect, it } from "vitest"

import { DEFAULT_STATE, parseState } from "."
import { designSystemOf } from "../resolve"

describe("mobile axis", () => {
  it("defaults resolve to the registry defaults and no tokens", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.componentParams.popover?.mobile).toBe("drawer")
    expect(ds.tokens).toEqual({})
  })

  it("pickers map to the popover param", () => {
    const ds = designSystemOf(parseState({ mobilePickers: "popover" }))
    expect(ds.componentParams.popover?.mobile).toBe("popover")
  })
})
