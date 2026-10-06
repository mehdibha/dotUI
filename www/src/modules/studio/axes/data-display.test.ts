import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { CONTAINER_SURFACE } from "@/registry/ui/card/styles"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, DEFAULTS, parseState } from "./index"

const presetOf = (state: Partial<typeof DEFAULTS>): PublishPreset => {
  const ds = designSystemOf(parseState(state))
  return {
    density: ds.density,
    componentParams: ds.componentParams,
    tokens: ds.tokens,
    color: ds.color,
    icons: ds.icons,
  }
}

const shipped = async (name: string, state: Partial<typeof DEFAULTS> = {}) => {
  const preset = presetOf(state)
  const { item } = publish({
    publishable: selectPublishable(await publishables[name]!(), preset),
    preset,
  })
  return item.files?.[0]?.content ?? ""
}

describe("data display axes", () => {
  test("Origin writes every registry default and no token", () => {
    const { componentParams, tokens } = designSystemOf(DEFAULT_STATE)
    expect(tokens).toEqual({})
    expect(componentParams.table).toEqual({
      header: "plain",
      headerLabel: "muted",
    })
    expect(componentParams.accordion).toEqual({
      layout: "divided",
      marker: "trailing-chevron",
      motion: "expand",
    })
    expect(componentParams.avatar).toEqual({
      shape: "circle",
      fallback: "neutral",
    })
    expect(componentParams.kbd).toEqual({ style: "chip" })
    expect(componentParams.card).toMatchObject({ footer: "none" })
  })

  test("each axis lands on its param", () => {
    const { componentParams, tokens } = designSystemOf(
      parseState({
        tableHeader: "filled",
        tableHeaderLabel: "strong",
        accordionContainer: "separated",
        accordionMarker: "leading-caret",
        avatarShape: "rounded",
        avatarFallback: "accent",
        kbdTreatment: "outline",
        cardFooter: "band",
      }),
    )
    expect(tokens).toEqual({})
    expect(componentParams.table).toEqual({
      header: "filled",
      headerLabel: "strong",
    })
    expect(componentParams.accordion).toMatchObject({
      layout: "separated",
      marker: "leading-caret",
    })
    expect(componentParams.avatar).toEqual({
      shape: "rounded",
      fallback: "accent",
    })
    expect(componentParams.kbd).toEqual({ style: "outline" })
    expect(componentParams.card).toMatchObject({ footer: "band" })
  })
})

describe("shipped data display", () => {
  const cases: [string, Partial<typeof DEFAULTS>][] = [
    ["table", { tableHeader: "filled", tableHeaderLabel: "strong" }],
    ["accordion", { accordionContainer: "contained" }],
    ["accordion", { accordionMarker: "leading-caret" }],
    ["avatar", { avatarShape: "rounded", avatarFallback: "accent" }],
    ["kbd", { kbdTreatment: "outline" }],
    ["card", { cardFooter: "rule" }],
  ]

  test.each(cases)("%s %o ships no builder var", async (name, state) => {
    expect(await shipped(name, state)).not.toContain("--studio-")
  })

  /* One source: every container wears the card's surface classes. */
  test.each([
    ["card", {}],
    ["accordion", { accordionContainer: "contained" }],
    ["accordion", { accordionContainer: "separated" }],
    ["attachment", {}],
  ] as const)("%s %o wears the container surface", async (name, state) => {
    const content = await shipped(name, state)
    for (const cls of CONTAINER_SURFACE.split(" "))
      expect(content, cls).toContain(cls)
  })

  test("divided and plain accordions wear no surface", async () => {
    for (const accordionContainer of ["divided", "plain"])
      expect(
        await shipped("accordion", { accordionContainer }),
        accordionContainer,
      ).not.toContain("bg-card")
  })

  test("the leading caret turns a quarter, the trailing chevron flips", async () => {
    const leading = await shipped("accordion", {
      accordionMarker: "leading-caret",
    })
    expect(leading).toContain("ChevronRightIcon")
    expect(leading).toContain("rotate-90")
    expect(leading).not.toContain("rotate-180")
    const trailing = await shipped("accordion")
    expect(trailing).toContain("ChevronDownIcon")
    expect(trailing).not.toContain("rotate-90")
  })

  test("kbd styles ship their own chrome only", async () => {
    const chip = await shipped("kbd")
    expect(chip).toContain("bg-muted")
    expect(chip).not.toContain("border")
    const outline = await shipped("kbd", { kbdTreatment: "outline" })
    expect(outline).toContain("border")
    expect(outline).not.toContain("bg-muted")
    expect(outline).not.toContain("border-b-2")
  })

  test("card footers: a rule, or a rule on a band", async () => {
    expect(await shipped("card")).not.toContain("bg-inverse/5")
    const rule = await shipped("card", { cardFooter: "rule" })
    expect(rule).toContain("border-t")
    expect(rule).not.toContain("bg-inverse/5")
    expect(await shipped("card", { cardFooter: "band" })).toContain(
      "border-t bg-inverse/5",
    )
  })

  test("a rounded avatar rounds per size, a circle never squares", async () => {
    const circle = await shipped("avatar")
    expect(circle).toMatch(/root: "[^"]*rounded-full/)
    const rounded = await shipped("avatar", { avatarShape: "rounded" })
    expect(rounded).not.toMatch(/root: "[^"]*rounded-full/)
    expect(rounded).toContain('root: "size-6 rounded-sm"')
    expect(rounded).toContain('root: "size-10 rounded-md"')
  })

  test("header label ink ships one class", async () => {
    const muted = await shipped("table")
    const strong = await shipped("table", { tableHeaderLabel: "strong" })
    expect(muted).toContain("text-fg-muted")
    expect(strong).not.toMatch(/column: [^\n]*text-fg-muted/)
  })
})
