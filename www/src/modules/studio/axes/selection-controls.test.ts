import { cn } from "tailwind-variants"
import { describe, expect, it } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { DEFAULT_COLOR_CONFIG } from "@/registry/theme"
import type { Density } from "@/registry/types"
import { mergePresetCssFields } from "@/publisher/emit-theme"
import { flatten } from "@/publisher/flatten"
import { publish, selectPublishable } from "@/publisher/publish"
import type { ClassValue } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import { SELECTED_OPTIONS } from "./choice-cards.meta"
import { STRONG_EDGE } from "./color"
import { DEFAULT_STATE, parseState } from "./index"
import { MARK_OPTIONS } from "./radio.meta"
import { STYLE_OPTIONS } from "./switch.meta"

const DENSITIES: Density[] = ["compact", "default", "comfortable"]
const CARDS = ["checkbox", "radio-group", "switch"]

const classes = (value: ClassValue | undefined): string =>
  [value]
    .flat(Infinity as 1)
    .filter(Boolean)
    .join(" ")

/** Every slot and size/orientation variant of one item, flattened. */
async function layer(
  name: string,
  density: Density,
  paramSelections: Record<string, string>,
) {
  const mod = await publishables[name]?.()
  if (!mod) throw new Error(`${name} is not publishable`)
  const { stylesConfig, meta } = mod.publishable
  return flatten({ stylesConfig, meta, density, paramSelections })
}

/** Each slot, alone and merged with each variant value it can wear. */
async function slotStrings(
  name: string,
  density: Density,
  paramSelections: Record<string, string>,
) {
  const flat = await layer(name, density, paramSelections)
  const out: [string, string][] = []
  for (const [slot, value] of Object.entries(flat.slots ?? {})) {
    out.push([slot, classes(value)])
    for (const [variant, values] of Object.entries(flat.variants ?? {}))
      for (const [option, slots] of Object.entries(values ?? {})) {
        const extra =
          typeof slots === "object" && !Array.isArray(slots)
            ? (slots as Record<string, ClassValue>)[slot]
            : undefined
        if (extra)
          out.push([
            `${slot}.${variant}=${option}`,
            `${classes(value)} ${classes(extra)}`,
          ])
      }
  }
  return out
}

const expectNoConflicts = (value: string, where: string) =>
  expect(cn(value)?.split(" ").sort(), where).toEqual(value.split(" ").sort())

describe("selection controls", () => {
  it("Origin resolves token-free onto the registry defaults", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.tokens).toEqual({})
    expect(ds.color?.scopes).toBeUndefined()
    expect(ds.componentParams.checkbox).toEqual({ "card-selected": "tint" })
    expect(ds.componentParams["radio-group"]).toEqual({
      mark: "dot",
      "card-selected": "tint",
    })
    expect(ds.componentParams.switch).toEqual({
      style: "inset",
      "card-selected": "tint",
    })
    expect(ds.componentParams.slider).toEqual({ thumb: "knob", track: "thin" })
  })

  it("a control's fill forks it off the selection tokens as a recipe scope", () => {
    const ds = designSystemOf(parseState({ switchColor: "neutral" }))
    expect(ds.tokens).toEqual({})
    expect(ds.color?.scopes).toEqual({ switch: "neutral" })
    expect(
      designSystemOf(
        parseState({
          checkboxColor: "accent",
          radioColor: "neutral",
          switchColor: "neutral",
        }),
      ).color?.scopes,
    ).toEqual({ radio: "neutral", switch: "neutral" })
  })

  it("a fill matching the selection source is no fork", () => {
    expect(
      designSystemOf(parseState({ checkboxColor: "accent" })).color,
    ).toEqual(DEFAULT_COLOR_CONFIG)
    const neutralChecks = designSystemOf(
      parseState({ selectionColor: "neutral", checkboxColor: "neutral" }),
    ).color
    expect(neutralChecks?.selection).toBe("neutral")
    expect(neutralChecks?.scopes).toEqual({
      radio: "accent",
      switch: "accent",
      slider: "accent",
    })
    // A selection seed paints the selection leaf; a check on that leaf
    // follows it, a check off it still forks to its own source.
    const seeded = parseState({ selectionSeed: "#0072f5" })
    expect(designSystemOf(seeded).color?.scopes).toEqual({ slider: "accent" })
    expect(
      designSystemOf({ ...seeded, checkboxColor: "neutral" }).color?.scopes,
    ).toMatchObject({ checkbox: "neutral", slider: "accent" })
  })

  it("the slider fill keeps its own source under a selection seed", () => {
    // It painted with the buttons before; the scope keeps that look.
    expect(
      designSystemOf(parseState({ sliderColor: "neutral" })).color?.scopes,
    ).toEqual({ slider: "neutral" })
    expect(
      designSystemOf(
        parseState({ selectionColor: "neutral", sliderColor: "neutral" }),
      ).color?.scopes,
    ).toEqual({
      radio: "accent",
      switch: "accent",
      checkbox: "accent",
      calendar: "accent",
      "range-calendar": "accent",
      "time-picker-columns": "accent",
    })
  })

  it("Sharp is a fixed 2px; Auto writes nothing", () => {
    expect(designSystemOf(parseState({ checkCorner: "sharp" })).tokens).toEqual(
      { "--studio-checkbox-radius": "2px" },
    )
    expect(designSystemOf(parseState({ checkCorner: "auto" })).tokens).toEqual(
      {},
    )
  })

  it("Strong check edge is Color's Strong edge; Same as fields writes nothing", () => {
    expect(designSystemOf(parseState({ checkEdge: "strong" })).tokens).toEqual({
      "--check-edge": STRONG_EDGE,
      "--studio-check-edge": "var(--check-edge)",
    })
    expect(designSystemOf(parseState({ checkEdge: "fields" })).tokens).toEqual(
      {},
    )
  })

  it("Strong check edge ships its token as a literal", () => {
    const preset = designSystemOf(parseState({ checkEdge: "strong" }))
    const { css } = mergePresetCssFields({}, preset)
    expect(css?.[":root"]).toMatchObject({
      "--check-edge": expect.stringMatching(/^oklch\(/),
    })
  })

  it.each(["checkbox", "radio-group"])(
    "%s ships the field edge at Origin and the strong edge under Strong",
    async (name) => {
      const shipped = async (raw: Record<string, unknown>) => {
        const preset = designSystemOf(parseState(raw))
        const { item } = publish({
          publishable: selectPublishable(await publishables[name]!(), preset),
          preset,
        })
        return (item.files ?? []).map((f) => f.content).join("\n")
      }
      const origin = await shipped({})
      expect(origin).toMatch(/ border-border-control /)
      expect(origin).not.toMatch(/--studio-/)
      const strong = await shipped({ checkEdge: "strong" })
      expect(strong).toMatch(/ border-\(--check-edge\) /)
      expect(strong).not.toMatch(/--studio-|--neutral-/)
    },
  )

  it("radio mark and switch style land as their item's params", () => {
    const ds = designSystemOf(
      parseState({ radioMark: "ring", switchStyle: "slab" }),
    )
    expect(ds.componentParams["radio-group"]?.mark).toBe("ring")
    expect(ds.componentParams.switch?.style).toBe("slab")
  })

  it("one Selected value reaches all three cards", () => {
    const ds = designSystemOf(parseState({ cardSelected: "outline" }))
    for (const name of CARDS)
      expect(ds.componentParams[name]?.["card-selected"], name).toBe("outline")
  })

  it("the three cards ship one recipe", async () => {
    const recipes = await Promise.all(
      CARDS.map(async (name) => {
        const mod = await publishables[name]?.()
        return mod?.publishable.stylesConfig.params?.["card-selected"]
      }),
    )
    for (const recipe of recipes) expect(recipe).toEqual(recipes[0])
    expect(Object.keys(recipes[0] ?? {})).toEqual(
      SELECTED_OPTIONS.map((option) => option.value),
    )
  })

  // `dark:` outranks `disabled:` in the cascade, so a dark paint must opt out
  // of disabled wherever the slot also paints that property when disabled.
  it("no dark rule repaints a disabled control", async () => {
    const utility = (cls: string) => (cls.split(":").at(-1) ?? "").split("-")[0]
    const cases: [string, Record<string, string>][] = [
      ...STYLE_OPTIONS.map(({ value }): [string, Record<string, string>] => [
        "switch",
        { style: value },
      ]),
      ...MARK_OPTIONS.map(({ value }): [string, Record<string, string>] => [
        "radio-group",
        { mark: value },
      ]),
      ["checkbox", {}],
      ...["knob", "ring", "solid", "handle"].map(
        (thumb): [string, Record<string, string>] => ["slider", { thumb }],
      ),
    ]
    const dark: string[] = []
    const offenders: string[] = []
    for (const [name, params] of cases)
      for (const [slot, value] of await slotStrings(name, "default", params)) {
        const list = value.split(" ")
        const disabled = new Set(
          list.filter((c) => c.split(":").includes("disabled")).map(utility),
        )
        for (const cls of list.filter((c) => c.split(":").includes("dark"))) {
          dark.push(cls)
          if (disabled.has(utility(cls)) && !cls.includes("not-disabled:"))
            offenders.push(`${name} ${JSON.stringify(params)} ${slot}: ${cls}`)
        }
      }
    expect(dark).not.toEqual([])
    expect(offenders).toEqual([])
  })

  it("no option ships two conflicting classes", async () => {
    const cases: [string, Record<string, string>][] = [
      ...MARK_OPTIONS.map(({ value }): [string, Record<string, string>] => [
        "radio-group",
        { mark: value },
      ]),
      ...STYLE_OPTIONS.map(({ value }): [string, Record<string, string>] => [
        "switch",
        { style: value },
      ]),
      ...SELECTED_OPTIONS.map(({ value }): [string, Record<string, string>] => [
        "checkbox",
        { "card-selected": value },
      ]),
    ]
    for (const thumb of ["knob", "ring", "solid", "handle"])
      for (const track of ["hairline", "thin", "medium", "thick"])
        cases.push(["slider", { thumb, track }])
    for (const [name, params] of cases)
      for (const density of DENSITIES)
        for (const [slot, value] of await slotStrings(name, density, params))
          expectNoConflicts(
            value,
            `${name} ${JSON.stringify(params)} ${density} ${slot}`,
          )
  })
})
