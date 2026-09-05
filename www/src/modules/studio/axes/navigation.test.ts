import { describe, expect, test } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

describe("navigation chapters", () => {
  test("defaults land on the registry defaults and add no tokens", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.componentParams.tabs).toEqual({ style: "line" })
    expect(ds.componentParams.accordion).toEqual({ container: "divided" })
    expect(ds.componentParams.disclosure).toEqual({
      marker: "chevron",
      markerPosition: "trailing",
    })
    expect(ds.componentParams.breadcrumbs).toEqual({
      separator: "chevron",
      tone: "muted",
    })
    expect(ds.componentParams.pagination).toEqual({ current: "filled" })
    expect(ds.tokens).toEqual({})
  })

  test("tabs: tabStyle sets the tabs style param", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, tabStyle: "enclosed" })
    expect(ds.componentParams.tabs).toEqual({ style: "enclosed" })
  })

  test("accordion: container goes to accordion, marker axes to disclosure", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      accordionContainer: "cards",
      accordionMarker: "plus",
      accordionMarkerPosition: "leading",
    })
    expect(ds.componentParams.accordion).toEqual({ container: "cards" })
    expect(ds.componentParams.disclosure).toEqual({
      marker: "plus",
      markerPosition: "leading",
    })
  })

  test("breadcrumbs and pagination params", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      breadcrumbSeparator: "slash",
      breadcrumbTone: "accent",
      paginationCurrent: "outline",
    })
    expect(ds.componentParams.breadcrumbs).toEqual({
      separator: "slash",
      tone: "accent",
    })
    expect(ds.componentParams.pagination).toEqual({ current: "outline" })
  })

  test("unknown values fall back to the defaults", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, tabStyle: "segmented" })
    expect(ds.componentParams.tabs).toEqual({ style: "line" })
  })
})
