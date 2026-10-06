import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("navigation chapters", () => {
  test("defaults land on the registry defaults and add no tokens", () => {
    const ds = designSystemOf(DEFAULT_STATE)
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
    const ds = designSystemOf(parseState({ tabStyle: "enclosed" }))
    expect(ds.componentParams.tabs).toEqual({
      style: "enclosed",
      color: "neutral",
    })
    expect(
      designSystemOf(parseState({ tabsColor: "accent" })).componentParams.tabs,
    ).toEqual({ style: "segmented", color: "accent" })
  })

  test("accordion: container and marker axes set the accordion params", () => {
    const ds = designSystemOf(
      parseState({
        accordionContainer: "cards",
        accordionMarker: "plus",
        accordionMarkerPosition: "leading",
      }),
    )
    expect(ds.componentParams.accordion).toEqual({
      container: "cards",
      marker: "plus",
      markerPosition: "leading",
      motion: "expand",
    })
  })

  test("breadcrumbs and pagination params", () => {
    const ds = designSystemOf(
      parseState({
        breadcrumbSeparator: "slash",
        breadcrumbTone: "accent",
        paginationCurrent: "filled",
      }),
    )
    expect(ds.componentParams.breadcrumbs).toEqual({
      separator: "slash",
      tone: "accent",
    })
    expect(ds.componentParams.pagination).toEqual({ current: "filled" })
  })
})

const shipped = async (name: string, tokens: Record<string, string> = {}) => {
  const preset: PublishPreset = { density: "default", componentParams: {} }
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
    const { tokens } = designSystemOf(
      parseState({
        breadcrumbsMotion: { duration: 200, ease: [0, 0, 0.2, 1] },
      }),
    )
    expect(await shipped("breadcrumbs", tokens)).toContain(
      "transition-colors duration-200 ease-out disabled:",
    )
  })
})
