import { describe, expect, it } from "vitest"

import { DEFAULT_STATE, parseState } from "@/modules/studio/axes"
import { resolveDesignSystem } from "@/modules/studio/resolve"

describe("inputs chapter group", () => {
  it("defaults resolve to the registry defaults and no tokens", () => {
    const system = resolveDesignSystem(DEFAULT_STATE)
    expect(system.componentParams.input).toEqual({
      style: "outline",
      hover: "none",
      addon: "inside",
    })
    expect(system.componentParams["number-field"]).toEqual({
      steppers: "right",
    })
    expect(system.componentParams["otp-field"]).toEqual({ cells: "group" })
    expect(system.tokens).toEqual({})
  })

  it("maps the field style and hover onto input", () => {
    const system = resolveDesignSystem(
      parseState({ inputStyle: "filled", inputHover: "tint" }),
    )
    expect(system.componentParams.input).toMatchObject({
      style: "filled",
      hover: "tint",
    })
  })

  it("folds addon layout and divider into one input param", () => {
    const boxed = resolveDesignSystem(parseState({ addonLayout: "boxed" }))
    expect(boxed.componentParams.input?.addon).toBe("boxed")
    const flush = resolveDesignSystem(
      parseState({ addonLayout: "boxed", addonDivider: "none" }),
    )
    expect(flush.componentParams.input?.addon).toBe("boxed-flush")
    // The divider only exists on a boxed cell.
    const inside = resolveDesignSystem(parseState({ addonDivider: "none" }))
    expect(inside.componentParams.input?.addon).toBe("inside")
  })

  it("maps steppers and cells onto their components", () => {
    const system = resolveDesignSystem(
      parseState({ numberLayout: "stacked", otpStyle: "underline" }),
    )
    expect(system.componentParams["number-field"]?.steppers).toBe("stacked")
    expect(system.componentParams["otp-field"]?.cells).toBe("underline")
  })
})
