import { describe, expect, test } from "vitest"

import { DEFAULT_STATE, parseState } from "@/modules/studio/axes"
import { designSystemOf } from "@/modules/studio/resolve"

describe("overlays chapters", () => {
  test("the defaults yield the registry defaults and no tokens", () => {
    const ds = designSystemOf(DEFAULT_STATE)
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
    const ds = designSystemOf(
      parseState({ dialogBackdrop: "blur", dialogPosition: "top" }),
    )
    expect(ds.componentParams.modal).toMatchObject({
      backdrop: "blur",
      position: "top",
    })
    expect(ds.componentParams.drawer).toMatchObject({ backdrop: "blur" })
  })

  test("popovers: tip on popover, header on dialog", () => {
    const ds = designSystemOf(
      parseState({ popoverTip: "tip", popoverHeader: "band" }),
    )
    expect(ds.componentParams.popover).toMatchObject({ tip: "tip" })
    expect(ds.componentParams.dialog).toMatchObject({ header: "band" })
  })

  test("tooltips: style on tooltip", () => {
    expect(
      designSystemOf(parseState({ tooltipStyle: "surface" })).componentParams
        .tooltip,
    ).toMatchObject({ style: "surface" })
  })
})
