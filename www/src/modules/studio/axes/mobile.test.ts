import { describe, expect, it } from "vitest"

import { DEFAULT_STATE, KEY_OWNER, parseState } from "."
import { designSystemOf } from "../resolve"

describe("mobile axes", () => {
  it("live in Menus and Dialogs", () => {
    expect(KEY_OWNER.mobilePickers).toBe("menus")
    expect(KEY_OWNER.mobileDialogs).toBe("dialogs")
  })

  it("defaults resolve to the registry defaults", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.componentParams.popover?.mobile).toBe("drawer")
    expect(ds.componentParams.modal?.mobile).toBe("center")
  })

  it("map to the popover and modal params", () => {
    const ds = designSystemOf(
      parseState({ mobilePickers: "anchored", mobileDialogs: "sheet" }),
    )
    expect(ds.componentParams.popover?.mobile).toBe("anchored")
    expect(ds.componentParams.modal?.mobile).toBe("sheet")
  })
})
