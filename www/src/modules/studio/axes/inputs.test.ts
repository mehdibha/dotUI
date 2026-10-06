import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import inputMeta from "@/registry/ui/input/meta"
import { FIELD_SHELLS } from "@/registry/ui/input/styles"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { DEFAULT_STATE, effective, parseState } from "."
import { designSystemOf } from "../resolve"
import { STYLE_OPTIONS as BUTTON_STYLES } from "./buttons"
import { AUTO_STYLE, STYLE_HOVER, STYLE_OPTIONS } from "./inputs"

const shipped = async (
  name: string,
  componentParams: PublishPreset["componentParams"] = {},
) => {
  const preset: PublishPreset = { density: "default", componentParams }
  const mod = await publishables[name]?.()
  if (!mod) throw new Error(`${name} is not publishable`)
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset: { ...preset, tokens: {} },
  })
  return item.files?.[0]?.content ?? ""
}

/* A class only that shell's recipe ships. */
const SIGNATURE: Record<string, string> = {
  outline: "dark:bg-border-control/30",
  raised: "shadow-xs",
  inset: "shadow-[inset_0_1px_0_0_rgb(31_35_40/0.04)]",
  well: "var(--color-field)) border-border-control bg-field",
  filled: "border-transparent bg-field",
  indicator: "rounded-t-sm border-b",
  underline: "invalid:focus:border-fg-danger",
}

/** Every class list in a shipped file, by slot line. */
const classLists = (content: string) =>
  [...content.matchAll(/"([^"\n]*\s[^"\n]*)"/g)].map((m) => m[1]!.split(" "))

describe("inputs", () => {
  it("Origin resolves to an Outline field over the registry defaults", () => {
    const system = designSystemOf(DEFAULT_STATE)
    expect(system.componentParams.input).toEqual({
      style: "outline",
      hover: "none",
      height: "controls",
      errorIcon: "none",
    })
    expect(system.componentParams.field).toEqual({
      error: "plain",
      label: "regular",
    })
    expect(system.componentParams["number-field"]).toEqual({
      steppers: "right-cells",
    })
    expect(system.componentParams["otp-field"]).toEqual({ cells: "attached" })
    expect(system.componentParams.select).toEqual({
      trigger: "button",
      caret: "chevron",
    })
    expect(system.tokens).toEqual({})
    for (const [name, def] of Object.entries(inputMeta.params))
      expect(system.componentParams.input?.[name], name).toBe(def.default)
  })

  it("Auto pairs the shell with every button style", () => {
    expect(Object.keys(AUTO_STYLE).sort()).toEqual(
      BUTTON_STYLES.map((o) => o.value).sort(),
    )
    for (const [buttonStyle, style] of Object.entries(AUTO_STYLE)) {
      const { values } = effective(parseState({ buttonStyle }))
      expect(values.inputStyle, buttonStyle).toBe(style)
      expect(values.inputHover, buttonStyle).toBe(STYLE_HOVER[style])
    }
  })

  it("As style is total over the shells and overridable", () => {
    expect(Object.keys(STYLE_HOVER).sort()).toEqual(
      STYLE_OPTIONS.map((o) => o.value).sort(),
    )
    const system = designSystemOf(
      parseState({
        inputStyle: "well",
        inputHover: "none",
        inputHeight: "step",
      }),
    )
    expect(system.componentParams.input).toMatchObject({
      style: "well",
      hover: "none",
      height: "step",
    })
    expect(
      designSystemOf(parseState({ inputStyle: "indicator" })).componentParams
        .input?.hover,
    ).toBe("tint")
  })

  it("the error message splits into the field frame and the shell", () => {
    const message = designSystemOf(parseState({ inputError: "icon-message" }))
    expect(message.componentParams.field?.error).toBe("icon-message")
    expect(message.componentParams.input?.errorIcon).toBe("none")
    const inField = designSystemOf(parseState({ inputError: "icon-field" }))
    expect(inField.componentParams.field?.error).toBe("plain")
    expect(inField.componentParams.input?.errorIcon).toBe("inside")
  })

  it("maps members onto their components", () => {
    const system = designSystemOf(
      parseState({
        numberLayout: "stacked-inset",
        otpStyle: "separate",
        selectTrigger: "field",
        pickerCaret: "double",
        fieldLabel: "semibold",
      }),
    )
    expect(system.componentParams["number-field"]?.steppers).toBe(
      "stacked-inset",
    )
    expect(system.componentParams["otp-field"]?.cells).toBe("separate")
    expect(system.componentParams.select).toEqual({
      trigger: "field",
      caret: "double",
    })
    expect(system.componentParams.field?.label).toBe("semibold")
  })
})

describe("field shells", () => {
  it("one recipe per style option, every slot dressed", () => {
    expect(Object.keys(FIELD_SHELLS).sort()).toEqual(
      [...inputMeta.params.style.values].sort(),
    )
    expect(STYLE_OPTIONS.map((o) => o.value).sort()).toEqual(
      [...inputMeta.params.style.values].sort(),
    )
    for (const [style, shell] of Object.entries(FIELD_SHELLS))
      expect(Object.keys(shell.slots).sort(), style).toEqual([
        "input",
        "inputGroup",
        "inputGroupAddon",
        "textArea",
        "trigger",
      ])
  })

  it("each style ships its own recipe, once, with clean classes", async () => {
    for (const style of Object.keys(SIGNATURE)) {
      const content = await shipped("input", { input: { style } })
      for (const [other, signature] of Object.entries(SIGNATURE))
        expect(content.includes(signature), `${style} ships ${other}`).toBe(
          other === style,
        )
      expect(content).not.toContain("--studio-")
      expect(content).not.toContain("shadow-control")
    }
  })

  it("a height ships one token set per size", async () => {
    for (const height of ["controls", "step", "tall"]) {
      const content = await shipped("input", { input: { height } })
      for (const list of classLists(content))
        expect(
          list.filter((c) => c.startsWith("[--input-h:")).length,
          height,
        ).toBeLessThanOrEqual(1)
    }
    const tall = await shipped("input", { input: { height: "tall" } })
    expect(tall).toContain("[--input-h:--spacing(12)]")
    expect(tall).not.toContain("[--input-h:--spacing(8)]")
  })
})

/* Consumers wear the shell through input's live hook — never a copy, never
   the frozen static `inputStyles` (which ignores the design system). */
describe("shell consumers", () => {
  const UI = path.resolve(__dirname, "../../../registry/ui")
  const CONSUMERS = [
    "token-field/base.tsx",
    "questionnaire/base.tsx",
    "number-field/base.right-cells.tsx",
    "number-field/base.stacked-cells.tsx",
    "number-field/base.stacked-inset.tsx",
    "number-field/base.split.tsx",
    "select/base.field.tsx",
  ]
  for (const file of CONSUMERS)
    it(file, () => {
      const source = readFileSync(path.join(UI, file), "utf8")
      expect(source).toContain(
        'import { useStyles as useInputStyles } from "@/registry/ui/input/styles"',
      )
      expect(source).not.toMatch(/\binputStyles\(\)/)
      expect(source).not.toContain("bg-field")
    })

  for (const file of ["token-field/styles.ts", "questionnaire/styles.ts"])
    it(`${file} holds no shell`, () => {
      const source = readFileSync(path.join(UI, file), "utf8")
      expect(source).not.toContain("bg-field")
      expect(source).not.toContain("focus-input")
    })

  it("a style reaches every consumer's shipped shell", async () => {
    const token = await shipped("token-field", { input: { style: "raised" } })
    expect(token).toContain('from "@/components/ui/input"')
    const select = await shipped("select", { select: { trigger: "field" } })
    expect(select).toContain("trigger(")
    expect(select).not.toContain('from "@/components/ui/button"')
  })
})
