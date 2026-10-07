import { readFileSync } from "node:fs"
import path from "node:path"
import { compile } from "@tailwindcss/node"
import { describe, expect, it } from "vitest"

import { baseRegistryCss } from "@/registry/__generated__/base-css"
import { publishables } from "@/registry/__generated__/publishables"
import inputMeta from "@/registry/ui/input/meta"
import { FIELD_SHELLS, inputStyles } from "@/registry/ui/input/styles"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { DEFAULT_STATE, effective, parseState } from "."
import { designSystemOf } from "../resolve"
import { STYLE_OPTIONS as BUTTON_STYLES } from "./buttons.meta"
import { STRONG_EDGE } from "./color"
import { AUTO_STYLE, STYLE_HOVER } from "./inputs"
import { STYLE_OPTIONS } from "./inputs.meta"

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
  underline: "focus:focus-input-underline",
}

/** The class tokens of a shell slot. */
const shellClasses = (value: unknown): string[] =>
  [value].flat(Infinity).join(" ").split(/\s+/).filter(Boolean)

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
      text: "same",
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
        "chip",
        "divider",
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

  /* The inner control wears its shell too; inside a group it must shed every
     fill and shadow, including the state and dark ones that out-specify a
     plain descendant reset (Outline's dark tint stacked twice). */
  it("a group strips every fill and shadow its inner control wears", () => {
    const strip = String(inputStyles().inputGroup())
    const stateFills = new Set<string>()
    for (const shell of Object.values(FIELD_SHELLS))
      for (const c of shellClasses(shell.slots.input))
        if (
          c.includes(":") &&
          /(^|:)(bg-(?!size|position|no-repeat|\[linear)|shadow|focus-input)/.test(
            c,
          )
        )
          stateFills.add(c)
    expect([...stateFills]).toContain("dark:bg-border-control/30")
    for (const reset of [
      "**:data-input-control:bg-transparent!",
      "**:data-input-control:shadow-none!",
      "**:data-input-control:ring-0!",
    ])
      expect(strip).toContain(reset)
  })

  it("only shells with side edges divide their parts", async () => {
    const edgeless = ["filled", "indicator", "underline"]
    for (const [style, shell] of Object.entries(FIELD_SHELLS)) {
      expect(shell.slots.divider, style).toBe(
        edgeless.includes(style)
          ? "border-transparent"
          : "border-border-control",
      )
      expect("variants" in shell, `${style} cell addon`).toBe(
        !edgeless.includes(style),
      )
    }
    for (const steppers of ["right-cells", "stacked-cells", "split"]) {
      const content = await shipped("number-field", {
        "number-field": { steppers },
      })
      // Dividers take the shell's color; right cells (Carbon) have none.
      expect(content, steppers).not.toContain("border-border-control")
      if (steppers === "right-cells")
        expect(content).not.toMatch(/\bborder-[lrtb]\b/)
      else expect(content, steppers).toContain("divider({")
    }
  })

  /* React Aria marks the Select invalid, not its trigger; the field build
     forwards it so the shell's own invalid edge applies. */
  it("an invalid Field select wears the shell's danger edge", async () => {
    const select = await shipped("select", { select: { trigger: "field" } })
    expect(select).toContain("use(SelectPrimitives.SelectStateContext)")
    expect(select).toMatch(/data-invalid=\{isInvalid \|\| undefined\}/)
    for (const style of Object.keys(SIGNATURE)) {
      const content = await shipped("input", { input: { style } })
      const trigger = /\btrigger: "([^"]*)"/.exec(content)?.[1]
      expect(trigger, style).toContain("invalid:border-fg-danger")
    }
  })

  /* Carbon, Material 3, Untitled UI: the icon rides the invalid fill's own
     background-image, so no second background class fights it. */
  it("an in-field error icon layers over the invalid fill", async () => {
    for (const style of Object.keys(SIGNATURE)) {
      const content = await shipped("input", {
        input: { style, errorIcon: "inside" },
      })
      expect(content, style).toContain("invalid:[--invalid-icon:")
      expect(content, style).not.toContain("invalid:bg-[")
    }
    expect(JSON.stringify(baseRegistryCss)).toContain(
      "var(--invalid-icon, none)",
    )
  })

  /* Supabase: 34px select buttons beside 34px fields. */
  it("a Button select trigger takes the field height past the controls", async () => {
    const select = await shipped("select")
    expect(select).toContain("buttonTrigger({")
    const origin = await shipped("input")
    expect(/\bbuttonTrigger: "([^"]*)"/.exec(origin)?.[1]).toBe("")
    for (const height of ["step", "tall"]) {
      const content = await shipped("input", { input: { height } })
      const size = (slot: string) =>
        [...content.matchAll(new RegExp(`\\b${slot}: "([^"]*)"`, "g"))]
          .map((m) => /\[--input-h:[^\]]*\]/.exec(m[1]!)?.[0])
          .filter(Boolean)
      expect(size("buttonTrigger"), height).toEqual(size("trigger"))
      expect(size("buttonTrigger"), height).toHaveLength(3)
      expect(content).toContain('h-(--input-h)",')
    }
  })

  /* Hover rules out-specify focus ones, so each must exclude the focus its
     slot shows. RAC's focus-within only marks groups: on a bare input it
     never matches, and hover beat the focus edge. */
  it("hover yields to the focus each slot shows", async () => {
    const tw = await compile(
      `@import "tailwindcss/utilities"; @plugin "tailwindcss-react-aria-components";
       @theme { --color-border-focus: #00f; --color-border-control-hover: #888; --color-neutral-hover: #eee; }`,
      { base: path.resolve(__dirname, "../../.."), onDependency() {} },
    )
    // RAC attributes a compiled rule requires, and those it excludes.
    const states = (css: string) => {
      const required = new Set<string>()
      const excluded = new Set<string>()
      for (const m of css.matchAll(
        /(:not\(\*:is\()?:where\(\[data-rac\]\)\[data-([a-z-]+)\]/g,
      ))
        (m[1] ? excluded : required).add(m[2]!)
      // Focus on a descendant or an ancestor's (a group's control) marks
      // the group focus-within.
      if (/:has\(| \*/.test(css))
        return { required: new Set(["focus-within"]), excluded }
      return { required, excluded }
    }
    const rule = (cls: string) => {
      const css = tw.build([cls])
      const name = `.${cls.replace(/[^\w-]/g, (c) => `\\${c}`)} {`
      const start = css.indexOf(name)
      return css.slice(start, css.indexOf("\n}\n", start))
    }
    for (const style of Object.keys(SIGNATURE))
      for (const hover of ["edge", "tint", "edge-tint"]) {
        const content = await shipped("input", { input: { style, hover } })
        for (const slot of ["input", "textArea", "inputGroup", "trigger"]) {
          const classes = [
            ...content.matchAll(new RegExp(`\\b${slot}: "([^"]*)"`, "g")),
          ].flatMap((m) => m[1]!.split(" "))
          const focus = classes.filter((c) =>
            /border-\(--focus-input-border\)$/.test(c),
          )
          const hovers = classes.filter((c) => c.startsWith("hover:"))
          expect(focus.length, `${style} ${slot}`).toBeGreaterThan(0)
          expect(hovers.length, `${style}/${hover} ${slot}`).toBeGreaterThan(0)
          const shown = new Set(
            focus.flatMap((c) => [...states(rule(c)).required]),
          )
          shown.delete("invalid")
          expect(shown.size, `${style} ${slot} focus`).toBeGreaterThan(0)
          for (const h of hovers)
            for (const state of shown)
              expect(
                states(rule(h)).excluded.has(state),
                `${style}/${hover} ${slot}: ${h} ignores ${state}`,
              ).toBe(true)
        }
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

  /* Every look class any shell ships. A consumer that re-copies one (an
     Outline fork in token-field, say) defeats Inputs › Style, since its
     className merges over the hook's slot. */
  const SHELL_LOOK = new Set(
    Object.values(FIELD_SHELLS)
      .flatMap((shell) =>
        ["input", "textArea", "inputGroup", "trigger"].flatMap((slot) =>
          shellClasses(shell.slots[slot as keyof typeof shell.slots]),
        ),
      )
      .filter((c) =>
        /(^|:)(border|bg-|rounded|shadow|ring|px-|py-|focus-input)/.test(c),
      ),
  )
  const looksIn = (classes: string) =>
    classes.split(/\s+/).filter((c) => SHELL_LOOK.has(c))

  for (const file of CONSUMERS)
    it(`${file} copies no shell class`, () => {
      const source = readFileSync(path.join(UI, file), "utf8")
      const strings = [...source.matchAll(/"([^"\n]*)"/g)].map((m) => m[1]!)
      expect(strings.flatMap(looksIn)).toEqual([])
    })

  for (const file of ["token-field/styles.ts", "questionnaire/styles.ts"])
    it(`${file} adds no shell to the slot that wears one`, () => {
      const source = readFileSync(path.join(UI, file), "utf8")
      const slot = /\binput:\s*"([^"]*)"/.exec(source)?.[1]
      expect(slot).toBeDefined()
      expect(looksIn(slot!)).toEqual([])
      expect(slot).not.toMatch(
        /(^|\s)(bg-|rounded|shadow-|px-|py-|border(-[a-z]+)?(\s|$))/,
      )
    })

  it("no consumer ships a shell of its own", async () => {
    const consumers: [string, PublishPreset["componentParams"]][] = [
      ["token-field", {}],
      ["questionnaire", {}],
      ["select", { select: { trigger: "field" } }],
      ...["right-cells", "stacked-cells", "stacked-inset", "split"].map(
        (steppers) =>
          ["number-field", { "number-field": { steppers } }] as [
            string,
            PublishPreset["componentParams"],
          ],
      ),
    ]
    for (const style of Object.keys(SIGNATURE))
      for (const [name, params] of consumers) {
        const content = await shipped(name, { ...params, input: { style } })
        for (const [other, signature] of Object.entries(SIGNATURE))
          expect(
            content.includes(signature),
            `${name} @${style}: ${other}`,
          ).toBe(false)
      }
  })

  it("a style reaches every consumer's shipped shell", async () => {
    const token = await shipped("token-field", { input: { style: "raised" } })
    expect(token).toContain('from "@/components/ui/input"')
    const select = await shipped("select", { select: { trigger: "field" } })
    expect(select).toContain("trigger(")
    expect(select).not.toContain('from "@/components/ui/button"')
  })
})

describe("indicator edge", () => {
  it("takes Color's Strong edge unless the control edge is already Strong", () => {
    for (const controlEdge of ["soft", "firm"])
      expect(
        designSystemOf(parseState({ inputStyle: "indicator", controlEdge }))
          .tokens,
        controlEdge,
      ).toMatchObject({
        "--indicator-edge": STRONG_EDGE,
        "--studio-indicator-edge": "var(--indicator-edge)",
      })
    const strong = designSystemOf(
      parseState({ inputStyle: "indicator", controlEdge: "strong" }),
    ).tokens
    expect(strong).not.toHaveProperty("--indicator-edge")
    expect(designSystemOf(parseState({})).tokens).toEqual({})
  })

  it("ships the control edge at Strong and the floor token otherwise", async () => {
    const at = async (raw: Record<string, unknown>) => {
      const preset = designSystemOf(parseState(raw))
      const mod = await publishables.input!()
      const { item } = publish({
        publishable: selectPublishable(mod, preset),
        preset,
      })
      return item.files?.[0]?.content ?? ""
    }
    const firm = await at({ inputStyle: "indicator" })
    expect(firm).toMatch(/ border-\(--indicator-edge\) /)
    expect(firm).not.toMatch(/--studio-|--neutral-/)
    const strong = await at({ inputStyle: "indicator", controlEdge: "strong" })
    expect(strong).toMatch(/ border-border-control /)
    expect(strong).not.toMatch(/--indicator-edge/)
  })
})
