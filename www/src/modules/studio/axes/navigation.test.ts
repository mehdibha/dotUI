import { describe, expect, test } from "vitest"

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
