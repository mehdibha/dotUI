import path from "node:path"
import { describe, expect, it } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { DENSITIES } from "@/registry/types"
import listBoxMeta from "@/registry/ui/list-box/meta"
import menuMeta from "@/registry/ui/menu/meta"
import { extractStylesConfig } from "@/publisher/build-time/extract-config"
import { flatten } from "@/publisher/flatten"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

const UI = path.resolve(__dirname, "../../../registry/ui")

describe("menus axis", () => {
  it("defaults yield the registry defaults and no tokens", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.tokens).toEqual({})
    expect(ds.componentParams.menu).toEqual({
      indicator: "check-end",
      highlight: "neutral",
      inset: "inset",
      selected: "none",
      rows: "auto",
      labels: "sentence",
    })
    expect(ds.componentParams["list-box"]).toEqual(ds.componentParams.menu)
    expect(ds.componentParams.command).toEqual({
      search: "field",
      inset: "inset",
      scale: "default",
    })
    expect(ds.componentParams.popover).toMatchObject({
      tip: "none",
      mobile: "drawer",
    })
    expect(ds.componentParams.tooltip).toMatchObject({
      style: "inverted",
      tip: "tip",
    })
  })

  it("one axis writes the whole family, and no global token", () => {
    const ds = designSystemOf(
      parseState({
        menuIndicator: "check-start",
        menuHighlight: "accent",
        menuInset: "full-bleed",
        menuSelectedRow: "tint",
        menuRows: "step",
        sectionLabels: "caps",
        menuSearch: "prompt",
        menuScale: "large",
        mobilePickers: "anchored",
      }),
    )
    const rows = {
      indicator: "check-start",
      highlight: "accent",
      inset: "full-bleed",
      selected: "tint",
      rows: "step",
      labels: "caps",
    }
    expect(ds.componentParams.menu).toEqual(rows)
    expect(ds.componentParams["list-box"]).toEqual(rows)
    expect(ds.componentParams.command).toEqual({
      search: "prompt",
      inset: "full-bleed",
      scale: "large",
    })
    expect(ds.componentParams.popover?.mobile).toBe("anchored")
    expect(ds.tokens).toEqual({})
  })

  it.each([
    ["tooltips", "none", "tip"],
    ["none", "none", "none"],
    ["popovers", "tip", "none"],
    ["both", "tip", "tip"],
  ])("arrows %s: popover %s, tooltip %s", (menuArrows, popover, tooltip) => {
    const ds = designSystemOf(parseState({ menuArrows }))
    expect(ds.componentParams.popover?.tip).toBe(popover)
    expect(ds.componentParams.tooltip?.tip).toBe(tooltip)
  })

  it("a tinted selected row steps the neutral highlight back", () => {
    const faded = {
      "--studio-list-box-highlight":
        "color-mix(in oklab, var(--color-highlight) 60%, transparent)",
    }
    expect(
      designSystemOf(parseState({ menuSelectedRow: "tint" })).tokens,
    ).toEqual(faded)
    expect(
      designSystemOf(
        parseState({ menuSelectedRow: "tint", menuHighlight: "accent" }),
      ).tokens,
    ).toEqual({})
    expect(
      designSystemOf(parseState({ menuHighlight: "accent" })).tokens,
    ).toEqual({})
  })

  it("check None pins a tinted selected row", () => {
    const ds = designSystemOf(parseState({ menuIndicator: "none" }))
    expect(ds.componentParams.menu).toMatchObject({
      indicator: "none",
      selected: "tint",
    })
  })
})

describe("list rows", () => {
  it.each([
    // [rows, ...DENSITIES]: the row height in Tailwind units.
    ["auto", "min-h-7", undefined, undefined, undefined, undefined],
    ["match", "min-h-7", "min-h-8", "min-h-9", "min-h-10", "min-h-12"],
    ["step", "min-h-8", "min-h-9", "min-h-10", "min-h-12", "min-h-14"],
  ] as const)("%s rows ship one height per density", async (rows, ...want) => {
    const { publishable } = await publishables["list-box"]!()
    for (const [i, density] of DENSITIES.entries()) {
      const flat = flatten({
        stylesConfig: publishable.stylesConfig,
        meta: publishable.meta,
        density,
        paramSelections: { rows },
      })
      const heights = [flat.slots?.item]
        .flat(Infinity as 1)
        .join(" ")
        .split(/\s+/)
        .filter((c) => c.startsWith("min-h-"))
      expect(heights, `${rows} ${density}`).toEqual(want[i] ? [want[i]] : [])
    }
  })

  it("menu ships list-box's recipe and params, unchanged", () => {
    expect(menuMeta.params).toBe(listBoxMeta.params)
    const menu = extractStylesConfig(path.join(UI, "menu/styles.ts"))
    const listBox = extractStylesConfig(path.join(UI, "list-box/styles.ts"))
    expect(menu).toEqual(listBox)
  })
})
