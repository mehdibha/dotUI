import { cn } from "tailwind-variants"
import { describe, expect, it } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { DEFAULT_COLOR_CONFIG } from "@/registry/theme"
import type { Density } from "@/registry/types"
import { flatten } from "@/publisher/flatten"
import type { ClassValue } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import { SELECTED_OPTIONS } from "./choice-cards"
import { DEFAULT_STATE, parseState } from "./index"
import { MARK_OPTIONS } from "./radio"
import { STYLE_OPTIONS } from "./switch"

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
    ).toEqual({ checkbox: "neutral", slider: "accent" })
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
    ).toEqual({ radio: "accent", switch: "accent", checkbox: "accent" })
  })

  it("Sharp is a fixed 2px; Auto writes nothing", () => {
    expect(designSystemOf(parseState({ checkCorner: "sharp" })).tokens).toEqual(
      { "--studio-checkbox-radius": "2px" },
    )
    expect(designSystemOf(parseState({ checkCorner: "auto" })).tokens).toEqual(
      {},
    )
  })

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
