import { describe, expect, it } from "vitest"

import { DEFAULT_STATE, parseState } from "."
import { designSystemOf } from "../resolve"

describe("mobile axis", () => {
  it("defaults resolve to the registry defaults and no tokens", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.componentParams.modal?.mobile).toBe("center")
    expect(ds.tokens).toEqual({})
  })

  it("dialogs map to the modal param", () => {
    const ds = designSystemOf(parseState({ mobileDialogs: "sheet" }))
    expect(ds.componentParams.modal?.mobile).toBe("sheet")
  })
})
