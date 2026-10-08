import path from "node:path"
import { describe, expect, it } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { DENSITIES } from "@/registry/types"
import { BUTTON_SECONDARY } from "@/registry/ui/button/styles"
import listBoxMeta from "@/registry/ui/list-box/meta"
import menuMeta from "@/registry/ui/menu/meta"
import { extractStylesConfig } from "@/publisher/build-time/extract-config"
import { flatten } from "@/publisher/flatten"
import { publish, selectPublishable } from "@/publisher/publish"

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

  it("a neutral tint sits under the highlight", () => {
    const ladder = {
      "--studio-list-box-selected":
        "color-mix(in oklab, var(--color-highlight) 50%, transparent)",
      "--studio-list-box-selected-highlight": "var(--color-selected)",
    }
    expect(
      designSystemOf(parseState({ menuSelectedRow: "tint" })).tokens,
    ).toEqual(ladder)
    expect(
      designSystemOf(
        parseState({ menuSelectedRow: "tint", menuHighlight: "accent" }),
      ).tokens,
    ).toEqual({})
    expect(
      designSystemOf(parseState({ menuHighlight: "accent" })).tokens,
    ).toEqual({})
    expect(
      designSystemOf(
        parseState({ menuSelectedRow: "tint", selectedWash: "brand" }),
      ).tokens,
    ).not.toHaveProperty("--studio-list-box-selected")
  })

  it("the tip grows with a heavier overlay stroke", () => {
    const tip = (input: Record<string, unknown>) =>
      designSystemOf(parseState(input)).tokens["--studio-popover-tip-size"]
    expect(tip({})).toBeUndefined()
    expect(tip({ controlStroke: "bold" })).toBeUndefined()
    expect(tip({ surfaceEdge: "ledge", controlStroke: "bold" })).toBe(
      "calc(var(--spacing) * 3.5)",
    )
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

  it("a floating list sizes its popover to its rows, within the viewport", async () => {
    const shipped = async (name: string) => {
      const { density, componentParams, tokens, color, icons } =
        designSystemOf(DEFAULT_STATE)
      const preset = { density, componentParams, tokens, color, icons }
      const { item } = publish({
        publishable: selectPublishable(await publishables[name]!(), preset),
        preset,
      })
      return item.files?.[0]?.content ?? ""
    }
    const list = await shipped("list-box")
    for (const cls of [
      "in-data-trigger:whitespace-nowrap",
      "in-data-trigger:min-w-[calc(max(var(--trigger-width,0px),--spacing(32))-2*1px)]",
      "in-data-trigger:max-w-[calc(100vw-2rem)]",
      "in-data-trigger:min-w-0 in-data-trigger:overflow-x-clip in-data-trigger:text-ellipsis",
      "whitespace-normal text-fg-muted",
    ])
      expect(list).toContain(cls)
    // Rows outside a popover still wrap.
    expect(list).not.toMatch(/[\s"]whitespace-nowrap/)
    expect(await shipped("popover")).toContain(
      "has-[[role=menu],[role=listbox]]:min-w-min",
    )
  })

  it("match and step rows hold their height under any text size", async () => {
    const { publishable } = await publishables["list-box"]!()
    for (const rows of ["match", "step"])
      for (const density of DENSITIES) {
        const flat = flatten({
          stylesConfig: publishable.stylesConfig,
          meta: publishable.meta,
          density,
          paramSelections: { rows },
        })
        expect([flat.slots?.item].flat(Infinity as 1).join(" ")).toContain(
          "not-has-[[slot=description]]:py-0",
        )
      }
  })

  it("a leading check takes the icon column", async () => {
    const { publishable } = await publishables["list-box"]!()
    const ICON: Record<string, string> = { compact: "3.5", touch: "5" }
    for (const density of DENSITIES) {
      const flat = flatten({
        stylesConfig: publishable.stylesConfig,
        meta: publishable.meta,
        density,
        paramSelections: { indicator: "check-start" },
      })
      const item = [flat.slots?.item].flat(Infinity as 1).join(" ")
      const indicator = [flat.slots?.indicator].flat(Infinity as 1).join(" ")
      const icon = ICON[density] ?? "4"
      expect(item, density).toContain(`**:[svg]:not-with-[size]:size-${icon}`)
      expect(indicator.split(" "), density).toContain(`w-${icon}`)
      expect(indicator.split(" "), density).not.toContain("absolute")
      expect(item.split(" "), density).not.toContain("data-selection-mode:pl-8")
    }
  })

  it("popover and surface tooltip share one stroked tip", () => {
    const popover = extractStylesConfig(path.join(UI, "popover/styles.ts"))
    const tooltip = extractStylesConfig(path.join(UI, "tooltip/styles.ts"))
    const tip = [popover.base?.slots?.arrow].flat(Infinity as 1)[0]
    expect(tip).toContain("[&>svg]:size-(--studio-popover-tip-size)")
    expect(tooltip.params?.style?.surface?.slots?.arrow).toBe(tip)
  })

  it("menu ships list-box's recipe and params, unchanged", () => {
    expect(menuMeta.params).toBe(listBoxMeta.params)
    const menu = extractStylesConfig(path.join(UI, "menu/styles.ts"))
    const listBox = extractStylesConfig(path.join(UI, "list-box/styles.ts"))
    expect(menu).toEqual(listBox)
  })
})

describe("triggers and keys", () => {
  const shipped = async (name: string, input: Record<string, unknown> = {}) => {
    const { density, componentParams, tokens, color, icons } = designSystemOf(
      parseState(input),
    )
    const preset = { density, componentParams, tokens, color, icons }
    const { item } = publish({
      publishable: selectPublishable(await publishables[name]!(), preset),
      preset,
    })
    return item.files?.map((f) => f.content).join("\n") ?? ""
  }

  it("an open secondary trigger keeps its rest plate", () => {
    for (const [style, recipe] of Object.entries(BUTTON_SECONDARY)) {
      const classes = recipe.variants.variant.secondary.split(" ")
      for (const cls of classes.filter((c) => c.includes("pressed:")))
        expect(cls, style).toMatch(/(^|:)pressed:not-aria-expanded:/)
    }
  })

  it("a select value keeps the field's weight", async () => {
    expect(await shipped("select")).toContain(
      "flex-1 truncate text-left font-normal",
    )
  })

  it("a key draws the control stroke", async () => {
    const at = (controlStroke: string) =>
      shipped("kbd", { kbdTreatment: "outline", controlStroke })
    expect(await at("regular")).toContain("border px-1")
    expect(await at("bold")).toContain("border-2 px-1")
  })

  it("the tip ships at its size", async () => {
    expect(await shipped("popover")).toContain("[&>svg]:size-2.5")
    expect(
      await shipped("popover", {
        surfaceEdge: "ledge",
        controlStroke: "bold",
        menuArrows: "both",
      }),
    ).toContain("[&>svg]:size-3.5")
  })
})
