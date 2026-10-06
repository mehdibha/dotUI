import { describe, expect, it } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"
import { DEFAULT_STATE, parseState } from "@/modules/studio/axes"
import { designSystemOf } from "@/modules/studio/resolve"

describe("inputs chapter group", () => {
  it("defaults resolve to the registry defaults and no tokens", () => {
    const system = designSystemOf(DEFAULT_STATE)
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
    const system = designSystemOf(
      parseState({ inputStyle: "filled", inputHover: "tint" }),
    )
    expect(system.componentParams.input).toMatchObject({
      style: "filled",
      hover: "tint",
    })
  })

  it("folds addon layout and divider into one input param", () => {
    const boxed = designSystemOf(parseState({ addonLayout: "boxed" }))
    expect(boxed.componentParams.input?.addon).toBe("boxed")
    const flush = designSystemOf(
      parseState({ addonLayout: "boxed", addonDivider: "none" }),
    )
    expect(flush.componentParams.input?.addon).toBe("boxed-flush")
    // The divider only exists on a boxed cell.
    const inside = designSystemOf(parseState({ addonDivider: "none" }))
    expect(inside.componentParams.input?.addon).toBe("inside")
  })

  it("maps steppers and cells onto their components", () => {
    const system = designSystemOf(
      parseState({ numberLayout: "stacked", otpStyle: "underline" }),
    )
    expect(system.componentParams["number-field"]?.steppers).toBe("stacked")
    expect(system.componentParams["otp-field"]?.cells).toBe("underline")
  })
})

const shipped = async (name: string, tokens: Record<string, string> = {}) => {
  const preset: PublishPreset = { density: "default", componentParams: {} }
  const mod = await publishables[name]?.()
  if (!mod) throw new Error(`${name} is not publishable`)
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset: { ...preset, tokens: { ...preset.tokens, ...tokens } },
  })
  return item.files?.[0]?.content ?? ""
}

describe("input motion", () => {
  it("ships shadcn's default timing: no duration or ease class", async () => {
    for (const name of ["input", "token-field"]) {
      const content = await shipped(name)
      expect(content).toContain("transition-[box-shadow,border-color,color]")
      expect(content).not.toMatch(/ (duration|ease)-/)
      expect(content).not.toContain("--studio-")
    }
  })

  it("one tweak times every field shell", async () => {
    const { tokens } = designSystemOf(
      parseState({ inputMotion: { duration: 200, ease: [0, 0, 0.2, 1] } }),
    )
    for (const name of ["input", "token-field"])
      expect(await shipped(name, tokens)).toContain(
        "transition-[box-shadow,border-color,color] duration-200 ease-out",
      )
  })
})
