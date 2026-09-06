import { describe, expect, test } from "vitest"

import { DEFAULTS } from "@/modules/studio/axes"
import { resolveDesignSystem } from "@/modules/studio/resolve"

describe("overlays chapters", () => {
  test("the defaults yield the registry defaults and no tokens", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.tokens).toEqual({})
    expect(ds.componentParams.modal).toMatchObject({
      backdrop: "dim",
      position: "center",
    })
    expect(ds.componentParams.drawer).toMatchObject({ backdrop: "dim" })
    expect(ds.componentParams.popover).toMatchObject({ tip: "none" })
    expect(ds.componentParams.dialog).toMatchObject({ header: "title" })
    expect(ds.componentParams.tooltip).toMatchObject({ style: "inverted" })
  })

  test("dialogs: backdrop writes modal and drawer together, position the modal", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      dialogBackdrop: "blur",
      dialogPosition: "top",
    })
    expect(ds.componentParams.modal).toMatchObject({
      backdrop: "blur",
      position: "top",
    })
    expect(ds.componentParams.drawer).toMatchObject({ backdrop: "blur" })
  })

  test("popovers: tip on popover, header on dialog", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      popoverTip: "tip",
      popoverHeader: "band",
    })
    expect(ds.componentParams.popover).toMatchObject({ tip: "tip" })
    expect(ds.componentParams.dialog).toMatchObject({ header: "band" })
  })

  test("tooltips: style on tooltip; unknown values fall back", () => {
    expect(
      resolveDesignSystem({ ...DEFAULTS, tooltipStyle: "surface" })
        .componentParams.tooltip,
    ).toMatchObject({ style: "surface" })
    expect(
      resolveDesignSystem({ ...DEFAULTS, tooltipStyle: "translucid" })
        .componentParams.tooltip,
    ).toMatchObject({ style: "inverted" })
  })
})
