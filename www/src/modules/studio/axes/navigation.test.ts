import path from "node:path"
import { describe, expect, test } from "vitest"

import breadcrumbsMeta from "@/registry/ui/breadcrumbs/meta"
import segmentedControlMeta from "@/registry/ui/segmented-control/meta"
import tabsMeta from "@/registry/ui/tabs/meta"
import { extractStylesConfig } from "@/publisher/build-time/extract-config"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, effective, parseState } from "./index"

const UI = path.resolve(__dirname, "../../../registry/ui")
const config = (name: string) =>
  extractStylesConfig(path.join(UI, `${name}/styles.ts`)) as {
    params: Record<string, any>
  }
const params = (state: Record<string, unknown>) =>
  designSystemOf(parseState(state)).componentParams

describe("navigation axes", () => {
  test("Origin lands on every registry default", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.componentParams.tabs).toEqual({
      style: "segmented",
      color: "neutral",
      pill: "tone",
      weight: "medium",
      chip: "tone",
      track: "filled",
    })
    expect(ds.componentParams.sidebar).toMatchObject({
      marker: "fill",
      weight: "medium",
    })
    expect(ds.componentParams["segmented-control"]?.weight).toBe("medium")
    expect(ds.componentParams.breadcrumbs).toEqual({
      separator: "chevron",
      ancestors: "muted",
    })
    expect(ds.tokens).toEqual({})
  })

  test("segmented tabs wear the segmented control's chip and track", () => {
    expect(
      params({ segmentedSelected: "ring", segmentedTrack: "outline" }).tabs,
    ).toMatchObject({ chip: "ring", track: "outline" })
    // Auto follows the button style there too.
    expect(params({ buttonStyle: "bevel" }).tabs?.chip).toBe("raised")
  })

  test("pill tabs follow the toggle's selected look until overridden", () => {
    expect(params({ toggleSelected: "solid" }).tabs?.pill).toBe("solid")
    expect(params({ toggleSelected: "inverse" }).tabs?.pill).toBe("inverse")
    expect(
      params({ toggleSelected: "tint", tabsPill: "tone" }).tabs?.pill,
    ).toBe("tone")
  })

  test("one weight for tabs, sidebar items and segmented items", () => {
    const at = params({ navWeight: "regular-semibold" })
    expect(at.tabs?.weight).toBe("regular-semibold")
    expect(at.sidebar?.weight).toBe("regular-semibold")
    expect(at["segmented-control"]?.weight).toBe("regular-semibold")
    // Typography's label weight stays on actions.
    expect(params({ labelWeight: "bold" }).tabs?.weight).toBe("medium")
  })

  test.each([
    ["fill", "neutral", "fill"],
    ["fill", "accent", "fill-accent"],
    ["bar", "accent", "bar-accent"],
    ["fill-bar", "accent", "fill-bar-accent"],
    ["ink", "accent", "ink-accent"],
    ["outline", "accent", "outline-accent"],
    ["surface", "accent", "surface"],
  ])("marker %s in %s folds to %s", (navMarker, tabsColor, marker) => {
    const at = params({ navMarker, tabsColor, shellTone: "recessed" })
    expect(at.sidebar?.marker).toBe(marker)
    expect(at.tabs?.color).toBe(tabsColor)
  })

  test("a page-toned sidebar can't carry the Surface chip", () => {
    const state = parseState({ navMarker: "surface", shellTone: "page" })
    expect(designSystemOf(state).componentParams.sidebar?.marker).toBe("fill")
    expect(effective(state).explain.navMarker?.exclude?.cause).toBe("shellTone")
    expect(state.navMarker).toBe("surface")
  })

  test("ancestors drawn as links fold the link color and underline", () => {
    expect(params({ breadcrumbTone: "link" }).breadcrumbs?.ancestors).toBe(
      "accent-never",
    )
    expect(
      params({
        breadcrumbTone: "link",
        linkColor: "neutral",
        linkUnderline: "hover",
      }).breadcrumbs?.ancestors,
    ).toBe("neutral-hover")
    expect(params({ linkUnderline: "always" }).breadcrumbs?.ancestors).toBe(
      "muted",
    )
  })
})

/* Shared recipes: the follower imports the leader's consts, so each value
   resolves to the same classes on both. */
describe("navigation recipes", () => {
  const tabs = config("tabs")
  const segmented = config("segmented-control")

  test("segmented tabs: the segmented control's chips and tracks", () => {
    for (const value of segmentedControlMeta.params.selected.values)
      expect(tabs.params.chip[value].variants.variant.segmented).toEqual(
        segmented.params.selected[value].slots,
      )
    for (const value of segmentedControlMeta.params.track.values)
      expect(tabs.params.track[value].variants.variant.segmented.list).toEqual(
        segmented.params.track[value].slots.root,
      )
  })

  test("tabs and segmented items share every weight", () => {
    expect(tabsMeta.params.weight.values).toEqual(
      segmentedControlMeta.params.weight.values,
    )
    for (const value of tabsMeta.params.weight.values)
      expect(tabs.params.weight[value].slots).toEqual(
        segmented.params.weight[value].slots,
      )
  })

  test("link ancestors are the link recipe", () => {
    const link = config("link").params
    const crumbs = config("breadcrumbs").params.ancestors
    const classes = (value: unknown) => [value].flat().join(" ")
    for (const value of breadcrumbsMeta.params.ancestors.values) {
      if (value === "muted") continue
      const [color, underline] = value.split("-") as [string, string]
      const expected = [
        link.color[color].variants.variant.default,
        link.underline[underline].variants?.variant.default,
      ]
        .filter(Boolean)
        .join(" ")
      expect(classes(crumbs[value].variants.isCurrent.false.link), value).toBe(
        expected,
      )
    }
  })
})
