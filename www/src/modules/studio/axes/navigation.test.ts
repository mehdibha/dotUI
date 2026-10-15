import path from "node:path"
import { cn } from "tailwind-variants"
import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { DENSITIES } from "@/registry/types"
import type { Density } from "@/registry/types"
import breadcrumbsMeta from "@/registry/ui/breadcrumbs/meta"
import { UPPERCASE } from "@/registry/ui/button/styles"
import linkMeta from "@/registry/ui/link/meta"
import segmentedControlMeta from "@/registry/ui/segmented-control/meta"
import sidebarMeta from "@/registry/ui/sidebar/meta"
import tabsMeta from "@/registry/ui/tabs/meta"
import toggleButtonMeta from "@/registry/ui/toggle-button/meta"
import { extractStylesConfig } from "@/publisher/build-time/extract-config"
import { flatten } from "@/publisher/flatten"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, effective, parseState } from "./index"

const UI = path.resolve(__dirname, "../../../registry/ui")
// The label indicator insets by the tab's own padding.
const LABEL_INSET: Record<Density, string> = {
  compact: "1.5",
  default: "1.5",
  comfortable: "2",
  spacious: "3",
  touch: "4",
}
const config = (name: string) =>
  extractStylesConfig(path.join(UI, `${name}/styles.ts`)) as {
    params: Record<string, any>
  }
const params = (state: Record<string, unknown>) =>
  designSystemOf(parseState(state)).componentParams

const shipped = async (name: string, state: Record<string, unknown> = {}) => {
  const ds = designSystemOf(parseState(state))
  const preset: PublishPreset = {
    density: ds.density,
    componentParams: ds.componentParams,
    tokens: ds.tokens,
    color: ds.color,
    icons: ds.icons,
  }
  const { item } = publish({
    publishable: selectPublishable(await publishables[name]!(), preset),
    preset,
  })
  return item.files?.[0]?.content ?? ""
}

describe("navigation axes", () => {
  test("Origin lands on every registry default", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.componentParams.tabs).toEqual({
      style: "segmented",
      color: "neutral",
      indicator: "full",
      pill: "tone",
      weight: "medium",
      case: "sentence",
      chip: "tone",
      track: "filled",
    })
    expect(ds.componentParams.collapsible).toEqual({ motion: "expand" })
    expect(ds.componentParams.sidebar).toMatchObject({
      marker: "fill",
      weight: "regular-medium",
      case: "sentence",
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
    expect(params({ style: "tactile", buttonStyle: "bevel" }).tabs?.chip).toBe(
      "raised",
    )
  })

  test("pill tabs follow the toggle's selected look until overridden", () => {
    expect(params({ toggleSelected: "solid" }).tabs?.pill).toBe("solid")
    expect(params({ toggleSelected: "inverse" }).tabs?.pill).toBe("inverse")
    expect(
      params({ toggleSelected: "tint", tabsPill: "tone" }).tabs?.pill,
    ).toBe("tone")
  })

  test("one weight for tabs and segmented items; sidebar items follow", () => {
    const at = params({ navWeight: "regular-semibold" })
    expect(at.tabs?.weight).toBe("regular-semibold")
    expect(at.sidebar?.weight).toBe("regular-semibold")
    expect(at["segmented-control"]?.weight).toBe("regular-semibold")
    // Auto keeps shadcn's sidebar a step under its medium tabs.
    expect(params({}).sidebar?.weight).toBe("regular-medium")
    expect(params({ navItemWeight: "medium" }).sidebar?.weight).toBe("medium")
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
    ["pill", "neutral", "pill"],
    ["pill", "accent", "pill-accent"],
    ["surface", "accent", "surface"],
  ])("marker %s in %s folds to %s", (navMarker, tabsColor, marker) => {
    const at = params({ navMarker, tabsColor, shellTone: "recessed" })
    expect(at.sidebar?.marker).toBe(marker)
    expect(at.tabs?.color).toBe(tabsColor)
  })

  test("Pill rounds the sidebar items alone, whatever the item radius", () => {
    for (const tabsColor of ["neutral", "accent"])
      expect(
        designSystemOf(parseState({ navMarker: "pill", tabsColor })).tokens,
      ).toEqual({ "--studio-sidebar-button-radius": "var(--radius-full)" })
    expect(designSystemOf(parseState({ navMarker: "fill" })).tokens).toEqual({})
  })

  test("labels take the buttons' case until overridden", () => {
    const at = params({ buttonCase: "uppercase" })
    expect(at.tabs?.case).toBe("uppercase")
    expect(at.sidebar?.case).toBe("uppercase")
    expect(at["segmented-control"]?.case).toBe("uppercase")
    expect(
      params({ buttonCase: "uppercase", navCase: "sentence" }).tabs?.case,
    ).toBe("sentence")
    expect(params({ navCase: "uppercase" }).sidebar?.case).toBe("uppercase")
  })

  test("the line indicator hugs the label on Label", () => {
    expect(params({ tabIndicator: "label" }).tabs?.indicator).toBe("label")
  })

  test.each(["page", "subtle"])(
    "a %s sidebar can't carry the Surface chip",
    (shellTone) => {
      const state = parseState({ navMarker: "surface", shellTone })
      expect(designSystemOf(state).componentParams.sidebar?.marker).toBe("fill")
      expect(effective(state).explain.navMarker?.exclude?.cause).toBe(
        "shellTone",
      )
      expect(state.navMarker).toBe("surface")
    },
  )

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

/* Shared recipes: the follower imports the leader's consts, or (where a
   selector differs) re-types them under a parity test. */
describe("navigation recipes", () => {
  const tabs = config("tabs")
  const segmented = config("segmented-control")
  const classes = (value: unknown) => [value].flat(Infinity).join(" ")

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

  test("pill tabs: a quiet toggle's selected ink and fill", () => {
    const toggle = config("toggle-button").params.selected
    const quiet = (value: string) =>
      classes(toggle[value].base ?? toggle[value].variants.variant.quiet).split(
        " ",
      )
    for (const value of toggleButtonMeta.params.selected.values) {
      const pill = tabs.params.pill[value].variants.variant.pill
      const ink = quiet(value).filter((c) => c.startsWith("selected:text-"))
      const fill = quiet(value)
        .filter((c) => !c.startsWith("selected:text-"))
        .map((c) =>
          c
            .replace("selected:hover:", "group-hover/tab:")
            .replace("selected:pressed:", "group-pressed/tab:")
            .replace("selected:", ""),
        )
      expect(classes(pill.item), value).toBe(ink.join(" "))
      expect(classes(pill.indicator), value).toBe(fill.join(" "))
    }
  })

  test("tabs, segmented and sidebar items share every weight", () => {
    const sidebar = config("sidebar").params.weight
    expect(tabsMeta.params.weight.values).toEqual(
      segmentedControlMeta.params.weight.values,
    )
    expect(sidebarMeta.params.weight.values).toEqual(
      segmentedControlMeta.params.weight.values,
    )
    for (const value of tabsMeta.params.weight.values) {
      const item = segmented.params.weight[value].slots
      expect(tabs.params.weight[value].slots).toEqual(item)
      const active = classes(item.item).replaceAll("selected:", "data-active:")
      expect(classes(sidebar[value].slots.menuButton), value).toBe(active)
      expect(classes(sidebar[value].slots.menuSubButton), value).toBe(active)
    }
  })

  test("every marker keeps its current fill and ink under the pointer", () => {
    const sidebar = config("sidebar") as any
    for (const value of sidebarMeta.params.marker.values)
      for (const slot of ["menuButton", "menuSubButton"]) {
        const list = classes([
          sidebar.base.slots[slot],
          sidebar.params.marker[value].slots[slot],
        ]).split(" ")
        for (const c of list) {
          const hit = /^(?:hover|pressed):(bg|text)-/.exec(c)
          const active =
            hit && list.find((a) => a.startsWith(`data-active:${hit[1]}-`))
          if (active)
            expect(c.replace(/^(hover|pressed):/, "data-active:"), value).toBe(
              active,
            )
        }
      }
  })

  test("link buttons and link ancestors are the link recipe", () => {
    const link = config("link").params
    const crumbs = config("breadcrumbs").params.ancestors
    const recipe = (color: string, underline: string) =>
      [
        link.color[color].variants.variant.default,
        link.underline[underline].variants?.variant.default,
      ]
        .filter(Boolean)
        .map(classes)
        .join(" ")
    for (const value of breadcrumbsMeta.params.ancestors.values) {
      if (value === "muted") continue
      const [color, underline] = value.split("-") as [string, string]
      // The current crumb drops the weight and underline it would inherit.
      const own = classes(crumbs[value].slots.link)
        .replace(" current:font-normal", "")
        .replace(" current:no-underline", "")
      expect(own, value).toBe(recipe(color, underline))
    }
    for (const name of ["button", "toggle-button"]) {
      const button = config(name).params
      for (const value of linkMeta.params.underline.values)
        expect(
          button.linkUnderline[value].variants?.variant.link,
          `${name} ${value}`,
        ).toEqual(link.underline[value].variants?.variant.default)
      // A link button keeps its label weight.
      for (const value of linkMeta.params.color.values)
        expect(
          classes(button.linkColor[value].variants.variant.link),
          `${name} ${value}`,
        ).toBe(
          classes(link.color[value].variants.variant.default).replace(
            "font-medium ",
            "",
          ),
        )
    }
  })
})

describe("navigation case, pill marker and line indicator", () => {
  const classes = (value: unknown) => [value].flat(Infinity).join(" ")

  test("uppercase labels are the buttons' case, off the select guard", () => {
    const button = config("button").params.case.uppercase.base
    expect(
      classes(button).replaceAll("not-has-data-[slot=select-value]:", ""),
    ).toBe(UPPERCASE)
    expect(config("tabs").params.case.uppercase.slots.item).toBe(UPPERCASE)
    expect(config("segmented-control").params.case.uppercase.slots.item).toBe(
      UPPERCASE,
    )
    expect(config("sidebar").params.case.uppercase.slots).toEqual({
      menuButton: UPPERCASE,
      menuSubButton: UPPERCASE,
    })
  })

  test("the pill marker is the fill marker on a stadium item", () => {
    const marker = config("sidebar").params.marker
    expect(marker.pill).toEqual(marker.fill)
    expect(marker["pill-accent"]).toEqual(marker["fill-accent"])
  })

  test("shipped Pill rounds the menu buttons alone", async () => {
    const pill = await shipped("sidebar", { navMarker: "pill" })
    const origin = await shipped("sidebar")
    const count = (content: string) => content.match(/rounded-full/g)?.length
    // Menu and sub-menu buttons; labels, actions and badges keep the rung.
    expect(count(pill)).toBe((count(origin) ?? 0) + 2)
    expect(/peer\/menu-button[^"]*rounded-full/.test(pill)).toBe(true)
    expect(pill).not.toContain("--studio-")
  })

  test.each(DENSITIES)(
    "the line indicator ships one position and size (%s)",
    (density) => {
      for (const indicator of tabsMeta.params.indicator.values) {
        const flat = flatten({
          stylesConfig: config("tabs") as never,
          meta: tabsMeta,
          density,
          paramSelections: { indicator, style: "line" },
        }) as { slots: Record<string, unknown>; variants: any }
        const value = classes([
          flat.slots.indicator,
          flat.variants.variant.line.indicator,
        ])
        expect(cn(value)?.split(" ").sort(), indicator).toEqual(
          value.split(" ").sort(),
        )
        if (indicator === "label")
          expect(value).toContain(
            `orientation-horizontal:inset-x-${LABEL_INSET[density]}`,
          )
      }
    },
  )
})
