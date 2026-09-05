import { describe, expect, test } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"
import { syncedAlert, syncedToast } from "./notices"

describe("notices axis", () => {
  test("defaults land on the registry defaults and emit no tokens", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.componentParams.toast).toEqual({
      style: "surface",
      position: "bottom-right",
    })
    expect(ds.componentParams.alert).toEqual({ style: "neutral" })
    expect(ds.tokens).toEqual({})
  })

  test("each key drives its own param", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      noticeToast: "inverted",
      noticeToastPosition: "top-center",
      noticeAlert: "accent-bar",
    })
    expect(ds.componentParams.toast).toEqual({
      style: "inverted",
      position: "top-center",
    })
    expect(ds.componentParams.alert).toEqual({ style: "accent-bar" })
  })

  test("unknown values fall back to the defaults", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, noticeToast: "glass" })
    expect(ds.componentParams.toast?.style).toBe("surface")
  })

  test("sync maps every value to a counterpart in the other vocabulary", () => {
    expect(syncedAlert("filled")).toBe("tinted")
    expect(syncedToast("tinted-border")).toBe("surface")
    expect(syncedAlert("accent-bar")).toBe("accent-bar")
  })
})
