import { describe, expect, test } from "vitest"

import { defaultPreset } from "@/lib/registry-preset"
import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

describe("navigation chapters", () => {
  test("defaults land on the registry defaults and add no tokens", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.componentParams.tabs).toEqual({
      style: "segmented",
      color: "neutral",
    })
    expect(ds.componentParams.accordion).toEqual({
      container: "divided",
      marker: "chevron",
      markerPosition: "trailing",
      motion: "expand",
    })
    expect(ds.componentParams.collapsible).toEqual({ motion: "expand" })
    expect(ds.componentParams.breadcrumbs).toEqual({
      separator: "chevron",
      tone: "muted",
    })
    expect(ds.componentParams.pagination).toEqual({ current: "outline" })
    expect(ds.tokens).toEqual({})
  })

  test("tabs: tabStyle sets the tabs style param", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, tabStyle: "enclosed" })
    expect(ds.componentParams.tabs).toEqual({
      style: "enclosed",
      color: "neutral",
    })
    expect(
      resolveDesignSystem({ ...DEFAULTS, tabsColor: "accent" }).componentParams
        .tabs,
    ).toEqual({ style: "segmented", color: "accent" })
  })

  test("accordion: container and marker axes set the accordion params", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      accordionContainer: "cards",
      accordionMarker: "plus",
      accordionMarkerPosition: "leading",
    })
    expect(ds.componentParams.accordion).toEqual({
      container: "cards",
      marker: "plus",
      markerPosition: "leading",
      motion: "expand",
    })
  })

  test("breadcrumbs and pagination params", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      breadcrumbSeparator: "slash",
      breadcrumbTone: "accent",
      paginationCurrent: "filled",
    })
    expect(ds.componentParams.breadcrumbs).toEqual({
      separator: "slash",
      tone: "accent",
    })
    expect(ds.componentParams.pagination).toEqual({ current: "filled" })
  })

  test("unknown values fall back to the defaults", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, tabStyle: "underline" })
    expect(ds.componentParams.tabs).toEqual({
      style: "segmented",
      color: "neutral",
    })
  })
})

const shipped = async (name: string, tokens: Record<string, string> = {}) => {
  const preset = defaultPreset()
  const mod = await publishables[name]?.()
  if (!mod) throw new Error(`${name} is not publishable`)
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset: { ...preset, tokens: { ...preset.tokens, ...tokens } },
  })
  return item.files?.[0]?.content ?? ""
}

describe("breadcrumbs motion", () => {
  test("ships shadcn's default timing: no duration or ease class", async () => {
    const content = await shipped("breadcrumbs")
    expect(content).toContain("leading-none transition-colors disabled:")
    expect(content).not.toMatch(/ (duration|ease)-/)
    expect(content).not.toContain("--studio-")
  })

  test("a tweak times the link's hover color", async () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      breadcrumbsMotion: { duration: 200, ease: [0, 0, 0.2, 1] },
    })
    expect(await shipped("breadcrumbs", tokens)).toContain(
      "transition-colors duration-200 ease-out disabled:",
    )
  })
})
