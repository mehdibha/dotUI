import path from "node:path"
import { describe, expect, it } from "vitest"

import listBoxMeta from "@/registry/ui/list-box/meta"
import menuMeta from "@/registry/ui/menu/meta"
import { extractStylesConfig } from "@/publisher/build-time/extract-config"

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

  it("check None pins a tinted selected row", () => {
    const ds = designSystemOf(parseState({ menuIndicator: "none" }))
    expect(ds.componentParams.menu).toMatchObject({
      indicator: "none",
      selected: "tint",
    })
  })
})

describe("list rows", () => {
  it("menu ships list-box's recipe and params, unchanged", () => {
    expect(menuMeta.params).toBe(listBoxMeta.params)
    const menu = extractStylesConfig(path.join(UI, "menu/styles.ts"))
    const listBox = extractStylesConfig(path.join(UI, "list-box/styles.ts"))
    expect(menu).toEqual(listBox)
  })
})
