import { describe, expect, test } from "vitest"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("navigation chapters", () => {
  test("defaults land on the registry defaults and add no tokens", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.componentParams.tabs).toEqual({
      style: "segmented",
      color: "neutral",
    })
    expect(ds.componentParams.collapsible).toEqual({ motion: "expand" })
    expect(ds.componentParams.breadcrumbs).toEqual({
      separator: "chevron",
      tone: "muted",
    })
    expect(ds.componentParams.pagination).toEqual({ current: "secondary" })
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

  test("breadcrumbs and pagination params", () => {
    const ds = designSystemOf(
      parseState({
        breadcrumbSeparator: "slash",
        breadcrumbTone: "accent",
        paginationCurrent: "primary",
      }),
    )
    expect(ds.componentParams.breadcrumbs).toEqual({
      separator: "slash",
      tone: "accent",
    })
    expect(ds.componentParams.pagination).toEqual({ current: "primary" })
  })
})
