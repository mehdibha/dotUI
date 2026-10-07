import { describe, expect, test } from "vitest"

import { DEFAULT_STATE, parseState } from "@/modules/studio/axes"
import { designSystemOf } from "@/modules/studio/resolve"

describe("overlays chapters", () => {
  test("the defaults yield the registry defaults and no tokens", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.tokens).toEqual({})
    expect(ds.componentParams.modal).toMatchObject({
      position: "center",
      mobile: "center",
    })
    expect(ds.componentParams.drawer).toMatchObject({ edge: "docked" })
    expect(ds.componentParams.popover).toMatchObject({ tip: "none" })
    expect(ds.componentParams.tooltip).toMatchObject({ style: "inverted" })
  })

  test("dialogs: position on the modal", () => {
    const ds = designSystemOf(parseState({ dialogPosition: "top" }))
    expect(ds.componentParams.modal).toMatchObject({ position: "top" })
  })

  test("tooltips keep the detail rung when only items go square", () => {
    const detail = { "--studio-tooltip-radius": "var(--studio-radius-detail)" }
    expect(
      designSystemOf(parseState({ roleItem: "none" })).tokens,
    ).toMatchObject(detail)
    for (const state of [{}, { roleItem: "none", roleControl: "none" }])
      expect(designSystemOf(parseState(state)).tokens).not.toHaveProperty(
        "--studio-tooltip-radius",
      )
  })

  test("tooltips: style on tooltip", () => {
    expect(
      designSystemOf(parseState({ tooltipStyle: "surface" })).componentParams
        .tooltip,
    ).toMatchObject({ style: "surface" })
  })
})
