import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { CONTAINER_SURFACE } from "@/registry/ui/card/styles"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, DEFAULTS, parseState } from "./index"

/* The surface as Origin ships it: the 1px card stroke is `border`. */
const SHIPPED_SURFACE = CONTAINER_SURFACE.replace(
  "border-(length:--studio-card-stroke)",
  "border",
)

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
    ["card", { cardHeader: "band" }],
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
    for (const cls of SHIPPED_SURFACE.split(" "))
      expect(content, cls).toContain(cls)
  })

  test("the header mirrors the footer: a rule, or a band to the top edge", async () => {
    expect(await shipped("card")).not.toMatch(/header: "[^"]*border-b /)
    expect(await shipped("card", { cardHeader: "rule" })).toMatch(
      /header: "[^"]*\bborder-b\b/,
    )
    const band = await shipped("card", { cardHeader: "band" })
    expect(band).toMatch(/header: "[^"]*\bbg-inverse\/5\b/)
    expect(band).toContain("has-data-card-header:pt-0")
  })

  test("the boxed color editor wears the container surface", async () => {
    const base = presetOf({})
    const preset = {
      ...base,
      componentParams: {
        ...base.componentParams,
        "color-editor": { style: "hammamet" },
      },
    }
    const { item } = publish({
      publishable: selectPublishable(
        await publishables["color-editor"]!(),
        preset,
      ),
      preset,
    })
    const content = item.files?.[0]?.content ?? ""
    for (const cls of SHIPPED_SURFACE.split(" "))
      expect(content, cls).toContain(cls)
  })

  test("boxed accordions draw the ring inside the trigger; divided keeps it outside", async () => {
    for (const accordionContainer of ["contained", "separated"])
      expect(
        await shipped("accordion", { accordionContainer }),
        accordionContainer,
      ).toContain("[--focus-ring-inset:inset]")
    expect(await shipped("accordion")).not.toContain("--focus-ring-inset")
  })

  test("only the contained accordion fills the open item", async () => {
    expect(
      await shipped("accordion", { accordionContainer: "contained" }),
    ).toContain("expanded:bg-muted/50")
    for (const accordionContainer of ["divided", "separated", "plain"])
      expect(
        await shipped("accordion", { accordionContainer }),
        accordionContainer,
      ).not.toContain("expanded:bg")
  })

  test("striped rows ship behind the striped prop", async () => {
    const content = await shipped("table")
    expect(content).toContain("in-data-striped:odd:bg-muted/40")
    expect(content).toContain("data-striped={striped || undefined}")
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

  test("a pill badge stays full under square controls", async () => {
    for (const roleControl of ["md", "none"]) {
      const badge = await shipped("badge", { roleControl })
      expect(badge, roleControl).toContain("gap-1 rounded-full font-medium")
    }
    expect(
      await shipped("badge", { roleControl: "none", badgeShape: "rounded" }),
    ).toContain("gap-1 font-medium")
  })

  test("a keycap sets ⌘ and ⇧ in the sans face", async () => {
    const keycap = await shipped("kbd", { kbdTreatment: "keycap" })
    expect(keycap).toContain("font-sans text-xs")
    expect(keycap).not.toContain("font-mono")
  })

  test("grouped initials center on what the next avatar leaves visible", async () => {
    const group = await shipped("avatar")
    for (const pad of ["pr-1.5", "pr-2", "pr-2.5"])
      expect(group).toContain(
        `*:data-avatar:not-last:*:data-avatar-fallback:${pad}`,
      )
    expect(group).toContain("*:data-avatar:ring-2")
  })

  test("header label ink ships one class", async () => {
    const muted = await shipped("table")
    const strong = await shipped("table", { tableHeaderLabel: "strong" })
    expect(muted).toContain("text-fg-muted")
    expect(strong).not.toMatch(/column: [^\n]*text-fg-muted/)
  })
})
