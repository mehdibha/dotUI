import { describe, expect, it } from "vitest"

import { DEFAULTS } from "."
import { resolveDesignSystem } from "../resolve"

describe("mobile axis", () => {
  it("defaults resolve to the registry defaults and no tokens", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.componentParams.popover?.mobile).toBe("drawer")
    expect(ds.componentParams.modal?.mobile).toBe("center")
    expect(ds.tokens).toEqual({})
  })

  it("pickers and dialogs map to the popover and modal params", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      mobilePickers: "popover",
      mobileDialogs: "sheet",
    })
    expect(ds.componentParams.popover?.mobile).toBe("popover")
    expect(ds.componentParams.modal?.mobile).toBe("sheet")
  })

  it("off renders the same everywhere, whatever the rows say", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      mobileAdapt: false,
      mobileDialogs: "sheet",
    })
    expect(ds.componentParams.popover?.mobile).toBe("popover")
    expect(ds.componentParams.modal?.mobile).toBe("center")
  })
})
