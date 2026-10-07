import { cn } from "tailwind-variants"
import { describe, expect, it } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { DENSITIES } from "@/registry/types"
import badgeMeta from "@/registry/ui/badge/meta"
import tagGroupMeta from "@/registry/ui/tag-group/meta"
import toastMeta from "@/registry/ui/toast/meta"
import { flatten } from "@/publisher/flatten"
import { publish, selectPublishable } from "@/publisher/publish"
import type { ClassValue, PublishPreset } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import { STYLE_OPTIONS as ALERT_OPTIONS } from "./alert.meta"
import { CASE_OPTIONS, SHAPE_OPTIONS, STYLE_OPTIONS } from "./badges.meta"
import { DEFAULT_STATE, effective, parseState } from "./index"
import { TRACK_OPTIONS, TRACK_STYLE_OPTIONS } from "./progress.meta"
import { STYLE_OPTIONS as SPINNER_OPTIONS } from "./spinner.meta"

const classes = (value: ClassValue | undefined): string[] =>
  [value]
    .flat(Infinity as 1)
    .filter(Boolean)
    .join(" ")
    .split(" ")
    .filter(Boolean)

async function config(name: string) {
  const mod = await publishables[name]?.()
  if (!mod) throw new Error(`${name} is not publishable`)
  return mod.publishable
}

async function ship(name: string, raw: Record<string, unknown> = {}) {
  const ds = designSystemOf(parseState(raw))
  const preset: PublishPreset = {
    density: ds.density,
    componentParams: ds.componentParams,
    tokens: ds.tokens,
    color: ds.color,
    icons: ds.icons,
  }
  const mod = await publishables[name]?.()
  if (!mod) throw new Error(`${name} is not publishable`)
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset,
  })
  const code = (item.files ?? []).map((f) => f.content).join("\n")
  expect(code).not.toContain("--studio-")
  return code
}

describe("feedback axes", () => {
  it("Origin resolves to the registry defaults and no tokens", () => {
    const ds = designSystemOf(DEFAULT_STATE)
    expect(ds.tokens).toEqual({})
    expect(ds.componentParams.badge).toEqual({
      style: "solid",
      case: "sentence",
    })
    expect(ds.componentParams["tag-group"]).toEqual({ style: "solid" })
    expect(ds.componentParams.alert).toEqual({ style: "neutral" })
    expect(ds.componentParams.toast).toMatchObject({
      surface: "surface",
      status: "icon",
    })
    expect(ds.componentParams.loader).toEqual({ style: "ring" })
    expect(ds.componentParams.skeleton).toEqual({ animation: "shimmer" })
    expect(ds.componentParams["progress-bar"]).toEqual({
      track: "thin",
      trackStyle: "plain",
    })
  })

  it("each axis lands on its param", () => {
    const ds = designSystemOf(
      parseState({
        badgeStyle: "soft-outline",
        badgeCase: "uppercase",
        alertStyle: "inverse",
        toastStyle: "inverse",
        toastStatus: "bold",
        spinnerStyle: "ring-track",
        skeletonAnimation: "pulse",
        progressTrack: "x-heavy",
        progressTrackStyle: "gap",
      }),
    )
    expect(ds.componentParams.badge).toEqual({
      style: "soft-outline",
      case: "uppercase",
    })
    expect(ds.componentParams["tag-group"]).toEqual({ style: "soft-outline" })
    expect(ds.componentParams.alert).toEqual({ style: "inverse" })
    expect(ds.componentParams.toast).toMatchObject({
      surface: "inverse",
      status: "bold",
    })
    expect(ds.componentParams.loader).toEqual({ style: "ring-track" })
    expect(ds.componentParams.skeleton).toEqual({ animation: "pulse" })
    expect(
      designSystemOf(parseState({ toastStyle: "inverse" })).componentParams
        .toast,
    ).toMatchObject({ surface: "inverse", status: "solid-icon" })
    expect(ds.componentParams["progress-bar"]).toEqual({
      track: "x-heavy",
      trackStyle: "gap",
    })
    expect(ds.tokens).toEqual({})
  })

  it("Rounded badges read the detail rung; tags keep their corners", () => {
    const ds = designSystemOf(parseState({ badgeShape: "rounded" }))
    expect(ds.tokens).toEqual({
      "--studio-badge-radius": "var(--studio-radius-detail)",
    })
  })

  it("the progress fill follows the buttons or the checks", () => {
    const fill = (raw: Record<string, unknown>) => {
      const state = parseState(raw)
      return [
        effective(state).values.progressColor,
        designSystemOf(state).tokens["--studio-progress-fill-color"],
      ]
    }
    expect(fill({})).toEqual(["accent", undefined])
    expect(fill({ progressColor: "same-checks" })).toEqual([
      "checks",
      undefined,
    ])
    // Off the selection leaf the checks paint their own source.
    expect(
      fill({ progressColor: "same-checks", checkboxColor: "neutral" }),
    ).toEqual(["checks", "var(--color-inverse)"])
    // On it they paint the selection tokens.
    expect(
      fill({
        progressColor: "same-checks",
        buttonColor: "neutral",
        selectionColor: "accent",
      }),
    ).toEqual(["checks", "var(--color-selection)"])
    expect(fill({ buttonColor: "neutral" })).toEqual(["neutral", undefined])
  })

  it("Same as checks paints the selection seed, not the brand (Claude)", () => {
    const state = parseState({
      progressColor: "same-checks",
      selectionSeed: "#2a78d6",
    })
    expect(designSystemOf(state).tokens["--studio-progress-fill-color"]).toBe(
      "var(--color-selection)",
    )
    expect(
      designSystemOf(parseState({ selectionSeed: "#2a78d6" })).tokens,
    ).not.toHaveProperty("--studio-progress-fill-color")
  })
})

describe("chips: one recipe for badge and tag-group", () => {
  it("both take the same style table", async () => {
    const badge = (await config("badge")).stylesConfig
    const tag = (await config("tag-group")).stylesConfig
    expect(tag.params?.style).toEqual(badge.params?.style)
    expect(Object.keys(badge.params?.style ?? {})).toEqual(
      STYLE_OPTIONS.map((o) => o.value),
    )
  })

  it("every style paints the badge and the tag with the same classes", async () => {
    const badge = (await config("badge")).stylesConfig
    const tag = (await config("tag-group")).stylesConfig
    for (const { value } of STYLE_OPTIONS)
      for (const density of DENSITIES) {
        const b = flatten({
          stylesConfig: badge,
          meta: badgeMeta,
          density,
          paramSelections: { style: value },
        })
        const t = flatten({
          stylesConfig: tag,
          meta: tagGroupMeta,
          density,
          paramSelections: { style: value },
        })
        const appearance = b.defaultVariants?.appearance
        expect(t.defaultVariants?.appearance, value).toBe(appearance)
        const tagSlice = t.variants?.appearance?.[appearance!] as Record<
          string,
          ClassValue
        >
        expect(classes(tagSlice.tag), value).toEqual(
          classes(b.variants?.appearance?.[appearance!] as ClassValue),
        )
      }
  })
})

/* Every reachable selection of every feedback item, flattened: no slot and
   no variant slice ships two classes that merge into one. */
describe("shipped classes", () => {
  const SELECTIONS: Record<string, Record<string, string>[]> = {
    badge: STYLE_OPTIONS.flatMap(({ value: style }) =>
      CASE_OPTIONS.map(({ value }) => ({ style, case: value })),
    ),
    "tag-group": STYLE_OPTIONS.map(({ value }) => ({ style: value })),
    alert: ALERT_OPTIONS.map(({ value }) => ({ style: value })),
    toast: toastMeta.params.surface.values.flatMap((surface) =>
      toastMeta.params.status.values.map((status) => ({ surface, status })),
    ),
    "progress-bar": TRACK_OPTIONS.flatMap(({ value: track }) =>
      TRACK_STYLE_OPTIONS.map(({ value }) => ({ track, trackStyle: value })),
    ),
  }

  it.each(Object.keys(SELECTIONS))("%s", async (name) => {
    const { stylesConfig, meta } = await config(name)
    for (const selection of SELECTIONS[name]!)
      for (const density of DENSITIES) {
        const layer = flatten({
          stylesConfig,
          meta,
          density,
          paramSelections: selection,
        })
        const slots = layer.slots ?? { base: layer.base }
        const lists: [string, string[]][] = Object.entries(slots).map(
          ([slot, value]) => [slot, classes(value)],
        )
        for (const [variant, values] of Object.entries(layer.variants ?? {}))
          for (const [value, slice] of Object.entries(values))
            if (typeof slice === "object" && slice && !Array.isArray(slice))
              for (const [slot, v] of Object.entries(slice))
                lists.push([`${variant}=${value}.${slot}`, classes(v)])
            else lists.push([`${variant}=${value}`, classes(slice)])
        for (const [where, list] of lists)
          expect(
            cn(list.join(" "))?.split(" ").sort() ?? [],
            `${name} ${JSON.stringify(selection)} ${density} ${where}`,
          ).toEqual([...list].sort())
      }
  })

  it("a status toast's fill and edge replace the surface's", async () => {
    const { stylesConfig, meta } = await config("toast")
    for (const surface of ["surface", "inverse"])
      for (const status of ["bold", "soft"])
        for (const variant of [
          "success",
          "warning",
          "danger",
          "error",
          "info",
        ]) {
          const layer = flatten({
            stylesConfig,
            meta,
            density: "default",
            paramSelections: { surface, status },
          })
          const slice = layer.variants?.variant?.[variant] as Record<
            string,
            ClassValue
          >
          const where = `${surface} ${status} ${variant}`
          const merged = cn(
            [...classes(layer.slots?.toast), ...classes(slice.toast)].join(" "),
          )!.split(" ")
          expect(merged, where).not.toContain("bg-popover/(--popover-alpha)")
          expect(merged, where).not.toContain("bg-inverse")
          expect(merged, where).not.toContain("border-(--overlay-border)")
          expect(merged, where).not.toContain("text-fg")
          expect(merged, where).not.toContain("text-fg-inverse")
          expect(slice.icon, where).toBeUndefined()
        }
  })
})

describe("shipped code", () => {
  it("Origin toasts carry the status in the icon only, and act with a button", async () => {
    const code = await ship("toast")
    expect(code).not.toContain("border-border-success")
    expect(code).toContain('icon: "text-fg-success"')
    expect(code).toContain("buttonStyles({")
    expect(code).toContain('from "@/components/ui/button"')
  })

  it("inverse toasts ship solid status icons and a quiet action", async () => {
    const code = await ship("toast", { toastStyle: "inverse" })
    for (const status of ["success", "warning", "danger", "info"])
      expect(code).toContain(`icon: "text-${status}"`)
    expect(code).not.toContain("text-fg-danger")
    expect(code).not.toContain("[--color-")
    expect(code).toContain("const inverseSurface = true")
    expect(code).toContain('variant: onFill ? "quiet" : "secondary"')
    expect(code).toContain(
      'action: "text-current hover:bg-current/10 pressed:bg-current/20"',
    )
  })

  it("bold status toasts act with the quiet button; soft ones do not", async () => {
    expect(await ship("toast", { toastStatus: "bold" })).toContain(
      "const solidStatus = true",
    )
    expect(
      await ship("toast", { toastStyle: "inverse", toastStatus: "soft" }),
    ).toContain("const solidStatus = false")
    expect(await ship("toast")).toContain("const inverseSurface = false")
  })

  it("the ring draws its own arc; each spinner ships its own file", async () => {
    const ring = await ship("loader")
    expect(ring).toContain('d="M21 12a9 9 0 1 1-6.219-8.56"')
    expect(ring).not.toContain("Icon")
    for (const { value } of SPINNER_OPTIONS)
      expect(await ship("loader", { spinnerStyle: value })).toContain(
        "animate-",
      )
    expect(await ship("loader", { spinnerStyle: "ring-track" })).toContain(
      'strokeOpacity="0.25"',
    )
  })

  it("the progress fill ships the primary, or the checks' fill", async () => {
    expect(await ship("progress-bar")).toContain("bg-primary")
    expect(
      await ship("progress-bar", {
        progressColor: "same-checks",
        checkboxColor: "neutral",
      }),
    ).toContain("bg-inverse")
  })

  it("an uppercase badge ships caps one size down", async () => {
    const code = await ship("badge", { badgeCase: "uppercase" })
    expect(code).toContain("text-[0.6875rem] tracking-wider uppercase")
    expect(code).not.toContain("text-xs")
  })

  it("dot badges ship a neutral hairline pill with a status dot", async () => {
    const code = await ship("badge", { badgeStyle: "dot" })
    expect(code).toContain('appearance: "dot"')
    expect(code).toContain("before:bg-(--chip-dot,var(--chip-fill))")
    expect(code).toContain("[--chip-dot:var(--color-fg-muted)]")
  })

  it("rounded badges ship the detail rung", async () => {
    expect(await ship("badge", { badgeShape: "rounded" })).toMatch(
      /rounded-(sm|md|xs|\[[^\]]+\])/,
    )
    expect(await ship("badge")).toContain("rounded-full")
    expect(SHAPE_OPTIONS.map((o) => o.value)).toEqual(["pill", "rounded"])
  })
})
